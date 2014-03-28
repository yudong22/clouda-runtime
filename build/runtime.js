/*! clouda-runtime - v0.1.0 - 2014-03-28 02:03:02 */
(function(window){
    // for client js only
    if (typeof window !== 'object')return ;
    
    if (typeof window.clouda === 'undefined') {
        window.clouda = {};
    }
    var clouda = window.clouda;
    
    if (typeof clouda.lightapp !== 'function') {//可能异步加载
        clouda.lightapp = function(ak,callback){
            clouda.lightapp.ak = ak;
            if (typeof callback === 'function'){
                callback();
            }
            
        };
    }
    clouda.STATUS = {
        SUCCESS:0,//在 runtimeready 后会执为1
        SYSTEM_FAILURE:-3,
        USER_CANCELED:-2
    };
    clouda.RUNTIMES = {
        WEB:0,
        KUANG:1,//高优先级
        NUWA:2
    };
    (function(){
        if( typeof BLightApp !== 'undefined' ){
            clouda.STATUS.SUCCESS = 1;
            clouda.RUNTIME = clouda.RUNTIMES.KUANG;
        }else{
           clouda.RUNTIME = clouda.RUNTIMES.WEB;
        }
    })();
    //定义错误格式
    var ErrCode = {
        //不符合预期
        UNKNOW_CALLBACK:-1,
        
        //不符合预期的input
        UNKNOW_INPUT:-99,
        
        //用户取消
        // USER_CANCEL:-2,
        
        //RUNTIME ERROR
        AK_UNDEFINED:-4,
        
        RT_GETERROR:5,
        
        EXEC_ERROR:-5,
        NOT_FINISH:-98,
        //API ERROR
        ACC_GET_ERR:6,
        LOC_GET_ERR:7,
        CAP_GET_ERR:8,
        CONTACT_FIND_ERR:9,
        GLO_ERR:10,
        REACH_ERR:11,//reachability
        MEDIA_ERR:12,
        CPS_ERROR:13,
        BTY_ERROR:14,
        QR_ERR:15,
        FS_ERR:16,
        BTY_ERR:17,
        CONNECT_ERROR:18,
        SCREEN_ERROR:19,
        FR_ERROR:20,
        PUSH_ERR:21,
        GYRO_ERR:22,
        MAP_ERROR:23,
        LOGIN_ERROR:24,
        PCS_ERROR:25,
        DEVICE_ERR:26,
        PAY_ERROR:27,
        APP_ERROR:28
        
    };
    var errorMessage = {
      0:"成功",
      "-1":"接口返回不符合预期",
      "-2":"用户取消",
      "-3":"接口的运行环境不存在。",
      "-4":"错误，您需要在调用api前设置ak。 clouda.lightapp(your_ak_here);",
      "-5":"执行接口出错。",
      "-98":"接口未提供。",
      "-99":"接口输入不符合预期。",
      5:"接口的运行环境准备中出错。",
      6:"accelerometer 接口返回错误",
      7:"geolocation 接口返回错误",
    };
    
    //第一个是接口层错误号，第二个是app层错误号，第三个是options，如果定义了onfail要触发
    var runtimeError  = function(errno,apperrno,options){
        //整合errno
        if (errno < 0 ){//如果是用户取消或者接口不符标准，直接覆盖传入
            apperrno = errno;
        }
        if (typeof options === 'object' && typeof options.onfail === 'function'){
            options.onfail(apperrno);
        }
        
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            var word = errorMessage[errno];
            if (!word){
                for(var c in ErrCode){
                    if (ErrCode[c] === errno) {
                        word = c + ":" + errno;
                        break;
                    }
                }
                
            }
            console.error(word + (apperrno?" app错误信息"+JSON.stringify(apperrno):"")+ stackStr[2].replace(/\s*/,""));
        }
    };
    
    var delegateClass = function(module,submodule,func){
        this.module = module;
        this.submodule = submodule;
        this.func = func;
        return (function(that){
            return function(){
                that.exec.apply(that, arguments);
            };
        })(this);
    };
    delegateClass.prototype.exec = function(){
        var args = arguments;
        var _this = this;
        installPlugin(this.module,function(module){
            try{
                // for (var i in module){
                    // console.log(i);
                // }
                if (!_this.func){//二级目录
                    module[_this.submodule].apply(_this,args);
                }else{
                    module[_this.submodule][_this.func].apply(_this,args);
                }
            }catch(e){
                var code;
                if (!module){
                    code = clouda.STATUS.SYSTEM_FAILURE;
                }else{
                    code = ErrCode.EXEC_ERROR;
                }
                if (args.length && typeof args[args.length-1] === 'object' ){//检查 onfail
                    if (typeof args[args.length-1].onfail === 'function'){
                        args[args.length-1].onfail(code);
                    }
                }
                console.error(e.stack);
                _this.error(code);
            }
            
        });
    };
    clouda.lightapp.error = delegateClass.prototype.error = runtimeError;
    
    //定义
    var beforeRuntimeReadyStack = [];
    var beforeDownloadReadyStack = [];
    document.addEventListener("runtimeready",function(){
        clouda.STATUS.SUCCESS = 1;
        if (clouda.RUNTIME != clouda.RUNTIMES.KUANG){//高优先级
            clouda.RUNTIME = clouda.RUNTIMES.NUWA;
        }
        
        if (beforeRuntimeReadyStack.length){
            for(var i=0,len=beforeRuntimeReadyStack.length;i<len;i++){
                installPlugin.apply(undefined,beforeRuntimeReadyStack[i]);
            }
            beforeRuntimeReadyStack.length = 0;
        }
    });
    var n=0; //6s后超时
    setTimeout(function(){
        n=100;//timeout!
        if (beforeRuntimeReadyStack.length){
            for(var i=0,len=beforeRuntimeReadyStack.length;i<len;i++){
                installPlugin.apply(undefined,beforeRuntimeReadyStack[i]);
            }
            beforeRuntimeReadyStack.length = 0;
        }
    },6000);
    var regPlugins = {};
    var regCallbacks={};
    var installPlugin = function(pluginName,callback,options){
        if (!clouda.lightapp.ak) {
            runtimeError(ErrCode.AK_UNDEFINED);
            console.error("错误，'"+pluginName+"' clouda.lightapp(your_ak_here);");
            return false;
        }
        if ( !clouda.STATUS.SUCCESS && n < 100 ){//还没有 ready 
            beforeRuntimeReadyStack.push([pluginName,callback]);
            return;
        }
        if (!pluginName) {
            return false;
        }
        //判断1.是否为undefined
        //判断2.是否为null，
        if (typeof regPlugins[pluginName] != 'undefined' && regPlugins[pluginName]){
            return callback(regPlugins[pluginName]);//此处是同步的逻辑
        }else if (Array.isArray( regCallbacks[pluginName])){
            return regCallbacks[pluginName].push(callback);
        }
        //在结果返回前，使用代理模式
        try{
            nuwa.pm.bindAk(clouda.lightapp.ak);
            regCallbacks[pluginName] = [];//等待下载
            regCallbacks[pluginName].push(callback);
            nuwa.pm.absorb(pluginName,function(inst){
                inst.on('error',function(err){
                    runtimeError(ErrCode.RT_GETERROR);
                    throw new Error('RT_GETERROR');
                });
                inst.on('progress',function(percentage){
                    console.log( pluginName + ' percentage = ' + percentage);
                });
                inst.on('complete',function(err){
                    var plg = nuwa.require(pluginName);
                    regPlugins[pluginName] = plg;
                    for(var i=0,len=regCallbacks[pluginName].length;i<len;i++){
                        regCallbacks[pluginName][i](plg);
                    }
                    delete regCallbacks[pluginName];
                });
            });
            
        }catch(er){
            try{
                callback(null);
            }catch(err){
                if (typeof options === 'object' ){//检查 onfail
                    if (typeof options.onfail === 'function'){
                        options.onfail(clouda.STATUS.SYSTEM_FAILURE);
                    }
                }
                console.error(err.stack);
            }
            
        }
        
        return false;
    };
    /**
     * 定义执行类型，所有子文件均通过此函数进行预处理，过滤错误，支持退化
     *
     * @function define
     * @memberof 
     * @instance
     *
     * @param {string} name
     * @param {Function} bindFunction
     *
     */
    var define = function(name,bindFunction){
        var module = clouda[name];
        //执行空间在clouda.lightapp下，防止污染其他空间
        bindFunction.call(clouda.lightapp,module, clouda);
        // bindFunction.call(undefined,module);
    };
    clouda.device = {};
    clouda.mbaas = {};
    clouda.lib = {};
    // clouda.ui={};
define("lib",function( module ) {
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
    var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */
    
    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
    function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
    function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
    function hex_hmac_md5(k, d)
      { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
    function b64_hmac_md5(k, d)
      { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
    function any_hmac_md5(k, d, e)
      { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }
    
    /*
     * Perform a simple self-test to see if the VM is working
     */
    function md5_vm_test()
    {
      return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
    }
    
    /*
     * Calculate the MD5 of a raw string
     */
    function rstr_md5(s)
    {
      return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }
    
    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac_md5(key, data)
    {
      var bkey = rstr2binl(key);
      if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);
    
      var ipad = Array(16), opad = Array(16);
      for(var i = 0; i < 16; i++)
      {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
    
      var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
      return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }
    
    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input)
    {
      // try { hexcase } catch(e) { hexcase=0; }
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var output = "";
      var x;
      for(var i = 0; i < input.length; i++)
      {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) +
                 hex_tab.charAt( x        & 0x0F);
      }
      return output;
    }
    
    /*
     * Convert a raw string to a base-64 string
     */
    function rstr2b64(input)
    {
      // try { b64pad } catch(e) { b64pad=''; }
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var output = "";
      var len = input.length;
      for(var i = 0; i < len; i += 3)
      {
        var triplet = (input.charCodeAt(i) << 16)
                    | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                    | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
        for(var j = 0; j < 4; j++)
        {
          if(i * 8 + j * 6 > input.length * 8) output += b64pad;
          else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
        }
      }
      return output;
    }
    
    /*
     * Convert a raw string to an arbitrary string encoding
     */
    function rstr2any(input, encoding)
    {
      var divisor = encoding.length;
      var i, j, q, x, quotient;
    
      /* Convert to an array of 16-bit big-endian values, forming the dividend */
      var dividend = Array(Math.ceil(input.length / 2));
      for(i = 0; i < dividend.length; i++)
      {
        dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
      }
    
      /*
       * Repeatedly perform a long division. The binary array forms the dividend,
       * the length of the encoding is the divisor. Once computed, the quotient
       * forms the dividend for the next step. All remainders are stored for later
       * use.
       */
      var full_length = Math.ceil(input.length * 8 /
                                        (Math.log(encoding.length) / Math.log(2)));
      var remainders = Array(full_length);
      for(j = 0; j < full_length; j++)
      {
        quotient = Array();
        x = 0;
        for(i = 0; i < dividend.length; i++)
        {
          x = (x << 16) + dividend[i];
          q = Math.floor(x / divisor);
          x -= q * divisor;
          if(quotient.length > 0 || q > 0)
            quotient[quotient.length] = q;
        }
        remainders[j] = x;
        dividend = quotient;
      }
    
      /* Convert the remainders to the output string */
      var output = "";
      for(i = remainders.length - 1; i >= 0; i--)
        output += encoding.charAt(remainders[i]);
    
      return output;
    }
    
    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    function str2rstr_utf8(input)
    {
      var output = "";
      var i = -1;
      var x, y;
    
      while(++i < input.length)
      {
        /* Decode utf-16 surrogate pairs */
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
        {
          x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
          i++;
        }
    
        /* Encode output as utf-8 */
        if(x <= 0x7F)
          output += String.fromCharCode(x);
        else if(x <= 0x7FF)
          output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                        0x80 | ( x         & 0x3F));
        else if(x <= 0xFFFF)
          output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                        0x80 | ((x >>> 6 ) & 0x3F),
                                        0x80 | ( x         & 0x3F));
        else if(x <= 0x1FFFFF)
          output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                        0x80 | ((x >>> 12) & 0x3F),
                                        0x80 | ((x >>> 6 ) & 0x3F),
                                        0x80 | ( x         & 0x3F));
      }
      return output;
    }
    
    /*
     * Encode a string as utf-16
     */
    function str2rstr_utf16le(input)
    {
      var output = "";
      for(var i = 0; i < input.length; i++)
        output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                      (input.charCodeAt(i) >>> 8) & 0xFF);
      return output;
    }
    
    function str2rstr_utf16be(input)
    {
      var output = "";
      for(var i = 0; i < input.length; i++)
        output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                       input.charCodeAt(i)        & 0xFF);
      return output;
    }
    
    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input)
    {
      var output = Array(input.length >> 2);
      for(var i = 0; i < output.length; i++)
        output[i] = 0;
      for( i = 0; i < input.length * 8; i += 8)
        output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
      return output;
    }
    
    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input)
    {
      var output = "";
      for(var i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
      return output;
    }
    
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl_md5(x, len)
    {
      /* append padding */
      x[len >> 5] |= 0x80 << ((len) % 32);
      x[(((len + 64) >>> 9) << 4) + 14] = len;
    
      var a =  1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d =  271733878;
    
      for(var i = 0; i < x.length; i += 16)
      {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
    
        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
    
        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
    
        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
    
        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
    
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
      }
      return Array(a, b, c, d);
    }
    
    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t)
    {
      return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
    }
    function md5_ff(a, b, c, d, x, s, t)
    {
      return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t)
    {
      return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t)
    {
      return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t)
    {
      return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y)
    {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
    
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt)
    {
      return (num << cnt) | (num >>> (32 - cnt));
    }
    module.md5 = hex_md5;
});
define("lib",function( module ) {
    //---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // qrcode
    //---------------------------------------------------------------------

    /**
     * qrcode
     * @param typeNumber 1 to 10
     * @param errorCorrectLevel 'L','M','Q','H'
     */
    var qrcode = module.qrcode = function(typeNumber, errorCorrectLevel) {

        var PAD0 = 0xEC;
        var PAD1 = 0x11;

        var _typeNumber = typeNumber;
        var _errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
        var _modules = null;
        var _moduleCount = 0;
        var _dataCache = null;
        var _dataList = [];

        var _this = {};

        var makeImpl = function(test, maskPattern) {

            _moduleCount = _typeNumber * 4 + 17;
            _modules = function(moduleCount) {
                var modules = new Array(moduleCount);
                for (var row = 0; row < moduleCount; row += 1) {
                    modules[row] = new Array(moduleCount);
                    for (var col = 0; col < moduleCount; col += 1) {
                        modules[row][col] = null;
                    }
                }
                return modules;
            }(_moduleCount);

            setupPositionProbePattern(0, 0);
            setupPositionProbePattern(_moduleCount - 7, 0);
            setupPositionProbePattern(0, _moduleCount - 7);
            setupPositionAdjustPattern();
            setupTimingPattern();
            setupTypeInfo(test, maskPattern);

            if (_typeNumber >= 7) {
                setupTypeNumber(test);
            }

            if (_dataCache === null) {
                _dataCache = createData(_typeNumber, _errorCorrectLevel, _dataList);
            }

            mapData(_dataCache, maskPattern);
        };

        var setupPositionProbePattern = function(row, col) {

            for (var r = -1; r <= 7; r += 1) {

                if (row + r <= -1 || _moduleCount <= row + r) continue;

                for (var c = -1; c <= 7; c += 1) {

                    if (col + c <= -1 || _moduleCount <= col + c) continue;

                    if ( (0 <= r && r <= 6 && (c === 0 || c === 6) ) || 
                            (0 <= c && c <= 6 && (r === 0 || r === 6) ) || 
                            (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
                        _modules[row + r][col + c] = true;
                    } else {
                        _modules[row + r][col + c] = false;
                    }
                }
            }
        };

        var getBestMaskPattern = function() {

            var minLostPoint = 0;
            var pattern = 0;

            for (var i = 0; i < 8; i += 1) {

                makeImpl(true, i);

                var lostPoint = QRUtil.getLostPoint(_this);

                if (i === 0 || minLostPoint > lostPoint) {
                    minLostPoint = lostPoint;
                    pattern = i;
                }
            }

            return pattern;
        };

        var setupTimingPattern = function() {

            for (var r = 8; r < _moduleCount - 8; r += 1) {
                if (_modules[r][6] !== null) {
                    continue;
                }
                _modules[r][6] = (r % 2 === 0);
            }

            for (var c = 8; c < _moduleCount - 8; c += 1) {
                if (_modules[6][c] !== null) {
                    continue;
                }
                _modules[6][c] = (c % 2 === 0);
            }
        };

        var setupPositionAdjustPattern = function() {

            var pos = QRUtil.getPatternPosition(_typeNumber);

            for (var i = 0; i < pos.length; i += 1) {

                for (var j = 0; j < pos.length; j += 1) {

                    var row = pos[i];
                    var col = pos[j];

                    if (_modules[row][col] !== null) {
                        continue;
                    }

                    for (var r = -2; r <= 2; r += 1) {

                        for (var c = -2; c <= 2; c += 1) {

                            if (r === -2 || r === 2 || c === -2 || c === 2 || 
                                    (r === 0 && c === 0) ) {
                                _modules[row + r][col + c] = true;
                            } else {
                                _modules[row + r][col + c] = false;
                            }
                        }
                    }
                }
            }
        };

        var setupTypeNumber = function(test) {

            var bits = QRUtil.getBCHTypeNumber(_typeNumber);
            var i,mod;
            for (i = 0; i < 18; i += 1) {
                 mod = (!test && ( (bits >> i) & 1) === 1);
                _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
            }

            for (i = 0; i < 18; i += 1) {
                 mod = (!test && ( (bits >> i) & 1) === 1);
                _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        };

        var setupTypeInfo = function(test, maskPattern) {

            var data = (_errorCorrectLevel << 3) | maskPattern;
            var bits = QRUtil.getBCHTypeInfo(data);
            var i,mod;

            // vertical
            for ( i = 0; i < 15; i += 1) {

                 mod = (!test && ( (bits >> i) & 1) === 1);

                if (i < 6) {
                    _modules[i][8] = mod;
                } else if (i < 8) {
                    _modules[i + 1][8] = mod;
                } else {
                    _modules[_moduleCount - 15 + i][8] = mod;
                }
            }

            // horizontal
            for ( i = 0; i < 15; i += 1) {

                 mod = (!test && ( (bits >> i) & 1) === 1);

                if (i < 8) {
                    _modules[8][_moduleCount - i - 1] = mod;
                } else if (i < 9) {
                    _modules[8][15 - i - 1 + 1] = mod;
                } else {
                    _modules[8][15 - i - 1] = mod;
                }
            }

            // fixed module
            _modules[_moduleCount - 8][8] = (!test);
        };

        var mapData = function(data, maskPattern) {

            var inc = -1;
            var row = _moduleCount - 1;
            var bitIndex = 7;
            var byteIndex = 0;
            var maskFunc = QRUtil.getMaskFunction(maskPattern);

            for (var col = _moduleCount - 1; col > 0; col -= 2) {

                if (col === 6) col -= 1;

                while (true) {

                    for (var c = 0; c < 2; c += 1) {

                        if (_modules[row][col - c] === null) {

                            var dark = false;

                            if (byteIndex < data.length) {
                                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) === 1);
                            }

                            var mask = maskFunc(row, col - c);

                            if (mask) {
                                dark = !dark;
                            }

                            _modules[row][col - c] = dark;
                            bitIndex -= 1;

                            if (bitIndex === -1) {
                                byteIndex += 1;
                                bitIndex = 7;
                            }
                        }
                    }

                    row += inc;

                    if (row < 0 || _moduleCount <= row) {
                        row -= inc;
                        inc = -inc;
                        break;
                    }
                }
            }
        };

        var createBytes = function(buffer, rsBlocks) {

            var offset = 0;

            var maxDcCount = 0;
            var maxEcCount = 0;

            var dcdata = new Array(rsBlocks.length);
            var ecdata = new Array(rsBlocks.length);
            var i;
            for (var r = 0; r < rsBlocks.length; r += 1) {

                var dcCount = rsBlocks[r].dataCount;
                var ecCount = rsBlocks[r].totalCount - dcCount;

                maxDcCount = Math.max(maxDcCount, dcCount);
                maxEcCount = Math.max(maxEcCount, ecCount);

                dcdata[r] = new Array(dcCount);

                for ( i = 0; i < dcdata[r].length; i += 1) {
                    dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
                }
                offset += dcCount;

                var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
                var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

                var modPoly = rawPoly.mod(rsPoly);
                ecdata[r] = new Array(rsPoly.getLength() - 1);
                for ( i = 0; i < ecdata[r].length; i += 1) {
                    var modIndex = i + modPoly.getLength() - ecdata[r].length;
                    ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
                }
            }

            var totalCodeCount = 0;
            for ( i = 0; i < rsBlocks.length; i += 1) {
                totalCodeCount += rsBlocks[i].totalCount;
            }

            var data = new Array(totalCodeCount);
            var index = 0;

            for ( i = 0; i < maxDcCount; i += 1) {
                for ( r = 0; r < rsBlocks.length; r += 1) {
                    if (i < dcdata[r].length) {
                        data[index] = dcdata[r][i];
                        index += 1;
                    }
                }
            }

            for ( i = 0; i < maxEcCount; i += 1) {
                for ( r = 0; r < rsBlocks.length; r += 1) {
                    if (i < ecdata[r].length) {
                        data[index] = ecdata[r][i];
                        index += 1;
                    }
                }
            }

            return data;
        };

        var createData = function(typeNumber, errorCorrectLevel, dataList) {

            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);

            var buffer = qrBitBuffer();

            for (var i = 0; i < dataList.length; i += 1) {
                var data = dataList[i];
                buffer.put(data.getMode(), 4);
                buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
                data.write(buffer);
            }

            // calc num max data.
            var totalDataCount = 0;
            for ( i = 0; i < rsBlocks.length; i += 1) {
                totalDataCount += rsBlocks[i].dataCount;
            }

            if (buffer.getLengthInBits() > totalDataCount * 8) {
                throw new Error('code length overflow. ('+ 
                    buffer.getLengthInBits()+ 
                     '>'+ 
                     totalDataCount * 8+ 
                     ')');
            }

            // end code
            if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
                buffer.put(0, 4);
            }

            // padding
            while (buffer.getLengthInBits() % 8 !== 0) {
                buffer.putBit(false);
            }

            // padding
            while (true) {

                if (buffer.getLengthInBits() >= totalDataCount * 8) {
                    break;
                }
                buffer.put(PAD0, 8);

                if (buffer.getLengthInBits() >= totalDataCount * 8) {
                    break;
                }
                buffer.put(PAD1, 8);
            }

            return createBytes(buffer, rsBlocks);
        };

        _this.addData = function(data) {
            var newData = qr8BitByte(data);
            _dataList.push(newData);
            _dataCache = null;
        };

        _this.isDark = function(row, col) {
            if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
                throw new Error(row + ',' + col);
            }
            return _modules[row][col];
        };

        _this.getModuleCount = function() {
            return _moduleCount;
        };

        _this.make = function() {
            makeImpl(false, getBestMaskPattern() );
        };

        _this.createTableTag = function(cellSize, margin) {

            cellSize = cellSize || 2;
            margin = (typeof margin === 'undefined')? cellSize * 4 : margin;

            var qrHtml = '';

            qrHtml += '<table style="';
            qrHtml += ' border-width: 0px; border-style: none;';
            qrHtml += ' border-collapse: collapse;';
            qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
            qrHtml += '">';
            qrHtml += '<tbody>';

            for (var r = 0; r < _this.getModuleCount(); r += 1) {

                qrHtml += '<tr>';

                for (var c = 0; c < _this.getModuleCount(); c += 1) {
                    qrHtml += '<td style="';
                    qrHtml += ' border-width: 0px; border-style: none;';
                    qrHtml += ' border-collapse: collapse;';
                    qrHtml += ' padding: 0px; margin: 0px;';
                    qrHtml += ' width: ' + cellSize + 'px;';
                    qrHtml += ' height: ' + cellSize + 'px;';
                    qrHtml += ' background-color: ';
                    qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
                    qrHtml += ';';
                    qrHtml += '"/>';
                }

                qrHtml += '</tr>';
            }

            qrHtml += '</tbody>';
            qrHtml += '</table>';

            return qrHtml;
        };

        _this.createImgTag = function(cellSize, margin) {

            cellSize = cellSize || 2;
            margin = (typeof margin === 'undefined')? cellSize * 4 : margin;

            var size = _this.getModuleCount() * cellSize + margin * 2;
            var min = margin;
            var max = size - margin;

            return createImgTag(size, size, function(x, y) {
                if (min <= x && x < max && min <= y && y < max) {
                    var c = Math.floor( (x - min) / cellSize);
                    var r = Math.floor( (y - min) / cellSize);
                    return _this.isDark(r, c)? 0 : 1;
                } else {
                    return 1;
                }
            } );
        };

        return _this;
    };

    //---------------------------------------------------------------------
    // qrcode.stringToBytes
    //---------------------------------------------------------------------

    qrcode.stringToBytes = function(s) {
        var bytes = [];
        for (var i = 0; i < s.length; i += 1) {
            var c = s.charCodeAt(i);
            bytes.push(c & 0xff);
        }
        return bytes;
    };

    //---------------------------------------------------------------------
    // qrcode.createStringToBytes
    //---------------------------------------------------------------------

    /**
     * @param unicodeData base64 string of byte array.
     * [16bit Unicode],[16bit Bytes], ...
     * @param numChars
     */
    qrcode.createStringToBytes = function(unicodeData, numChars) {

        // create conversion map.

        var unicodeMap = function() {

            var bin = base64DecodeInputStream(unicodeData);
            var read = function() {
                var b = bin.read();
                if (b === -1) throw new Error();
                return b;
            };

            var count = 0;
            var unicodeMap = {};
            while (true) {
                var b0 = bin.read();
                if (b0 === -1) break;
                var b1 = read();
                var b2 = read();
                var b3 = read();
                var k = String.fromCharCode( (b0 << 8) | b1);
                var v = (b2 << 8) | b3;
                unicodeMap[k] = v;
                count += 1;
            }
            if (count !== numChars) {
                throw new Error(count + ' !== ' + numChars);
            }

            return unicodeMap;
        }();

        var unknownChar = '?'.charCodeAt(0);

        return function(s) {
            var bytes = [];
            for (var i = 0; i < s.length; i += 1) {
                var c = s.charCodeAt(i);
                if (c < 128) {
                    bytes.push(c);
                } else {
                    var b = unicodeMap[s.charAt(i)];
                    if (typeof b === 'number') {
                        if ( (b & 0xff) === b) {
                            // 1byte
                            bytes.push(b);
                        } else {
                            // 2bytes
                            bytes.push(b >>> 8);
                            bytes.push(b & 0xff);
                        }
                    } else {
                        bytes.push(unknownChar);
                    }
                }
            }
            return bytes;
        };
    };

    //---------------------------------------------------------------------
    // QRMode
    //---------------------------------------------------------------------

    var QRMode = {
        MODE_NUMBER :       1 << 0,
        MODE_ALPHA_NUM :    1 << 1,
        MODE_8BIT_BYTE :    1 << 2,
        MODE_KANJI :        1 << 3
    };

    //---------------------------------------------------------------------
    // QRErrorCorrectLevel
    //---------------------------------------------------------------------

    var QRErrorCorrectLevel = {
        L : 1,
        M : 0,
        Q : 3,
        H : 2
    };

    //---------------------------------------------------------------------
    // QRMaskPattern
    //---------------------------------------------------------------------

    var QRMaskPattern = {
        PATTERN000 : 0,
        PATTERN001 : 1,
        PATTERN010 : 2,
        PATTERN011 : 3,
        PATTERN100 : 4,
        PATTERN101 : 5,
        PATTERN110 : 6,
        PATTERN111 : 7
    };

    //---------------------------------------------------------------------
    // QRUtil
    //---------------------------------------------------------------------

    var QRUtil = function() {

        var PATTERN_POSITION_TABLE = [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],
            [6, 32, 58],
            [6, 34, 62],
            [6, 26, 46, 66],
            [6, 26, 48, 70],
            [6, 26, 50, 74],
            [6, 30, 54, 78],
            [6, 30, 56, 82],
            [6, 30, 58, 86],
            [6, 34, 62, 90],
            [6, 28, 50, 72, 94],
            [6, 26, 50, 74, 98],
            [6, 30, 54, 78, 102],
            [6, 28, 54, 80, 106],
            [6, 32, 58, 84, 110],
            [6, 30, 58, 86, 114],
            [6, 34, 62, 90, 118],
            [6, 26, 50, 74, 98, 122],
            [6, 30, 54, 78, 102, 126],
            [6, 26, 52, 78, 104, 130],
            [6, 30, 56, 82, 108, 134],
            [6, 34, 60, 86, 112, 138],
            [6, 30, 58, 86, 114, 142],
            [6, 34, 62, 90, 118, 146],
            [6, 30, 54, 78, 102, 126, 150],
            [6, 24, 50, 76, 102, 128, 154],
            [6, 28, 54, 80, 106, 132, 158],
            [6, 32, 58, 84, 110, 136, 162],
            [6, 26, 54, 82, 110, 138, 166],
            [6, 30, 58, 86, 114, 142, 170]
        ];
        var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
        var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
        var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

        var _this = {};

        var getBCHDigit = function(data) {
            var digit = 0;
            while (data !== 0) {
                digit += 1;
                data >>>= 1;
            }
            return digit;
        };

        _this.getBCHTypeInfo = function(data) {
            var d = data << 10;
            while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
                d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
            }
            return ( (data << 10) | d) ^ G15_MASK;
        };

        _this.getBCHTypeNumber = function(data) {
            var d = data << 12;
            while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
                d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
            }
            return (data << 12) | d;
        };

        _this.getPatternPosition = function(typeNumber) {
            return PATTERN_POSITION_TABLE[typeNumber - 1];
        };

        _this.getMaskFunction = function(maskPattern) {

            switch (maskPattern) {

            case QRMaskPattern.PATTERN000 :
                return function(i, j) { return (i + j) % 2 === 0; };
            case QRMaskPattern.PATTERN001 :
                return function(i, j) { return i % 2 === 0; };
            case QRMaskPattern.PATTERN010 :
                return function(i, j) { return j % 3 === 0; };
            case QRMaskPattern.PATTERN011 :
                return function(i, j) { return (i + j) % 3 === 0; };
            case QRMaskPattern.PATTERN100 :
                return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 === 0; };
            case QRMaskPattern.PATTERN101 :
                return function(i, j) { return (i * j) % 2 + (i * j) % 3 === 0; };
            case QRMaskPattern.PATTERN110 :
                return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 === 0; };
            case QRMaskPattern.PATTERN111 :
                return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 === 0; };

            default :
                throw new Error('bad maskPattern:' + maskPattern);
            }
        };

        _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
            var a = qrPolynomial([1], 0);
            for (var i = 0; i < errorCorrectLength; i += 1) {
                a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
            }
            return a;
        };

        _this.getLengthInBits = function(mode, type) {

            if (1 <= type && type < 10) {

                // 1 - 9

                switch(mode) {
                case QRMode.MODE_NUMBER     : return 10;
                case QRMode.MODE_ALPHA_NUM  : return 9;
                case QRMode.MODE_8BIT_BYTE  : return 8;
                case QRMode.MODE_KANJI      : return 8;
                default :
                    throw new Error('mode:' + mode);
                }

            } else if (type < 27) {

                // 10 - 26

                switch(mode) {
                case QRMode.MODE_NUMBER     : return 12;
                case QRMode.MODE_ALPHA_NUM  : return 11;
                case QRMode.MODE_8BIT_BYTE  : return 16;
                case QRMode.MODE_KANJI      : return 10;
                default :
                    throw new Error('mode:' + mode);
                }

            } else if (type < 41) {

                // 27 - 40

                switch(mode) {
                case QRMode.MODE_NUMBER     : return 14;
                case QRMode.MODE_ALPHA_NUM  : return 13;
                case QRMode.MODE_8BIT_BYTE  : return 16;
                case QRMode.MODE_KANJI      : return 12;
                default :
                    throw new Error('mode:' + mode);
                }

            } else {
                throw new Error('type:' + type);
            }
        };

        _this.getLostPoint = function(qrcode) {

            var moduleCount = qrcode.getModuleCount();

            var lostPoint = 0;

            // LEVEL1
            var row,col,r,c;
            for ( row = 0; row < moduleCount; row += 1) {
                for ( col = 0; col < moduleCount; col += 1) {

                    var sameCount = 0;
                    var dark = qrcode.isDark(row, col);

                    for ( r = -1; r <= 1; r += 1) {

                        if (row + r < 0 || moduleCount <= row + r) {
                            continue;
                        }

                        for ( c = -1; c <= 1; c += 1) {

                            if (col + c < 0 || moduleCount <= col + c) {
                                continue;
                            }

                            if (r === 0 && c === 0) {
                                continue;
                            }

                            if (dark === qrcode.isDark(row + r, col + c) ) {
                                sameCount += 1;
                            }
                        }
                    }

                    if (sameCount > 5) {
                        lostPoint += (3 + sameCount - 5);
                    }
                }
            }

            // LEVEL2

            for ( row = 0; row < moduleCount - 1; row += 1) {
                for ( col = 0; col < moduleCount - 1; col += 1) {
                    var count = 0;
                    if (qrcode.isDark(row, col) ) count += 1;
                    if (qrcode.isDark(row + 1, col) ) count += 1;
                    if (qrcode.isDark(row, col + 1) ) count += 1;
                    if (qrcode.isDark(row + 1, col + 1) ) count += 1;
                    if (count === 0 || count === 4) {
                        lostPoint += 3;
                    }
                }
            }

            // LEVEL3

            for ( row = 0; row < moduleCount; row += 1) {
                for ( col = 0; col < moduleCount - 6; col += 1) {
                    if (qrcode.isDark(row, col) &&
                             !qrcode.isDark(row, col + 1) &&
                              qrcode.isDark(row, col + 2) &&
                              qrcode.isDark(row, col + 3) &&
                              qrcode.isDark(row, col + 4) &&
                             !qrcode.isDark(row, col + 5) &&
                              qrcode.isDark(row, col + 6) ) {
                        lostPoint += 40;
                    }
                }
            }

            for ( col = 0; col < moduleCount; col += 1) {
                for ( row = 0; row < moduleCount - 6; row += 1) {
                    if (qrcode.isDark(row, col) &&
                            !qrcode.isDark(row + 1, col) &&
                             qrcode.isDark(row + 2, col) &&
                             qrcode.isDark(row + 3, col) &&
                             qrcode.isDark(row + 4, col) &&
                            !qrcode.isDark(row + 5, col) && 
                             qrcode.isDark(row + 6, col) ) {
                        lostPoint += 40;
                    }
                }
            }

            // LEVEL4

            var darkCount = 0;

            for ( col = 0; col < moduleCount; col += 1) {
                for ( row = 0; row < moduleCount; row += 1) {
                    if (qrcode.isDark(row, col) ) {
                        darkCount += 1;
                    }
                }
            }

            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;

            return lostPoint;
        };

        return _this;
    }();

    //---------------------------------------------------------------------
    // QRMath
    //---------------------------------------------------------------------

    var QRMath = function() {

        var EXP_TABLE = new Array(256);
        var LOG_TABLE = new Array(256);

        // initialize tables
        for (var i = 0; i < 8; i += 1) {
            EXP_TABLE[i] = 1 << i;
        }
        for ( i = 8; i < 256; i += 1) {
            EXP_TABLE[i] = EXP_TABLE[i - 4]
                ^ EXP_TABLE[i - 5]
                ^ EXP_TABLE[i - 6]
                ^ EXP_TABLE[i - 8];
        }
        for ( i = 0; i < 255; i += 1) {
            LOG_TABLE[EXP_TABLE[i] ] = i;
        }

        var _this = {};

        _this.glog = function(n) {

            if (n < 1) {
                throw new Error('glog(' + n + ')');
            }

            return LOG_TABLE[n];
        };

        _this.gexp = function(n) {

            while (n < 0) {
                n += 255;
            }

            while (n >= 256) {
                n -= 255;
            }

            return EXP_TABLE[n];
        };

        return _this;
    }();

    //---------------------------------------------------------------------
    // qrPolynomial
    //---------------------------------------------------------------------

    function qrPolynomial(num, shift) {

        if (typeof num.length === 'undefined') {
            throw new Error(num.length + '/' + shift);
        }

        var _num = function() {
            var offset = 0;
            while (offset < num.length && num[offset] === 0) {
                offset += 1;
            }
            var _num = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i += 1) {
                _num[i] = num[i + offset];
            }
            return _num;
        }();

        var _this = {};

        _this.getAt = function(index) {
            return _num[index];
        };

        _this.getLength = function() {
            return _num.length;
        };

        _this.multiply = function(e) {

            var num = new Array(_this.getLength() + e.getLength() - 1);

            for (var i = 0; i < _this.getLength(); i += 1) {
                for (var j = 0; j < e.getLength(); j += 1) {
                    num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
                }
            }

            return qrPolynomial(num, 0);
        };

        _this.mod = function(e) {

            if (_this.getLength() - e.getLength() < 0) {
                return _this;
            }

            var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

            var num = new Array(_this.getLength() );
            for (var i = 0; i < _this.getLength(); i += 1) {
                num[i] = _this.getAt(i);
            }

            for ( i = 0; i < e.getLength(); i += 1) {
                num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
            }

            // recursive call
            return qrPolynomial(num, 0).mod(e);
        };

        return _this;
    }

    //---------------------------------------------------------------------
    // QRRSBlock
    //---------------------------------------------------------------------

    var QRRSBlock = function() {

        var RS_BLOCK_TABLE = [

            // L
            // M
            // Q
            // H

            // 1
            [1, 26, 19],
            [1, 26, 16],
            [1, 26, 13],
            [1, 26, 9],

            // 2
            [1, 44, 34],
            [1, 44, 28],
            [1, 44, 22],
            [1, 44, 16],

            // 3
            [1, 70, 55],
            [1, 70, 44],
            [2, 35, 17],
            [2, 35, 13],

            // 4
            [1, 100, 80],
            [2, 50, 32],
            [2, 50, 24],
            [4, 25, 9],

            // 5
            [1, 134, 108],
            [2, 67, 43],
            [2, 33, 15, 2, 34, 16],
            [2, 33, 11, 2, 34, 12],

            // 6
            [2, 86, 68],
            [4, 43, 27],
            [4, 43, 19],
            [4, 43, 15],

            // 7
            [2, 98, 78],
            [4, 49, 31],
            [2, 32, 14, 4, 33, 15],
            [4, 39, 13, 1, 40, 14],

            // 8
            [2, 121, 97],
            [2, 60, 38, 2, 61, 39],
            [4, 40, 18, 2, 41, 19],
            [4, 40, 14, 2, 41, 15],

            // 9
            [2, 146, 116],
            [3, 58, 36, 2, 59, 37],
            [4, 36, 16, 4, 37, 17],
            [4, 36, 12, 4, 37, 13],

            // 10
            [2, 86, 68, 2, 87, 69],
            [4, 69, 43, 1, 70, 44],
            [6, 43, 19, 2, 44, 20],
            [6, 43, 15, 2, 44, 16]
        ];

        var qrRSBlock = function(totalCount, dataCount) {
            var _this = {};
            _this.totalCount = totalCount;
            _this.dataCount = dataCount;
            return _this;
        };

        var _this = {};

        var getRsBlockTable = function(typeNumber, errorCorrectLevel) {

            switch(errorCorrectLevel) {
            case QRErrorCorrectLevel.L :
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
            case QRErrorCorrectLevel.M :
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
            case QRErrorCorrectLevel.Q :
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
            case QRErrorCorrectLevel.H :
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
            default :
                return undefined;
            }
        };

        _this.getRSBlocks = function(typeNumber, errorCorrectLevel) {

            var rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);

            if (typeof rsBlock === 'undefined') {
                throw new Error('bad rs block @ typeNumber:' + typeNumber +
                        '/errorCorrectLevel:' + errorCorrectLevel);
            }

            var length = rsBlock.length / 3;

            var list = [];

            for (var i = 0; i < length; i += 1) {

                var count = rsBlock[i * 3 + 0];
                var totalCount = rsBlock[i * 3 + 1];
                var dataCount = rsBlock[i * 3 + 2];

                for (var j = 0; j < count; j += 1) {
                    list.push(qrRSBlock(totalCount, dataCount) );
                }
            }

            return list;
        };

        return _this;
    }();

    //---------------------------------------------------------------------
    // qrBitBuffer
    //---------------------------------------------------------------------

    var qrBitBuffer = function() {

        var _buffer = [];
        var _length = 0;

        var _this = {};

        _this.getBuffer = function() {
            return _buffer;
        };

        _this.getAt = function(index) {
            var bufIndex = Math.floor(index / 8);
            return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) === 1;
        };

        _this.put = function(num, length) {
            for (var i = 0; i < length; i += 1) {
                _this.putBit( ( (num >>> (length - i - 1) ) & 1) === 1);
            }
        };

        _this.getLengthInBits = function() {
            return _length;
        };

        _this.putBit = function(bit) {

            var bufIndex = Math.floor(_length / 8);
            if (_buffer.length <= bufIndex) {
                _buffer.push(0);
            }

            if (bit) {
                _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
            }

            _length += 1;
        };

        return _this;
    };

    //---------------------------------------------------------------------
    // qr8BitByte
    //---------------------------------------------------------------------

    var qr8BitByte = function(data) {

        var _mode = QRMode.MODE_8BIT_BYTE;
        var _data = data;
        var _bytes = qrcode.stringToBytes(data);

        var _this = {};

        _this.getMode = function() {
            return _mode;
        };

        _this.getLength = function(buffer) {
            return _bytes.length;
        };

        _this.write = function(buffer) {
            for (var i = 0; i < _bytes.length; i += 1) {
                buffer.put(_bytes[i], 8);
            }
        };

        return _this;
    };

    //=======================================================================================================
    // GIF Support etc.
    //

    //---------------------------------------------------------------------
    // byteArrayOutputStream
    //---------------------------------------------------------------------

    var byteArrayOutputStream = function() {

        var _bytes = [];

        var _this = {};

        _this.writeByte = function(b) {
            _bytes.push(b & 0xff);
        };

        _this.writeShort = function(i) {
            _this.writeByte(i);
            _this.writeByte(i >>> 8);
        };

        _this.writeBytes = function(b, off, len) {
            off = off || 0;
            len = len || b.length;
            for (var i = 0; i < len; i += 1) {
                _this.writeByte(b[i + off]);
            }
        };

        _this.writeString = function(s) {
            for (var i = 0; i < s.length; i += 1) {
                _this.writeByte(s.charCodeAt(i) );
            }
        };

        _this.toByteArray = function() {
            return _bytes;
        };

        _this.toString = function() {
            var s = '';
            s += '[';
            for (var i = 0; i < _bytes.length; i += 1) {
                if (i > 0) {
                    s += ',';
                }
                s += _bytes[i];
            }
            s += ']';
            return s;
        };

        return _this;
    };

    //---------------------------------------------------------------------
    // base64EncodeOutputStream
    //---------------------------------------------------------------------

    var base64EncodeOutputStream = function() {

        var _buffer = 0;
        var _buflen = 0;
        var _length = 0;
        var _base64 = '';

        var _this = {};

        var writeEncoded = function(b) {
            _base64 += String.fromCharCode(encode(b & 0x3f) );
        };

        var encode = function(n) {
            if (n < 0) {
                // error.
            } else if (n < 26) {
                return 0x41 + n;
            } else if (n < 52) {
                return 0x61 + (n - 26);
            } else if (n < 62) {
                return 0x30 + (n - 52);
            } else if (n === 62) {
                return 0x2b;
            } else if (n === 63) {
                return 0x2f;
            }
            throw new Error('n:' + n);
        };

        _this.writeByte = function(n) {

            _buffer = (_buffer << 8) | (n & 0xff);
            _buflen += 8;
            _length += 1;

            while (_buflen >= 6) {
                writeEncoded(_buffer >>> (_buflen - 6) );
                _buflen -= 6;
            }
        };

        _this.flush = function() {

            if (_buflen > 0) {
                writeEncoded(_buffer << (6 - _buflen) );
                _buffer = 0;
                _buflen = 0;
            }

            if (_length % 3 !== 0) {
                // padding
                var padlen = 3 - _length % 3;
                for (var i = 0; i < padlen; i += 1) {
                    _base64 += '=';
                }
            }
        };

        _this.toString = function() {
            return _base64;
        };

        return _this;
    };

    //---------------------------------------------------------------------
    // base64DecodeInputStream
    //---------------------------------------------------------------------

    var base64DecodeInputStream = function(str) {

        var _str = str;
        var _pos = 0;
        var _buffer = 0;
        var _buflen = 0;

        var _this = {};

        _this.read = function() {

            while (_buflen < 8) {

                if (_pos >= _str.length) {
                    if (_buflen === 0) {
                        return -1;
                    }
                    throw new Error('unexpected end of file./' + _buflen);
                }

                var c = _str.charAt(_pos);
                _pos += 1;

                if (c === '=') {
                    _buflen = 0;
                    return -1;
                } else if (c.match(/^\s$/) ) {
                    // ignore if whitespace.
                    continue;
                }

                _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
                _buflen += 6;
            }

            var n = (_buffer >>> (_buflen - 8) ) & 0xff;
            _buflen -= 8;
            return n;
        };

        var decode = function(c) {
            if (0x41 <= c && c <= 0x5a) {
                return c - 0x41;
            } else if (0x61 <= c && c <= 0x7a) {
                return c - 0x61 + 26;
            } else if (0x30 <= c && c <= 0x39) {
                return c - 0x30 + 52;
            } else if (c === 0x2b) {
                return 62;
            } else if (c === 0x2f) {
                return 63;
            } else {
                throw new Error('c:' + c);
            }
        };

        return _this;
    };

    //---------------------------------------------------------------------
    // gifImage (B/W)
    //---------------------------------------------------------------------

    var gifImage = function(width, height) {

        var _width = width;
        var _height = height;
        var _data = new Array(width * height);

        var _this = {};

        _this.setPixel = function(x, y, pixel) {
            _data[y * _width + x] = pixel;
        };

        _this.write = function(out) {

            //---------------------------------
            // GIF Signature

            out.writeString('GIF87a');

            //---------------------------------
            // Screen Descriptor

            out.writeShort(_width);
            out.writeShort(_height);

            out.writeByte(0x80); // 2bit
            out.writeByte(0);
            out.writeByte(0);

            //---------------------------------
            // Global Color Map

            // black
            out.writeByte(0x00);
            out.writeByte(0x00);
            out.writeByte(0x00);

            // white
            out.writeByte(0xff);
            out.writeByte(0xff);
            out.writeByte(0xff);

            //---------------------------------
            // Image Descriptor

            out.writeString(',');
            out.writeShort(0);
            out.writeShort(0);
            out.writeShort(_width);
            out.writeShort(_height);
            out.writeByte(0);

            //---------------------------------
            // Local Color Map

            //---------------------------------
            // Raster Data

            var lzwMinCodeSize = 2;
            var raster = getLZWRaster(lzwMinCodeSize);

            out.writeByte(lzwMinCodeSize);

            var offset = 0;

            while (raster.length - offset > 255) {
                out.writeByte(255);
                out.writeBytes(raster, offset, 255);
                offset += 255;
            }

            out.writeByte(raster.length - offset);
            out.writeBytes(raster, offset, raster.length - offset);
            out.writeByte(0x00);

            //---------------------------------
            // GIF Terminator
            out.writeString(';');
        };

        var bitOutputStream = function(out) {

            var _out = out;
            var _bitLength = 0;
            var _bitBuffer = 0;

            var _this = {};

            _this.write = function(data, length) {

                if ( (data >>> length) !== 0) {
                    throw new Error('length over');
                }

                while (_bitLength + length >= 8) {
                    _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
                    length -= (8 - _bitLength);
                    data >>>= (8 - _bitLength);
                    _bitBuffer = 0;
                    _bitLength = 0;
                }

                _bitBuffer = (data << _bitLength) | _bitBuffer;
                _bitLength = _bitLength + length;
            };

            _this.flush = function() {
                if (_bitLength > 0) {
                    _out.writeByte(_bitBuffer);
                }
            };

            return _this;
        };

        var getLZWRaster = function(lzwMinCodeSize) {

            var clearCode = 1 << lzwMinCodeSize;
            var endCode = (1 << lzwMinCodeSize) + 1;
            var bitLength = lzwMinCodeSize + 1;

            // Setup LZWTable
            var table = lzwTable();

            for (var i = 0; i < clearCode; i += 1) {
                table.add(String.fromCharCode(i) );
            }
            table.add(String.fromCharCode(clearCode) );
            table.add(String.fromCharCode(endCode) );

            var byteOut = byteArrayOutputStream();
            var bitOut = bitOutputStream(byteOut);

            // clear code
            bitOut.write(clearCode, bitLength);

            var dataIndex = 0;

            var s = String.fromCharCode(_data[dataIndex]);
            dataIndex += 1;

            while (dataIndex < _data.length) {

                var c = String.fromCharCode(_data[dataIndex]);
                dataIndex += 1;

                if (table.contains(s + c) ) {

                    s = s + c;

                } else {

                    bitOut.write(table.indexOf(s), bitLength);

                    if (table.size() < 0xfff) {

                        if (table.size() === (1 << bitLength) ) {
                            bitLength += 1;
                        }

                        table.add(s + c);
                    }

                    s = c;
                }
            }

            bitOut.write(table.indexOf(s), bitLength);

            // end code
            bitOut.write(endCode, bitLength);

            bitOut.flush();

            return byteOut.toByteArray();
        };

        var lzwTable = function() {

            var _map = {};
            var _size = 0;

            var _this = {};

            _this.add = function(key) {
                if (_this.contains(key) ) {
                    throw new Error('dup key:' + key);
                }
                _map[key] = _size;
                _size += 1;
            };

            _this.size = function() {
                return _size;
            };

            _this.indexOf = function(key) {
                return _map[key];
            };

            _this.contains = function(key) {
                return typeof _map[key] !== 'undefined';
            };

            return _this;
        };

        return _this;
    };

    var createImgTag = function(width, height, getPixel, alt) {

        var gif = gifImage(width, height);
        for (var y = 0; y < height; y += 1) {
            for (var x = 0; x < width; x += 1) {
                gif.setPixel(x, y, getPixel(x, y) );
            }
        }

        var b = byteArrayOutputStream();
        gif.write(b);

        var base64 = base64EncodeOutputStream();
        var bytes = b.toByteArray();
        for (var i = 0; i < bytes.length; i += 1) {
            base64.writeByte(bytes[i]);
        }
        base64.flush();
        return base64;
        
        // var img = '';
        // img += '<img';
        // img += '\u0020src="';
        // img += 'data:image/gif;base64,';
        // img += base64;
        // img += '"';
        // img += '\u0020width="';
        // img += width;
        // img += '"';
        // img += '\u0020height="';
        // img += height;
        // img += '"';
        // if (alt) {
            // img += '\u0020alt="';
            // img += alt;
            // img += '"';
        // }
        // img += '/>';
// 
        // return img;
    };

    //---------------------------------------------------------------------
    // returns qrcode function.

});define("lib",function( module ) {
    
    'use strict';

    var defaultLogger = console;

    var emptyfunc = function() {
        
    };

    var slientLogger = {
        log : emptyfunc,
        error : emptyfunc,
        warn : emptyfunc,
        info : emptyfunc,
        debug : emptyfunc,
        trace : emptyfunc
    };

    if (Function.prototype.bind) {
        //keep the warn and error evan in slient mode
        [ 'error', 'warn' ].forEach(function(funcName) {

            slientLogger[funcName] = defaultLogger[funcName].bind(defaultLogger);
        });
    }

    function setLogger(logger) {

        if (!logger.debug)
            logger.debug = logger.info;

        utils.log = logger;
    }

    var isNodeEnv = !!(typeof module != 'undefined' && module.exports), isBrowserEnv = !!(typeof document != 'undefined' && document.getElementById);

    var utils = {
        slientLogger : slientLogger,
        setLogger : setLogger,

        /**
         * turn on/off debug mode
         * 
         * @param on|boolean
         */
        setDebugMode : function(on) {

            setLogger(on ? defaultLogger : slientLogger);
        },

        domReady : function(callback) {

            if (/complete|loaded|interactive/.test(document.readyState)) {
                callback();
                return;
            } else {
                document.addEventListener('DOMContentLoaded', function() {

                    callback();
                }, false);
                return;
            }
        },

        /**
         * extend(target, src1, src2.....)
         * 
         * @param dst,
         *            the target object to be extended
         * @returns Object
         */
        extend : function(dst) {

            if (!dst)
                dst = {};

            Array.prototype.slice.call(arguments, 1).forEach(function(source) {

                if (!source)
                    return;

                for ( var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        dst[prop] = source[prop];
                    }
                }
            });

            return dst;
        },
        /**
         * copy the attr keys in props
         * 
         * subset([prop1, prop2], src1, src2.....)
         * 
         * @param Array|props
         * @returns
         */
        subset : function(props) {

            var sobj = {};

            if (!props || !props.length)
                return sobj;

            if (!this.isArray(props))
                props = [ props ];

            Array.prototype.slice.call(arguments, 1).forEach(function(source) {

                if (!source)
                    return;

                for ( var i = 0, len = props.length; i < len; i++) {
                    if (source.hasOwnProperty(props[i])) {
                        sobj[props[i]] = source[props[i]];
                    }
                }
            });

            return sobj;
        },

        isArray : function(obj) {

            return Array.isArray ? Array.isArray(obj) : Object.prototype.call(obj) == '[object Array]';
        },

        isObject : function(obj) {

            return Object.prototype.toString.call(obj) == '[object Object]';
        },

        isFunction : function(obj) {

            return Object.prototype.toString.call(obj) == '[object Function]';
        },

        isNumber : function(obj) {

            return Object.prototype.toString.call(obj) == '[object Number]';
        },

        isString : function(obj) {

            return Object.prototype.toString.call(obj) == '[object String]';
        },
        isDefined : function(v) {

            return typeof (v) != 'undefined';
        },
        isSimpleValue : function(v) {

            return !(this.isObject(v) || this.isArray(v) || this.isFunction(v));
        },
        isSetter : function(obj, k) {

            if (!Object.getOwnPropertyDescriptor)
                return false;

            var propd = Object.getOwnPropertyDescriptor(obj, k);

            return !!(propd && propd.set);
        },
        defineGetterAndSetter : function(obj, key, getFunc, setFunc) {

            var prop = {};

            if (getFunc)
                prop.get = getFunc;

            if (setFunc)
                prop.set = setFunc;

            if (Object.defineProperty) {
                Object.defineProperty(obj, key, prop);
                
            } else if (obj.__defineGetter__) {

                if (prop.get)
                    obj.__defineGetter__(key, prop.get);

                if (prop.set)
                    obj.__defineSetter__(key, prop.set);
            }
        },
        random : function(length) {

            var str = '', chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz', clen = chars.length;

            if (!length)
                length = 6;

            for ( var i = 0; i < length; i++) {
                str += chars.charAt(this.randomInt(0, clen - 1));
            }
            return str;
        },
        randomInt : function(min, max) {

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        inherit : function(child, parent) {

            for ( var key in parent) {
                if (parent.hasOwnProperty(key))
                    child[key] = parent[key];
            }

            function Ctor() {

                this.constructor = child;
            }
            Ctor.prototype = parent.prototype;

            child.prototype = new Ctor();
            child.__super__ = parent.prototype;

            return child;
        },

        /**
         * get the dir base of url, e.g.
         * 
         * http://www.zz.com/cc/zz.html -> http://www.zz.com/cc/
         * 
         * @param url
         * @returns
         */
        getUrlDir : function(url) {

            url = url.split('?')[0];

            url = this.qualifyUrl(url);

            //search begin with the host
            var startPos = url.indexOf('//') + 2;

            //find the last /
            var lastSlashPos = url.substr(startPos).lastIndexOf('/');

            if (lastSlashPos == -1)
                return url + '/';

            return url.substr(0, startPos + lastSlashPos + 1);
        },

        /**
         * make the url absolute
         * 
         * @param url
         * @returns
         */
        qualifyUrl : function(url, base) {

            if (!base) {
                var a = document.createElement('a');
                a.href = url;
                return a.href;
            }

            //well, we got a base, use the base tag's magic

            var doc = document, doc_head = doc.head || doc.getElementsByTagName('head')[0];

            var old_base = doc.getElementsByTagName('base')[0], old_href = old_base && old_base.href;

            var our_base = old_base || doc_head.appendChild(doc.createElement('base'));

            var resolver = doc.createElement('a'), resolved_url;

            our_base.href = base;
            resolver.href = url;

            resolved_url = resolver.href;

            if (old_base) {
                old_base.href = old_href;
            } else {
                doc_head.removeChild(our_base);
            }

            return resolved_url;
        },

        ajaxGet : function(options) {

            var xhr = new window.XMLHttpRequest();

            if (options.async !== false)
                options.async = true;

            if (options.async) {
                xhr.onreadystatechange = function() {

                    if (xhr.readyState == 4) {
                        var result;
                        if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && location.protocol == 'file:')) {
                            result = xhr.responseText;
                            options.callback(result);
                        } else {
                            options.callback(xhr.responseText);
                        }
                    }
                };
            }

            xhr.open('GET', options.url, options.async);
            xhr.send(options.query || '');

            if (!options.async) {
                return xhr.status === 200 ? xhr.responseText : false;
            }
        },

        trim : function(s) {

            if (!s)
                return '';

            if (s.trim)
                return s.trim();

            return s.replace(/^\s+|\s+$/gm, '');
        },

        trigger : function(el, evt, detail) {

            if (!el) {
                this.log.error('emply element passed in');
                return;
            }

            detail = detail || {};
            var e, opt = {
                bubbles : true,
                cancelable : true,
                detail : detail
            };

            if (typeof CustomEvent !== 'undefined') {
                e = new CustomEvent(evt, opt);
                el.dispatchEvent(e);
            } else {
                try {
                    e = document.createEvent("CustomEvent");
                    e.initCustomEvent(evt, true, true, detail);
                    el.dispatchEvent(e);
                } catch (exp) {
                    this.log.error(exp);
                }
            }
            return true;
        },

        /* jshint -W054 */
        runInGlobal : function(functionBody, argsMap) {

            var argNames = [], argValues = [];

            if (argsMap) {
                for ( var k in argsMap) {

                    argNames.push(k);
                    argValues.push(argsMap[k]);
                }
            }

            return new Function(argNames.join(','), functionBody).apply(window, argValues);
        },
        /**
         * Read obj attr value via path, e.g. a.b.c[0][1].d
         */
        pathValue : function(obj, path, defaultVal, setMode) {

            if (setMode && path.indexOf('[') >= 0) {
                throw new Error('pathValue setMode not support array for now!!1');
            }

            var subPs = path.split('.'), cur = obj;

            var arrKeyPtn = /^([^\[]+)((\[\d+\])+)$/;

            var arrIdxPtn = /\[(\d+)\]/g;

            var depth = 0, subPsLen = subPs.length;

            var gotBrokenPath = subPs.some(function(sp, idx) {

                depth++;

                if (cur === null || cur === void (0))
                    return true;

                if (setMode) {

                    if (!this.isDefined(cur[sp])) {
                        cur[sp] = {};
                    }

                    if (idx == subPsLen - 1) {
                        cur[sp] = defaultVal;
                    }
                }

                if (this.isDefined(cur[sp])) {
                    cur = cur[sp];

                } else {

                    if (sp.indexOf('[') > 0) {

                        var matches = arrKeyPtn.exec(sp);

                        if (matches && matches[1] && this.isDefined(cur[matches[1]])) {
                            cur = cur[matches[1]];

                            var idxMatches;

                            while ((idxMatches = arrIdxPtn.exec(matches[2])) !== null) {

                                var nIdx = parseInt(idxMatches[1], 10);

                                depth++;

                                if (Array.isArray(cur) && this.isDefined(cur[nIdx])) {

                                    cur = cur[nIdx];

                                } else {
                                    return true;
                                }
                            }

                            return;
                        }
                    }

                    return true;
                }

            }, this);

            if (setMode)
                return obj;

            if (!gotBrokenPath)
                return cur;

            return typeof (defaultVal) != 'undefined' ? defaultVal : ''; // (depth > 1 ? '' : path);

        },
        isSysOwnedFld : function(k) {

            return k.indexOf(consts.sysKeyPre) === 0;
        },
        isEqual : function(a, b) {

            if (a === b)
                return true;
            if (a === null || b === null)
                return false;
            if (a !== a && b !== b)
                return true;

            var hskey = consts.hashTagKey;

            var t1 = typeof a, t2 = typeof b, length, key = null, keySet;

            if (t1 == t2) {
                if (t1 == 'object') {
                    if (this.isArray(a)) {
                        if (a.length == b.length) {
                            length = a.length;
                            for (key = 0; key < length; key++) {
                                if (!this.isEqual(a[key], b[key]))
                                    return false;
                            }
                            return true;
                        }
                    } else {

                        //this is a little trick to improve performace
                        if ((a[hskey] && b[hskey])) {

                            if (a[hskey] === b[hskey])
                                return true;

                            //if not match, we can not sure equal or not, so go on..
                        }

                        keySet = {};
                        for (key in a) {
                            if (!a.hasOwnProperty(key) || this.isSysOwnedFld(key))
                                continue;
                            if (!this.isEqual(a[key], b[key]))
                                return false;
                            keySet[key] = true;
                        }
                        for (key in b) {
                            if (!b.hasOwnProperty(key) || this.isSysOwnedFld(key))
                                continue;
                            if (!keySet[key] && b[key] !== undefined && typeof b[key] !== 'function')
                                return false;
                        }

                        return true;
                    }
                }
            }

            return false;
        },
        copy : function(obj) {

            var out;

            if (this.isArray(obj)) {

                out = [];
                for ( var i = 0, len = obj.length; i < len; i++) {
                    out.push(this.copy(obj[i], 1));
                }
                return out;

            } else if (this.isObject(obj)) {

                out = {};
                for ( var k in obj) {
                    if (obj.hasOwnProperty(k) && !this.isSysOwnedFld(k))
                        out[k] = this.copy(obj[k], 1);
                }
                return out;
            }

            return obj;
        },
        isNodeEnv : function() {

            return isNodeEnv;
        },
        isBrowserEnv : function() {

            return isBrowserEnv;
        },
        nextTick : function(f) {

            (typeof process === 'object' && process.nextTick ? process.nextTick : function(task) {

                setTimeout(task, 0);
            })(f);
        },
        isPlainObject : function(obj) {

            if (!obj || !this.isObject(obj) || obj.nodeType) {

                return false;
            }

            if (obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
                return false;
            }

            var key = void (0);
            for (key in obj) {
            }

            return key === undefined || obj.hasOwnProperty(key);
        },
        removeFromArray : function(arr, val) {

            var index = arr.indexOf(val);

            if (index > -1) {
                arr.splice(index, 1);
            }

            return index;
        },
        size : function(obj) {

            if (obj === null)
                return 0;

            if (obj.length === +obj.length)
                return obj.length;

            var len = 0;
            for ( var k in obj) {
                if (obj.hasOwnProperty(k))
                    len++;
            }
            return len;
        },
    };

    //off by default
    utils.setDebugMode(false);

    module.utils = utils;
});define("device",function(module) {
    var lightapp = this;
    //定义 accelerometer 空间，clouda.device.accelerometer 
     /**
     * @object accelerometer
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.accelerometer
     */
    var it = module.accelerometer = {};
    
    //需要device的accelerometer模块
    
    var getCurrentAcceleration = new delegateClass("device","accelerometer","getCurrentAcceleration");
    var watchAcceleration = new delegateClass("device","accelerometer","watchAcceleration");
    var clearWatch = new delegateClass("device","accelerometer","clearWatch");
    
    
    /**
     * 获取当前加速度，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.get = function(options){
        getCurrentAcceleration(function(obj){
            if ( typeof obj==='object' && typeof obj.x !='undefined' && typeof obj.y !='undefined' && typeof obj.z !='undefined'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.ACC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.ACC_GET_ERR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前加速度，接收成功，失败的回调和间隔
     *
     * @function listen
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认10000 ms
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        if(start_id){
            clearWatch(start_id);
        }
        
        installPlugin("device", function(device) {
            start_id = device.accelerometer.watchAcceleration(function(obj){
                if ( typeof obj==='object' && typeof obj.x !='undefined' && typeof obj.y !='undefined' && typeof obj.z !='undefined'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.ACC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            }, function(error) {
               lightapp.error(ErrCode.ACC_GET_ERR,error,options);
            },options);
        });
    };
    /**
     * 终止获取回调
     *
     * @function stop
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function() {
        clearWatch(start_id);
    };
    return it;
});
define("device",function(module) {
    var lightapp = this;
    //定义 activity 空间，clouda.device.activity 
     /**
     * @object activity
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.activity
     */
    var it = module.activity = {};
    
    var startActivity = new delegateClass("device","activity","startActivity");
    
    //device.activity.startActivity(successCallback, errorCallback, intent);
    
    /**
     * 调起第三方app
     *
     * @function get
     * @memberof clouda.device.activity
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} options.onsuccess 成功的回调
     * @param {object} options.intent 参考android调起应用参数intent
     * @returns null
     * 
     */
    it.start = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";
             BLightApp.invokeThirdApp(JSON.stringify(options.intent),
                cloudasuccess,
                "("+options.onfail.toString()+")");   
             return false;
        }
        
        startActivity(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.ACC_GET_ERR,nativeErr,options);
        },options.intent,options);
    };
    
    
});
define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.battery = {};
    
    /**
     * @object battery
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.battery
     */
    
    var start = new delegateClass("device","batterystatus","start");
    var stop = new delegateClass("device","batterystatus","stop");
    
    it.get = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            var successCallback = "(function(result){if(result.level){result.level = result.level*100;}("+options.onsuccess.toString()+")(result);})";
            
            // var successCallback ="(function(){"+ options.onsuccess.toString() + "}(result))";
            var errorCallback ="("+  options.onfail.toString() + ")";
            BLightApp.getBattery(successCallback,errorCallback);
            return;
        }
        start(function(){
            options.onsuccess.apply(this,arguments);
            stop(function(){},function(){});
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    /**
     * 已一定的频率获取电池状态
     *
     * @function startListen
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.startListen = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            // var successCallback = "("+ options.onsuccess.toString() + ")";
            var successCallback = "(function(result){if(result.level){result.level = result.level*100;}("+options.onsuccess.toString()+")(result);})";
            
            var errorCallback = "("+ options.onfail.toString() + ")";
            BLightApp.startListenBattery(successCallback,errorCallback);
            return;
        }
        start(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    /**
     * 停止获取电池状态
     *
     * @function stopListen
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            // var successCallback = "("+ options.onsuccess.toString() + ")";
            var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";
            var errorCallback = "("+ options.onfail.toString() + ")";
            BLightApp.stopListenBattery(cloudasuccess,errorCallback);
            return;
        }
        if (typeof options == 'undefined') {
            stop(function(){},function(){});
        }else{
            stop(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            },function(nativeErr){
                lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
            },options);
        }
        
    };
    
    return it;
});define("device",function(module) {
    var lightapp = this;
    //定义 compass 空间，clouda.device.compass 
     /**
     * @object compass
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.compass
     */
    var it = module.compass = {};
    
    //需要device的compass模块
    // var boot = ['clearWatch','getCurrentHeading','watchHeading'];
    
    var getCurrentHeading = new delegateClass("device","compass","getCurrentHeading");
    var watchHeading = new delegateClass("device","compass","watchHeading");
    var clearWatch = new delegateClass("device","compass","clearWatch");
    
    
    /**
     * 获取当前指南针坐标，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.compass
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.get = function(options){

        getCurrentHeading(function(obj){
            if ( typeof obj==='object' && typeof obj.magneticHeading !='undefined' && typeof obj.trueHeading !='undefined' ){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.CPS_ERROR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.CPS_ERROR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前指南针坐标，接收成功，失败的回调和间隔
     *
     * @function startListen
     * @memberof clouda.device.compass
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认100 ms
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        if(start_id){
            clearWatch(start_id);
        }
        installPlugin("device", function(device) {
            start_id = device.compass.watchHeading(function(obj){
                if ( typeof obj==='object' && typeof obj.magneticHeading !='undefined' && typeof obj.trueHeading !='undefined' ){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.CPS_ERROR,ErrCode.UNKNOW_CALLBACK,options);
                }
            }, function(error) {
               lightapp.error(ErrCode.CPS_ERROR,error,options);
            });
        });
    };
    /**
     * 终止获取回调
     *
     * @function stopListen
     * @memberof clouda.device.compass
     * @instance
     * 
     * 
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function() {
        clearWatch(start_id);
    };
    return it;
});define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.connection 使用nuwa.network 
    var it = module.connection = {};
    
    /**
     * @object connection
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.connection
     */
    module.CONNECTION_STATUS = {
        UNKNOWN: "unknown",
        ETHERNET: "ethernet",
        WIFI: "wifi",
        CELL_2G: "2g",
        CELL_3G: "3g",
        CELL_4G: "4g",
        CELL:"cellular",
        NONE: "none"
    };
    module.kconnection = {
        'lightapp.device.CONNECT_UNKNOWN':module.CONNECTION_STATUS.UNKNOWN,
        'lightapp.device.CONNECT_NONE':module.CONNECTION_STATUS.NONE,
        'lightapp.device.CONNECT_WIFI':module.CONNECTION_STATUS.WIFI,
        'lightapp.device.CONNECT_MOBILE':module.CONNECTION_STATUS.CELL,
        'lightapp.device.CONNECT_CONNECTED':module.CONNECTION_STATUS.UNKNOWN,//connected
    };
    
    it.status = module.CONNECTION_STATUS.UNKNOWN;
    
    var getInfo = new delegateClass("device","connection","getInfo");
    /**
     * Launch device camera application for recording video(s).
     *
     * @function startListen
     * @memberof clouda.device.connection
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
     it.get = function(options){
         if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.getNetworkType("(function(result){result = clouda.device.kconnection[result.net_result]||clouda.device.CONNECTION_STATUS.UNKNOWN;("+options.onsuccess.toString()+")(result);})",
                            "("+options.onfail.toString()+")");
             return false;
         }
         // 
         if (it.status !== module.CONNECTION_STATUS.UNKNOWN) {
              options.onsuccess(it.status);
              return;
         }
        getInfo(function(status){
           it.status = status;
           options.onsuccess.call(this,status);
           delete options.onsuccess;
        },function(nativeErr){
            lightapp.error(ErrCode.CONNECT_ERROR,nativeErr,options);
        },options);
     };
    //TODO 应该提供监听方法
    /**
     * 应该提供监听网络变化的方法
     *
     * @function startListen
     * @memberof clouda.device.connection
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    var triggerfunction = null;
    it.startListen = function(options){
        triggerfunction = options.onsuccess;
        getInfo(function(status){
           it.status = status;
           if (typeof triggerfunction === 'function'){
               triggerfunction.call(undefined,status);
           }
           triggerfunction(status);
        },function(nativeErr){
            lightapp.error(ErrCode.CONNECT_ERROR,nativeErr,options);
        },options);
    };
     /**
     * 应该提供停止监听网络变化的方法
     *
     * @function stopListen
     * @memberof clouda.device.connection
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.stopListen = function(options){
        triggerfunction = null;
    };
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 contact 空间，clouda.device.contact 支持退化
    var it = module.contact = {};
    
    /**
     * @object contact
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.contact
     */
    
    var create = new delegateClass("device","contact","create");
    var find =new delegateClass("device","contact","find");
    var findBounds = new delegateClass("device","contact","findBounds");
    
    // module.CONTACT_COLUMN={
        // ID:"id",
        // DISPLAYNAME:"displayName",
        // NICKNAME:"nickname",
        // PHONE:"phoneNumbers",
        // EMAIL:"emails",
        // ADDRESS:"addresses",
        // ORGANIZATION:"organizations",
        // BIRTHDAY:"birthday",
        // PHOTO:"photos",
        // CATEGORY:"categories",
        // IM:"ims",
        // URL:"urls",
        // NOTE:"note",
//   
    // };
    /*
     * Returns an array of Contacts matching the search criteria.
     *
     * @function find
     * @memberof clouda.device.contact
     * @instance
     *
     * @param fields that should be searched
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {string} options.filter
     * @param {boolean} options.multiple
     * @return null
     */
    it.find = function(fields,options){
        installPlugin("device", function(device) {
           
            device.contact.find(fields,function(contact_array){
                if ( Array.isArray(contact_array) ){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            },options);
        });
        
        
    };
    
    
    it.insert = function(fields, options) {
        installPlugin("device", function(device) {
            var person = device.contact.create();

            for (var i in fields) {
                person[i] = fields[i];
            }
            person.save(function() {
                options.onsuccess.apply(this, arguments);
            }, function(errno) {
                lightapp.error(ErrCode.CONTACT_FIND_ERR, errno, options);
            });
        });
    }; 

    
    it.update = function(contact,fields,options){
        installPlugin("device", function(device) {
            if (typeof contact === 'object'){
                for (var i in fields){
                    contact[i] = fields[i];
                }
                if (fields.displayName && contact.name){//name
                    contact.name.familyName = fields.displayName.substring(0,1);
                    contact.name.givenName = fields.displayName.substring(1);
                }
                if (contact.id){
                    contact.rawId = contact.id;
                }
                
                contact.save(function(){
                    options.onsuccess.apply(this,arguments);
                },function(errno){
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,errno,options);
                });
            }else{
                lightapp.error(ErrCode.CONTACT_FIND_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        });
    };
    
    it.remove = function(contact,options){
        installPlugin("device", function(device) {
            try{
                
           if (typeof contact === 'object'){
               contact.remove(function(){
                    options.onsuccess(clouda.STATUS.SUCCESS);
                },function(errno){
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,errno,options);
                });
           }else{
               options.onsuccess(clouda.STATUS.SUCCESS);
           }
             }catch(e){
                 console.log(e.stack);
             }
           
        });
    };
    it.count = function(options){
        installPlugin("device", function(device) {
            var media = device.contact.findBounds(["*"],function(contacts){
                options.onsuccess(contacts.count);
                contacts.close(function(){},function(){});
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            },options);
        });
    };
    it.getCursor = function(fields,cursorOffset,length,options){
        installPlugin("device", function(device) {
            device.contact.findBounds(fields,function(contacts){
                contacts.get(cursorOffset, function(refs){
                    options.onsuccess(refs);
                    contacts.close(function(){},function(){});
                }, function(nativeErr){
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
                }, length);
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            },options);
        });
    };
   
});define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.device 支持退化
    var it = module.device = {};
    
    /**
     * @object device
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.device
     */
    
    var getUuid = new delegateClass("device","device","getUuid");
    var getHostAppKey = new  delegateClass("device","device","getHostAppKey");
    
    var getImei = new delegateClass("device","device","getImei");
    
    var getSysVersion = new delegateClass("device","device","getAndroidVersion");
    var getDeviceModelName = new delegateClass("device","device","getProductModel");
    var getScreenSize = new delegateClass("device","device","getScreenResolution");
    
    /**
     * 获取uuid
     *
     * @function getUuid
     * @memberof clouda.device.device
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.getImei = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.getDeviceInfo(
                 "(function(result){("+options.onsuccess.toString()+")(JSON.parse(result.device_info).imei);})",
                            "("+options.onfail.toString()+")");
             return false;
        }
        getImei(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.DEVICE_ERR,nativeErr,options);
        },options);
    };
    
    it.getUuid = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.getDeviceInfo(
                 "(function(result){("+options.onsuccess.toString()+")(JSON.parse(result.device_info).imei);})",
                            "("+options.onfail.toString()+")");
             return false;
        }
        getUuid(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.DEVICE_ERR,nativeErr,options);
        },options);
    };
    /**
     * 获取系统版本
     *
     * @function getSysVersion
     * @memberof clouda.device.device
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.getSysVersion = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.getDeviceInfo(
                 "(function(result){("+options.onsuccess.toString()+")(JSON.parse(result.device_info).os_version);})",
                            "("+options.onfail.toString()+")");
             return false;
        }
        getSysVersion(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.DEVICE_ERR,nativeErr,options);
        },options);
    };
    /**
     * 获取设备名称
     *
     * @function getDeviceModelName
     * @memberof clouda.device.device
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.getDeviceModelName = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.getDeviceInfo(
                 "(function(result){("+options.onsuccess.toString()+")(JSON.parse(result.device_info).model);})",
                            "("+options.onfail.toString()+")");
             return false;
        }
        getDeviceModelName(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.DEVICE_ERR,nativeErr,options);
        },options);
    };
    /**
     * 获取屏幕分辨率
     *
     * @function getScreenSize
     * @memberof clouda.device.device
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.getScreenSize = function(options){
        if (window.screen){
            options.onsuccess(window.screen);
        }else{
            lightapp.error(ErrCode.DEVICE_ERR,ErrCode.DEVICE_ERR,options);
        }
        // if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
            // if (window.screen){
                // options.onsuccess(window.screen);
            // }else{
                // lightapp.error(ErrCode.DEVICE_ERR,ErrCode.DEVICE_ERR,options);
            // }
            // return ;
             // // BLightApp.getDeviceInfo(
                 // // "(function(result){("+options.onsuccess.toString()+")(window.screen);})",
                            // // "("+options.onfail.toString()+")");
             // // return false;
        // }
        // getScreenSize(options.onsuccess,function(nativeErr){
            // lightapp.error(ErrCode.DEVICE_ERR,nativeErr,options);
        // },options);
    };
    /**
     * 获取 hostappkey
     *
     * @function getHostAppKey
     * @memberof clouda.device.device
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.getHostAppKey = function(options){
        getHostAppKey(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.DEVICE_ERR,nativeErr,options);
        },options);
    };
    return it;
});define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.reachability 使用nuwa.network 
    var it = module.fs = {};
    //FileTransferError.FILE_NOT_FOUND_ERR = 1;
    // FileTransferError.INVALID_URL_ERR = 2;
    // FileTransferError.CONNECTION_ERR = 3;
    // FileTransferError.ABORT_ERR = 4;
    module.fs.ftmsg = {
        1:"FILE NOT FOUND.",
        2:"INVALID URL.",
        3:"CONNECTION ERR.",
        4:"ABORT_ERR.",
    };
    var fterror = function(first,err,options){
        //deal with err
        if (module.fs.ftmsg[err.code]){
            err.error = module.fs.ftmsg[err.code];
        }
        err.result = err.code;
        delete err.code;
        lightapp.error(first,err,options);
    };
    /**
     * @object fs
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.fs
     */
    
    var localDir = function(callback){
        // return "/sdcard/Baidu/"+lightapp.ak;
        installPlugin("device", function(device) {
            device.fs.requestFileSystem(device.fs.LocalFileSystem.PERSISTENT, 100000000, function(fileSystem){
                fileSystem.root.getDirectory(lightapp.ak, {create : true,exclusive : false}, function(fs){
                    callback(fs);
                }, function(){
                    callback(null);
                });
                
            }, function(){
                callback(null);
            });
        });
    };
    var getFileNameFromPath = function(str){
        return str.substring(str.lastIndexOf("/")+1);
    };
    /**
     * 上传文件
     *
     * @function post
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink
     * @param {string} target 要POST到的目标,如http://some.host/foo
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onprogress
     * @param {string} options.uploadKey
     * @param {string} options.param
     * 
     */
    var FileTransfer=null;
    it.post = function(link,target,options) {
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
            var params = {};
            params.param = [];
            if (options.param){
                for(var nn in options.param){
                    params.param.push({key:nn,value:options.param[nn]});
                }
            }
            params.file = [];
            params.file.push({key:options.uploadKey,value:link});
            
            BLightApp.postFile(target,JSON.stringify(params),"("+options.onsuccess.toString()+")",
                            "(function(result){result.error=clouda.device.fs.ftmsg[result.result];("+options.onfail.toString()+")(result);})");
           //"(function(result){("+options.onfail.toString()+")(JSON.parse(result.device_info).os_version);})"
             return false;
         }
        installPlugin("filetransfer", function(ft) {
            if (FileTransfer === null) {
                FileTransfer = new ft.FileTransfer();
            }
            if (options.onprogress){
                FileTransfer.onprogress = function(data){
                    options.onprogress(data);
                };
            }else{
                FileTransfer.onprogress = function(){};
            }
            var opt = new ft.FileUploadOptions();
            opt.fileKey = options.uploadKey;
            opt.fileName = getFileNameFromPath(link);
            if (options.param){
                opt.params = options.param;
            }
            // opt.mimeType = "text/html";
            FileTransfer.upload(link, target, function(result) {
                options.onsuccess.apply(this,arguments);
            }, function(err) {
                fterror(ErrCode.FS_ERR,err,options);
            }, opt,options);

        });
    };
    
     /**
     * 下载文件
     *
     * @function downloadFile
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink
     * @param {string} filename 保存到本地的文件名 
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onprogress
     */
    
 
    it.download = function(link, name, options) {
        installPlugin("filetransfer", function(ft) {
            if (FileTransfer === null) {
                FileTransfer = new ft.FileTransfer();
            }
            if (options.onprogress){
                FileTransfer.onprogress = function(data){
                    options.onprogress(data);
                };
            }
            //可能需要加下载路径
            localDir(function(direntry){
                if (!direntry) {
                    lightapp.error(ErrCode.FS_ERR, err, options);
                    return ;
                }
                FileTransfer.download(link, direntry.fullPath +"/" + name, function(result) {
                    options.onsuccess.apply(this, arguments);
                }, function(err) {
                    fterror(ErrCode.FS_ERR, err, options);
                },options);
            });
            
        });
    }; 
    
    /**
     * 终止
     *
     * @function abort
     * @memberof clouda.device.fs
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    
    it.abort = function() {
        if(FileTransfer === null){
            lightapp.error(ErrCode.FS_ERR, clouda.STATUS.SYSTEM_FAILURE, options);
        }else{
            FileTransfer.abort();
        }
    }; 
    /**
     * remove
     *
     * @function remove
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.remove = function(link,options){
       
        installPlugin("device", function(device) {

            var fileEntry = new device.fs.FileEntry(getFileNameFromPath(link), link);
            
            fileEntry.remove(function() {
               options.onsuccess.apply(this,arguments);
            }, function(error) {
               lightapp.error(ErrCode.FS_ERR,error,options);
            },options);
        });
    };
    
    it.empty = function(options){
        installPlugin("device", function(device){
            //var ld = localDir();
            localDir(function(direntry){
                var directEntry = direntry;
                directEntry.removeRecursively(function(){
                    options.onsuccess.apply(this,arguments);
                }, function(error){
                    lightapp.error(ErrCode.FS_ERR,error,options);
                },options);
            });
            
        });
    };
    
    it.count = function(options){
        installPlugin("device", function(device) {
            localDir(function(direntry){
                var directEntry = direntry;
                var directReader = directEntry.createReader();
                
                directReader.readEntries(function(entries){
                    options.onsuccess.call(this,entries.length);
                }, function(error){
                    lightapp.error(ErrCode.FS_ERR,error,options);
                },options);
            });
            
        });
    };
    /**
     * getInfo
     *
     * @function getInfo
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink 文件全路径
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    
    it.getInfo = function(link,options){
        installPlugin("device", function(device) {
            var fileEntry = new device.fs.FileEntry(getFileNameFromPath(link), link);
            fileEntry.file(function(fileobj){
                options.onsuccess(fileobj);
            },function(){
                lightapp.error(ErrCode.FS_ERR,ErrCode.UNKNOW_CALLBACK,options);
            });
            
        },options);
    };
    it.getInfoByOffset = function(offset,options){
        installPlugin("device", function(device) {
            localDir(function(direntry){
                var directEntry = direntry;
                var directReader = directEntry.createReader();
                directReader.readEntries(function(entries){
                    if (offset >= entries.length){
                        lightapp.error(ErrCode.FS_ERR,ErrCode.UNKNOW_CALLBACK,options);
                        return ;
                    }
                    fileEntry.file(function(fileobj){
                        options.onsuccess(fileobj);
                    },function(){
                        lightapp.error(ErrCode.FS_ERR,ErrCode.UNKNOW_CALLBACK,options);
                    });
                }, function(error){
                    lightapp.error(ErrCode.FS_ERR,error,options);
                },options);
            });
            
        },options);
    };
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 geolocation 空间，clouda.device.geolocation 支持退化
    var it = module.geolocation = {};
    
    /**
     * @object geolocation
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.geolocation
     */
    
    module.LOCATION_METHOD = {
        BASE_STATION:0,
        GPS:1
    };
    
    var mapstart = new delegateClass("map","start");
    var mapstop = new delegateClass("map","stop");
    var maplocation = new delegateClass("map","locationRequest");
    
    var watchPosition = new delegateClass("device","geolocation","watchPosition");
    var clearWatch = new delegateClass("device","geolocation","clearWatch");
    
    /**
     * 获取当前地理位置，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @param {int} [options.maximumAge] 
     * @param {int} [options.timeout] 
     * @returns null
     * 
     */
    it.get = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.getCurrentPosition("(function(result){("+options.onsuccess.toString()+")(result.coords);})",
                            "("+options.onfail.toString()+")");
             return false;
         }
        // if (options.method === module.LOCATION_METHOD.BASE_STATION ){
             // options.enableHighAccuracy = false;
         // }else{
             // options.enableHighAccuracy = true;
         // }
        mapstart(function(obj){
            if ( typeof obj==='object' ){
                options.onsuccess(obj);
            }else{
                lightapp.error(ErrCode.LOC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            mapstop(function(){},function(){});
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前加速度，接收成功，失败的回调和间隔
     *
     * @function startListen
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @param {int} [options.maximumAge] 
     * @param {int} [options.timeout] 
     * 
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.startListenLocation(
                "(function(result){("+options.onsuccess.toString()+")(result.coords);})",
                "("+options.onfail.toString()+")");   
             return false;
         }
         
        mapstart(function(obj){
            if ( typeof obj==='object' ){
                options.onsuccess(obj);
            }else{
                lightapp.error(ErrCode.LOC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },options);
     
    };
    
    /**
     * 终止获取回调
     *
     * @function stopListen
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function(options){
        
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            // var successCallback = "("+ options.onsuccess.toString() + ")";
            var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";
            var errorCallback = "("+ options.onfail.toString() + ")";
            BLightApp.stopListenLocation(cloudasuccess,errorCallback);
            return;
        }
        
        mapstop(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },options);
    };
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 globalization 空间，clouda.device.globalization 
    var it = module.globalization = {};
    /**
     * @object globalization
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.globalization
     */
    
     // var boot = ['dateToString','getCurrencyPattern','getDateNames','getDatePattern','getFirstDayOfWeek',
        // 'getLocaleName','getNumberPattern','getPreferredLanguage','isDayLightSavingsTime','numberToString',
        // 'stringToDate','stringToNumber'];
     // var toolKit={};
     // for(var i=0,len=boot.length;i<len;i++){
         // toolKit[boot[i]] = new delegateClass("device","globalization",boot[i]);
     // }
    var getLocaleName = new delegateClass("device","globalization",'getLocaleName');
    
    /**
     *
     * @function getPreferredLanguage
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
     // it.getPreferredLanguage = function (options) {
        // toolKit.getPreferredLanguage(options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
     // };
    /**
     *
     * @function getlocale
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.getlocale = function (options) {
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
            try{
                var info = BLightApp.getGlobalizationInfo();
                
                options.onsuccess(info);
            }catch(e){
                lightapp.error(ErrCode.GLO_ERR,e.stack,options);
            }
            
            return false;
         }
        getLocaleName(function(result){
            if (typeof result.value === 'string'){
                options.onsuccess(result.value.replace(/_\w+/,""));//languate_country
            }else{
                lightapp.error(ErrCode.GLO_ERR,ErrCode.GLO_ERR,options);
            }
            
        },function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    // /**
     // * @function dateToString
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {Date} date
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.dateToString = function (date, options) {
        // toolKit.dateToString(date,options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // * @function stringToDate
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {string} dateString
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.stringToDate = function (dateString, options) {
        // toolKit.stringToDate(dateString,options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // *
     // * @function getDatePattern
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.getDatePattern = function (options) {
        // toolKit.getDatePattern(options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // *
     // * @function getDateNames
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.getDateNames = function (options) {
        // toolKit.getDateNames(options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // * @function isDayLightSavingsTime
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {Date} date
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.isDayLightSavingsTime = function (date, options) {
        // toolKit.isDayLightSavingsTime(date,options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // *
     // * @function getFirstDayOfWeek
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.getFirstDayOfWeek = function (options) {
        // toolKit.getFirstDayOfWeek(options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // *
     // * @function numberToString
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {int} number
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.numberToString = function (number, options) {
        // toolKit.numberToString(options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // * @function stringToNumber
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {string} numberString
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.stringToNumber = function (numberString, options) {
        // toolKit.stringToNumber(numberString,options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // *
     // * @function getNumberPattern
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.getNumberPattern = function (options) {
        // toolKit.getNumberPattern(options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    // /**
     // * @function getCurrencyPattern
     // * @memberof clouda.device.globalization
     // * @instance
     // *
     // * @param {string} currencyCode
     // * @param {{}} options
     // * @param {Function} options.onsuccess
     // * @param {Function} options.onfail
     // */
    // it.getCurrencyPattern = function (currencyCode, options) {
        // toolKit.getCurrencyPattern(currencyCode,options.onsuccess,function(){
            // if (options && typeof options.onfail == 'function'){
                // options.onfail(ErrCode.GLO_ERR);
            // }else{
                // lightapp.error(ErrCode.GLO_ERR);
            // }
        // },options);
    // };
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 gyro 空间，clouda.device.gyro 
     /**
     * @object gyro
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.gyro
     */
    var it = module.gyro = {};
    
    //需要device的gyro模块
    
    var getCurrentAcceleration = new delegateClass("device","orientation","getCurrentDeviceOrientation");
    // var watchDeviceOrientation = new delegateClass("device","orientation","watchDeviceOrientation");
    var clearWatch = new delegateClass("device","orientation","clearWatch");
    
    
    /**
     * 获取当前角度，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.gyro
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.get = function(options){
        getCurrentAcceleration(function(obj){
            if ( typeof obj==='object' && typeof obj.alpha !='undefined' && typeof obj.beta !='undefined' && typeof obj.gamma !='undefined'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.GYRO_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.GYRO_ERR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前角度，接收成功，失败的回调和间隔
     *
     * @function startListen
     * @memberof clouda.device.gyro
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认10000 ms
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        if(start_id){
            clearWatch(start_id);
        }
        installPlugin("device", function(device) {
            start_id = device.orientation.watchDeviceOrientation(function(obj){
                if ( typeof obj==='object' && typeof obj.alpha !='undefined' && typeof obj.beta !='undefined' && typeof obj.gamma !='undefined'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.GYRO_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            }, function(error) {
               lightapp.error(ErrCode.GYRO_ERR,error,options);
            },options);
        });
    };
    /**
     * 终止获取回调
     *
     * @function stopListen
     * @memberof clouda.device.gyro
     * @instance
     *
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function() {
        clearWatch(start_id);
    };
    return it;
});
define("device",function(module) {
    var lightapp = this;
    //定义 localStorage 空间，clouda.device.localStorage 支持退化
    var it = module.localStorage = {};
    
    /**
     * @object localStorage
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.localStorage
     */
    
    
    it.set = function(key,value,options){
        try{
            window.localStorage.setItem(key,value);
            options.onsuccess(clouda.STATUS.SUCCESS);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
        
    };
    it.get = function(key,options){
        
        try{
            options.onsuccess(window.localStorage.getItem(key));
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
    };
    it.remove = function(key,options){
        
        try{
            window.localStorage.removeItem(key);
            options.onsuccess(clouda.STATUS.SUCCESS);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
    };
    it.count = function(options){
        try{
            options.onsuccess(window.localStorage.length);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
    };
    it.empty = function(options){
        try{
            window.localStorage.clear();
            options.onsuccess(clouda.STATUS.SUCCESS);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
       
    };
});define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.media 支持退化
    var it = module.media = {};
    
    module.media.mediamsg = {
        0:"NONE ACTIVE.",
        1:"ABORT_ERR.",
        2:"CONNECTION ERR.",
        3:"DECODE ERR.",
        4:"SRC NOT SUPPORT.",
    };
    var mediaerror = function(first,err,options){
        //deal with err
        if (typeof err.code !== 'undefined'){
            if (module.media.mediamsg[err.code]){
                err.error_info = module.media.mediamsg[err.code];
            }
            err.result = err.code;
            delete err.code;
        }
        
        lightapp.error(first,err,options);
    };
    var mediaerror2 = function(error,options){
        lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
    };
    
    /**
     * @object media
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.media
     */
    
    module.MEDIA_DESTINATION={};
    module.MEDIA_ENCODEING={};
    module.MEDIA_TYPE={};
    module.MEDIA_SOURCE={};
    module.MEDIA_DIRECTION={};
    
    //定义类型
    module.MEDIA_DESTINATION.DATA_URL = 0;
    module.MEDIA_DESTINATION.FILE_URI = 1;
    module.MEDIA_DESTINATION.NATIVE_URI = 2;
    
    module.MEDIA_ENCODEING.JPEG = 0;
    module.MEDIA_ENCODEING.PNG = 1;
    
    module.MEDIA_TYPE.PICTURE = 0;
    module.MEDIA_TYPE.VIDEO = 1;
    module.MEDIA_TYPE.ALLMEDIA = 2; //for function getPicture only
    module.MEDIA_TYPE.AUDIO = 3; //for function captureMedia only
    
    
    module.MEDIA_SOURCE.ALBUM = 1;
    module.MEDIA_SOURCE.CAMERA = 0;
    
    module.MEDIA_DIRECTION.BACK = 0;
    module.MEDIA_DIRECTION.FRONT = 1;
    
    //MEDIA_FORMAT.FILE
    module.MEDIA_FORMAT = {
        FILE : 0,
        BASE64:1,
    };
    module.MEDIA_STATUS = {
        NONE : 0,
        STARTING : 1,
        RUNNING : 2,
        PAUSED : 3,
        STOPPED : 4
    };
     
    var getPicture = new delegateClass("device","camera","getPicture");
    // var cleanup = new delegateClass("device","camera","cleanup");
    var captureAudio = new delegateClass("device","capture","captureAudio");
    var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
    
    
    /**
     * 启动canema，支持读取手机图库或者拍照
     *
     * @function getPicture
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options 可定义
     * @param {function} options.onsuccess 成功
     * @param {function} options.onfail 失败
     
     * @returns null
     * 
     */
    
    // it.getPicture = function(options){
        // getPicture(function(imageData){//success callback
            // if (typeof imageData=='string'){
                // options.onsuccess.apply(this,arguments);
            // }else{
                // lightapp.error(ErrCode.MEDIA_ERR,ErrCode.UNKNOW_CALLBACK,options);
            // }
//             
        // },function(nativeErr){
            // lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
        // },options);
    // };
    
    /**
     *
     * Launch audio recorder application for recording audio clip(s).
     *
     * @function captureMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {int} options.mediaType=clouda.device.MEDIA_TYPE.PICTURE
     * @param {int} [options.limit=1]
     * @param {int} [options.duration=0]
     * @param {int} [options.format=FILE]
     * @param {number} [options.quality] 
     * @param {number} [options.destinationType]
     * @param {number} [options.sourceType] 
     * @param {number} [options.mediaType]
     * @param {number} [options.mediaDirection]
     * @param {number} [options.encodingType]
     * @param {boolen} [options.saveToPhotoAlbum] 
     * @param {boolen} [options.details] 
     * @returns null
     * 
     */
    
    it.captureMedia = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            if (!options.source ){
                options.source = clouda.device.MEDIA_SOURCE.CAMERA;
            }
            var successstring = "(function(result){if(result.lastModified){result.lastModifiedDate=result.lastModified;}("+options.onsuccess.toString()+")(result);})";
            var failstring = "(function(result){if(result.error_info=='cancel'){result.result=clouda.STATUS.USER_CANCELED};("+options.onfail.toString()+")(result);})";
            // var failstring = "("+options.onfail.toString()+")";
            
            if (options.mediaType == clouda.device.MEDIA_TYPE.AUDIO) {
                lightapp.error(ErrCode.NOT_FINISH,ErrCode.NOT_FINISH,options);
            } else if (options.source == clouda.device.MEDIA_SOURCE.CAMERA) {
                if (options.mediaType == clouda.device.MEDIA_TYPE.IMAGE) {
                    BLightApp.cloudaLaunchCamera(
                            'lightapp.device.MEDIA_TYPE.IMAGE', successstring,failstring);
                } else if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO) {
                    BLightApp.cloudaLaunchCamera(
                            'lightapp.device.MEDIA_TYPE.VIDEO',  successstring,failstring);
                }
            } else if (options.source == clouda.device.MEDIA_SOURCE.ALBUM) {
                if (options.mediaType == clouda.device.MEDIA_TYPE.IMAGE) {
                    BLightApp.cloudaLaunchGallery(
                            'lightapp.device.MEDIA_TYPE.IMAGE',  successstring,failstring);
                } else if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO) {
                    BLightApp.cloudaLaunchGallery(
                            'lightapp.device.MEDIA_TYPE.VIDEO',  successstring,failstring);
                }
            }else{
                lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            }
            
            return false;
        }
        
        /*

var getPicture = new delegateClass("device","camera","getPicture");
    // var cleanup = new delegateClass("device","camera","cleanup");
    var captureAudio = new delegateClass("device","capture","captureAudio");
    var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
             */
        installPlugin("device", function(device) {
            var func;
            if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO){
                
                if (options.source === clouda.device.MEDIA_SOURCE.ALBUM){
                    func=device.camera.getPicture;
                    options.sourceType = module.MEDIA_SOURCE.ALBUM;
                }else{
                    func=device.capture.captureVideo;
                }
            }else if (options.mediaType == clouda.device.MEDIA_TYPE.AUDIO){
                func=device.capture.captureAudio;
            }else{//默认 MEDIA_TYPE.PICTURE
                if (options.format === module.MEDIA_FORMAT.BASE64){
                    options.destType = module.MEDIA_DESTINATION.DATA_URL;
                }else if (options.format === module.MEDIA_FORMAT.FILE) {
                    options.destType = module.MEDIA_DESTINATION.FILE_URI;
                }
                
                if (options.source === clouda.device.MEDIA_SOURCE.ALBUM){
                    func=device.camera.getPicture;
                    options.sourceType = module.MEDIA_SOURCE.ALBUM;
                }else if (options.format === module.MEDIA_FORMAT.BASE64){//base 64 should
                    func=device.camera.getPicture;
                }else{
                    func=device.capture.captureImage;
                }
            }
            func(function(mediaFile){
                if (Array.isArray(mediaFile)){
                    if (mediaFile.length == 1 && options.details){//处理详细信息
                        var i = 0;
                        mediaFile[i].getFormatData(function(obj){
                            mediaFile[i].width = obj.width;
                            mediaFile[i].height = obj.height;
                            mediaFile[i].duration = obj.duration;
                            options.onsuccess(mediaFile[0]);
                        },function(){});
                    }else{
                        if (mediaFile.length === 1){
                            options.onsuccess(mediaFile[0]);
                        }else{
                            options.onsuccess(mediaFile);
                        }
                    }
                } else {//base64
                    if (options.format === module.MEDIA_FORMAT.FILE) {
                        var mediaFile1 = new device.fs.MediaFile("tmpfile",mediaFile);
                        options.onsuccess(mediaFile1);
                    }else{
                        options.onsuccess(mediaFile);
                    }
                    
                }
            },function(nativeErr){
                if (nativeErr.code){
                    nativeErr.result = nativeErr.code;
                    nativeErr.error_info = nativeErr.message;
                }
                if(nativeErr.result == 3){// 取消code hack对齐
                    lightapp.error(ErrCode.MEDIA_ERR,{result:clouda.STATUS.USER_CANCELED,error_info:"cancel"},options);
                }else{
                    lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
                }
                
            },options);
        },options);
        
        
    };
    
     /**
     *
     * create mediafile by link
     *
     * @function createMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {string} link
     * @param {string} operator
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onstatus
     * @param {float} volume 设置声音大小 最大1.0 仅限(setVolume)
     * @param {int} time 从开始到的毫秒数 仅限(getDuration)
     * @returns null
     * 
     */
    var media={};
    it.operateMedia = function(link,operator,options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            var successstring = "(function(result){if(result.lastModified){result.lastModifiedDate=result.lastModified;}("+options.onsuccess.toString()+")(result);})";
            var recordsuccess = "(function(result){("+options.onsuccess.toString()+")(result.fullPath);})";
            var failstring = "(function(result){if (!result.error_info){result.error_info=clouda.device.media.mediamsg[result.result]};("+options.onfail.toString()+")(result);})";
            // var emptystring = "(function(){})";
            var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";
            switch(operator){
                case "startRecord":
                    BLightApp.startRecording(link,cloudasuccess,
                            failstring);
                    break;
                case "stopRecord":
                    BLightApp.stopRecording(recordsuccess,
                            failstring);
                    break;
                case "play":
                    BLightApp.playAudio(link,'lightapp.device.AUDIO_TYPE.PLAY',cloudasuccess,
                            failstring);
                    break;
                case "stop":
                    BLightApp.playAudio(link,'lightapp.device.AUDIO_TYPE.STOP',cloudasuccess,
                            failstring);
                    break;
                case "seekTo":
                    BLightApp.audioSeekTo(options.time,cloudasuccess,failstring);
                    break;
                case "setVolume":
                    BLightApp.setVolume(options.volume,cloudasuccess,failstring);
                    break;
                case "speedFF":
                    BLightApp.audioSpeedFF(cloudasuccess,failstring);
                    break;
                default:
                    lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            }
            return false;
        }
        installPlugin("device", function(device) {
           
            if (!media[link]){
                media[link] = new device.Media(link,function(id){
                },function(nativeErr){
                    
                    try{
                        media[link].release();
                    }catch(err){}
                    if (media[link]){
                         mediaerror(ErrCode.MEDIA_ERR,nativeErr,options);
                         delete media[link];
                    }
                    
                   
                },options.onstatus);
            }
            switch(operator){
                // case "getCurrentPosition":
                    // media[link][operator].call(media[link],options.onsuccess,options.onfail);
                    // break;
                case "getDuration":
                    var duration = media[link][operator]();
                    if (duration > -1) {
                        options.onsuccess(duration);
                    }else{
                        options.onfail(duration);
                    }
                    break;
                case "seekTo":
                    options.time =  parseInt(options.time,10);
                    if (!options.time && options.time !== 0){
                        mediaerror2("options.time should be a number",options);
                        return ;
                    }
                    if(options.time<0){
                        options.time = 0;
                    }
                    media[link][operator](options.time);
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                case "setVolume":
                    options.volume =  parseFloat(options.volume);
                    if (!options.volume && options.volume !== 0){
                        mediaerror2("options.volume should be a number between 0.0 to 1.0.",options);
                        return ;
                    }
                    if(options.volume<0){
                        options.volume = 0;
                    }
                    if(options.volume>1){
                        options.volume = 1;
                    }
                    media[link][operator](options.volume);
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                case "speedFF":
                    // console.log(JSON.stringify(media[link].getCurrentPosition()));//getCurrentPosition
                    // var duration = media[link][operator]();
                    //clouda.STATUS.SUCCESS
                    alert('not ready');
                    break;
                case "play"://应该添加完成的callback
                    // media[link][operator](options.onsuccess);
                    media[link][operator](options,options.onsuccess);
                    break;
                case "startRecord":
                case "stop":
                case "pause":
                    media[link][operator]();
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                case "stopRecord":
                    media[link][operator](options.onsuccess,options.onfail);
                    break;
                case "release":
                    media[link][operator]();
                    options.onsuccess(link);
                    delete media[link];
                
            }
            
            
        },options);
    };
   
    return module;
});define("device",function(module) {
    /**
     * @object notification
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.notification
     */
    // var lightapp = this;
    var it = module.notification = {};
    
    var alert = new delegateClass("device","notification","alert");
    var confirm = new delegateClass("device","notification","confirm");
    var prompt = new delegateClass("device","notification","prompt");
    var beep = new delegateClass("device","notification","beep");
    var vibrate = new delegateClass("device","notification","vibrate");
    
    var activityStart = new delegateClass("device","notification","activityStart");
    var activityStop = new delegateClass("device","notification","activityStop");
    var progressStart = new delegateClass("device","notification","progressStart");
    var progressValue = new delegateClass("device","notification","progressValue");
    var progressStop = new delegateClass("device","notification","progressStop");
    /**
     * 调用系统 alert 方法，接收一个msg参数和一个可选的配置
     *
     * @function alert
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 点击button的callback
     * @param {string} [options.title] 弹出框的title
     * @param {string} [options.buttonName] 弹出框的buttonName
     * @returns null
     * 
     */
    it.alert = function(msg,options){
        if (typeof options === 'object'){
            return alert(msg,options.onsuccess,options.title,options.buttonName,options);
        }
        return alert(msg);
    };
    /**
     * 调用系统 confirm 方法，接收一个msg参数和一个可选的配置
     *
     * @function confirm
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 点击确定的callback
     * @param {string} [options.title] 弹出框的title
     * @param {array} [options.buttonLabels] 弹出框的确定和取消按键，默认是['ok','cancel']
     * @returns null
     * 
     */
    it.confirm = function(msg,options){
        if (options.buttonLabels && options.buttonLabels.length > 2){
            options.buttonLabels.length = 2;
        }
        confirm.call(this,msg,function(data){
            if (data === 2){//cancel
                options.onfail(clouda.STATUS.USER_CANCELED);
            }else{
                options.onsuccess(clouda.STATUS.SUCCESS);
            }
        },options.title,options.buttonLabels,options);
    };
    /**
     * 滴滴声
     *
     * @function beep
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {number} milliseconds 持续时间，1000 毫秒 等于 1 秒
     * @returns null
     * 
     */
    it.beep = function(time){
        beep(time);
    };
     /**
     * 振动
     *
     * @function vibrate
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {number} milliseconds 持续时间，1000 毫秒 等于 1 秒
     * @returns null
     * 
     */
    it.vibrate = function(time){
        vibrate(time);
    };
    
    /**
     * 弹出定制化的dialog，接收一个msg参数和一个可选的配置
     *
     * @function prompt
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 点击确定的callback
     * @param {string} [options.title] 标题
     * @param {array} [options.buttonLabels] 确定和取消按键，默认是['ok','cancel']
     * @param {string} [options.defaultText] 输入框默认文字
     * @returns null
     * 
     */
    it.prompt = function(msg,options){
        if (options.buttonLabels && options.buttonLabels.length > 2){
            options.buttonLabels.length = 2;
        }
        prompt.call(this,msg,function(data){
            if (data === 2){//cancel
                options.onfail(clouda.STATUS.USER_CANCELED);
            }else{
                options.onsuccess(clouda.STATUS.SUCCESS);
            }
        },options.title,options.buttonLabels,options.defaultText,options);
    };
    
    /**
     * 弹出loading
     *
     * @function activityStart
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} title 
     * @param {string} msg 
     * @param {{}} options 可定义
     * @param {function} [options.onfail] 失败调用
     * @returns null
     * 
     */
    it.startLoad = function(title,msg,options){
        activityStart(title,msg,options);
    };
    
     /**
     * 关闭loading
     *
     * @function activityStart
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {{}} options 可定义
     * @param {function} [options.onfail] 失败调用
     * @returns null
     * 
     */
    it.stopLoad = function(options){
        activityStop(options);
    };
    
     /**
     * 弹出进度条
     *
     * @function activityStart
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} title 
     * @param {string} msg 
     * @param {{}} options 可定义
     * @param {function} [options.onfail] 失败调用
     * @returns null
     * 
     */
    it.startProgress = function(title,msg,options){
        progressStart(title,msg);
    };
    it.updateProgress = function(value){
        progressValue(value);
    };
    it.stopProgress = function(){
        progressStop();
    };
    return module;
});
define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.qr = {};
    
    /**
     * @object qr
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.qr
     */
    
    
    var qr = new delegateClass("barcode","identifyQRcode");
    var bar = new delegateClass("barcode","identifyBarcode");
    // var optionClass = new delegateClass("barcode","QRcodeOptions");
    var create = new delegateClass("barcode","createQRcode");
    
    module.QR_TYPE = {
        QRCODE : 1,
        BARCODE: 2
    };
    /**
     * 扫二维码
     *
     * @function startCapture
     * @memberof clouda.device.qr
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
     it.startCapture = function(options){
         
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {

            if (options.type == clouda.device.QR_TYPE.QRCODE) {
                //"(function(result){("+options.onfail.toString()+")(JSON.parse(result.device_info).os_version);})"
                BLightApp.startQRcode('lightapp.device.QR_TYPE.QRCODE',"(function(result){("+options.onsuccess.toString()+")(result.qr_result);})",
                            "("+options.onfail.toString()+")");
            } else if (options.type == clouda.device.QR_TYPE.BARCODE) {
                BLightApp.startQRcode('lightapp.device.QR_TYPE.BARCODE',"(function(result){("+options.onsuccess.toString()+")(result.qr_result);})",
                            "("+options.onfail.toString()+")");
            }
            
            return ;
        }
         
         if (options.type === module.QR_TYPE.BARCODE){//默认是qr，除非指定barcode
             bar(function(string){//success callback
                if (typeof string=='string'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
                
            },function(nativeErr){
                lightapp.error(ErrCode.QR_ERR,nativeErr,options);
            },options);
         }else{
             qr(function(string){//success callback
                if (typeof string=='string'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
                
            },function(nativeErr){
                lightapp.error(ErrCode.QR_ERR,nativeErr,options);
            },options);
         }
        
     };
     
   
    var QR_TYPE = {};
    QR_TYPE.BLACK = 0;
    QR_TYPE.COLOR = 1;
    QR_TYPE.DYNAMIC = 2;
    
    var QR_DESTTYPE = {};
    QR_DESTTYPE.GIF = "gif";
    QR_DESTTYPE.JPEG = "jpeg";
    
    /**
     * 生成二维码
     *
     * @function generate
     * @memberof clouda.device.qr
     * @instance
     *
     * @param {string} 要生成的文字
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.animate] 
     * @param {string} [options.backgroundUrl] 
     * @param {boolen} [options.mono] 
     * @param {boolen} [options.offline] 离线生成二维码，不支持多余配置
     * @returns null
     * 
     */
    it.generate = function(content,options){
        //function(sucessCallback, errorCallback, type, content, backgroundUrl, destType){
        
        //目前生成使用js能力
        if (typeof options.offline == 'undefined'){
            options.offline = true;
        }
        
        //0. 先判断是否使用离线生成能力
        if (options.offline){
            if (content.length > 255){
                lightapp.error(ErrCode.QR_ERR,999,options);
            }else{
                try{
                    var len = content.length;
                    for(var t=1;t<9;t++){
                        if (len/2 < 1){
                            break;
                        }else{
                            len = len/2;
                        }
                    }
                    var qr = clouda.lib.qrcode(t+2,'M');
                    // var qr = qrcode(typeNumber || 4, errorCorrectLevel || 'M');
                    qr.addData(content);
                    qr.make();
                    options.onsuccess(qr.createImgTag());
                }catch(e){
                    lightapp.error(ErrCode.QR_ERR,998,options);
                }
      
            }
            return ;
        }
        //1.判断动画与否
        if ( options.animate ){//设定生成图片的类型
            options.destType = QR_DESTTYPE.GIF;
            options.type = QR_TYPE.DYNAMIC;
        }else{
            options.destType = QR_DESTTYPE.JPEG;
        }
        //2.判断黑白与否
        if (options.destType === QR_DESTTYPE.JPEG){// png在判断是否为黑白
            if ( options.mono === false ) {//默认是mono是true，即是黑白
                options.type = QR_TYPE.COLOR;
            }else{
                options.type = QR_TYPE.BLACK;
            }
        }
        installPlugin("barcode",function(plg){
            var opt = new plg.QRcodeOptions(options.type, options.destType, options.backgroundUrl||"");
            plg.createQRcode(
              function(result) {
                options.onsuccess(result);
              },
              function (error) {
                  lightapp.error(ErrCode.QR_ERR,error,options);
              },
              content,
              opt
            );
        });
        // create(function(string){//success callback
            // if (typeof string=='string'){
                // options.onsuccess.apply(this,arguments);
            // }else{
                // lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
            // }
//             
        // },function(nativeErr){
            // lightapp.error(ErrCode.QR_ERR,nativeErr,options);
        // },options.type,content,options.backgroundUrl,options.destType);
     };
});define("device",function(module) {
    var lightapp = this;
    var it = module.screen = {};
    
    /**
     * @object screen
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.screen
     */
    
    var takeScreenshot = new delegateClass("device","sharescreenshot","takeScreenshot");
    var sharePicture = new delegateClass("device","sharescreenshot","sharePicture");
    var shareScreenshot = new delegateClass("device","sharescreenshot","shareScreenshot");
    
    /**
     * 截屏
     *
     * @function captureScreen
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.captureScreen = function(options) {
        takeScreenshot(function(base64jpeg){
            options.onsuccess(base64jpeg);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
    /**
     * 分享
     *
     * @function shareImage
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {imgData} base64imgData 图片
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.shareImage = function(imgData,options) {
        sharePicture(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        },imgData);
    };
    
    /**
     * 截屏+分享
     *
     * @function shareScreen
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.shareScreen = function(options) {
        shareScreenshot(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
});define("touch",function(module, clouda) {
    
    var touch = touch || {};
    
    (function(doc, exports) {
        'use strict';
        var os = (function() {
            var navigator = window.navigator,
            userAgent = navigator.userAgent,
            android = userAgent.match(/(Android)[\s\/]+([\d\.]+)/),
            ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
            wp = userAgent.match(/(Windows\s+Phone)\s([\d\.]+)/),
            isWebkit = /WebKit\/[\d.]+/i.test(userAgent),
            isSafari = ios ? (navigator.standalone ? isWebkit: (/Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/MQQBrowser/i.test(userAgent))) : false,
            os = {};

            if (android) {
                os.android = true;
                os.version = android[2];
            }
            if (ios) {
                os.ios = true;
                os.version = ios[2].replace(/_/g, '.');
                os.ios7 = /^7/.test(os.version);
                if (ios[1] === 'iPad') {
                    os.ipad = true;
                } else if (ios[1] === 'iPhone') {
                    os.iphone = true;
                    os.iphone5 = screen.height == 568;
                } else if (ios[1] === 'iPod') {
                    os.ipod = true;
                }
            }
            if (wp) {
                os.wp = true;
                os.version = wp[2];
                os.wp8 = /^8/.test(os.version);
            }
            if (isWebkit) {
                os.webkit = true;
            }
            if (isSafari) {
                os.safari = true;
            }

            return os;
        })();

        var PCevts = {
            'touchstart': 'mousedown',
            'touchmove': 'mousemove',
            'touchend': 'mouseup',
            'touchcancel': 'mouseout'
        };

        var utils = {
            getType: function(obj) {
                return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
            },
            getSelector: function(el) {
                if (el.id) {
                    return "#" + el.id;
                }
                if (el.className) {
                    var cns = el.className.split(/\s+/);
                    return "." + cns.join(".");
                } else {
                    return el.tagName.toLowerCase();
                }
            },
            matchSelector: function(target, selector) {
                return target.webkitMatchesSelector(selector);
            },
            getEventListeners: function(el) {
                return el.listeners;
            },
            getPCevts: function(evt) {
                return PCevts[evt] || evt;
            },
            forceReflow: function() {
                var domTreeOpDiv = document.getElementById("domTreeOp");
                if (!domTreeOpDiv) {
                    domTreeOpDiv = document.createElement("div");
                    domTreeOpDiv.id = "domTreeOp";
                    document.body.appendChild(domTreeOpDiv);
                }
                var parentNode = domTreeOpDiv.parentNode;
                var nextSibling = domTreeOpDiv.nextSibling;
                parentNode.removeChild(domTreeOpDiv);
                parentNode.insertBefore(domTreeOpDiv, nextSibling);
            }
        };

        /** 底层事件绑定/代理支持  */
        var proxyid = 0;
        var proxies = [];
        var _trigger = function(el, evt, detail) {

            detail = detail || {};
            var e,
                opt = {
                bubbles: true,
                cancelable: true,
                detail: detail
            };

            try{
                if (typeof CustomEvent !== 'undefined') {
                    e = new CustomEvent(evt, opt);
                    if (el) {
                        el.dispatchEvent(e);
                    }
                } else {
                    e = document.createEvent("CustomEvent");
                    e.initCustomEvent(evt, true, true, detail);
                    if (el) {
                        el.dispatchEvent(e);
                    }
                }
            }catch(err){
                console.error("touch not support");
            }

        };

        /**
             * {DOM} element
             * {String} eventName
             * {Function} handler
             */
        var _bind = function(el, evt, handler) {
            el.listeners = el.listeners || {};

            if (!el.listeners[evt]) {
                el.listeners[evt] = [handler];
            } else {
                el.listeners[evt].push(handler);
            }
            var proxy = function(e) {
                if (os.ios7) {
                    utils.forceReflow();
                }
                e.originEvent = e;
                e.startRotate = function() {
                    __rotation_single_finger = true;
                };
                for (var p in e.detail) {
                    if(p !== 'type'){
                        e[p] = e.detail[p];
                    }
                }
                handler.call(e.target, e);
            };

            handler.proxy = handler.proxy || {};
            if (!handler.proxy[evt]) {
                handler.proxy[evt] = [proxyid++];
            } else {
                handler.proxy[evt].push(proxyid++);
            }
            proxies.push(proxy);

            if( el.addEventListener){ el.addEventListener(evt, proxy, false); }
        };

        /**
             * {DOM} element
             * {String} eventName
             * {Function} the same handler of _bind
             */
        var _unbind = function(el, evt, handler) {
            if (!handler) {
                var handlers = el.listeners[evt];
                if (handlers && handlers.length) {
                    handlers.forEach(function(handler) {
                        el.removeEventListener(evt, handler, false);
                    });
                }
            } else {
                var proxyids = handler.proxy[evt];
                if (proxyids && proxyids.length) {
                    proxyids.forEach(function(proxyid) {
                        if (el.removeEventListener) {
                            el.removeEventListener(evt, proxies[proxyid], false);
                        }
                    });
                }
            }
        };

        /**
             * {DOM} delegate element
             * {String} eventName
             * {String} selector of sub elements
             * {Function} handler
             */
        var _delegate = function(el, evt, sel, handler) {
            var proxy = function(e) {
                var target;
                e.originEvent = e;
                e.startRotate = function() {
                    __rotation_single_finger = true;
                };
                for (var p in e.detail) {
                    if(p !== 'type'){
                        e[p] = e.detail[p];
                    }
                }
                var integrateSelector = utils.getSelector(el) + " " + sel;
                var match = utils.matchSelector(e.target, integrateSelector);
                var ischild = utils.matchSelector(e.target, integrateSelector + " " + e.target.nodeName);
                if (!match && ischild) {
                    if (os.ios7) {
                        utils.forceReflow();
                    }
                    target = e.target;
                    while (!utils.matchSelector(target, integrateSelector)) {
                        target = target.parentNode;
                    }
                    handler.call(target, e);
                } else {
                    if (os.ios7) {
                        utils.forceReflow();
                    }
                    if (match || ischild) {
                        handler.call(e.target, e);
                    }
                }
            };

            handler.proxy = handler.proxy || {};
            if (!handler.proxy[evt]) {
                handler.proxy[evt] = [proxyid++];
            } else {
                handler.proxy[evt].push(proxyid++);
            }
            proxies.push(proxy);

            el.listeners = el.listeners || {};
            if (!el.listeners[evt]) {
                el.listeners[evt] = [proxy];
            } else {
                el.listeners[evt].push(proxy);
            }
            if(el.addEventListener){el.addEventListener(evt, proxy, false);}
        };

        /**
             * {DOM} delegate element
             * {String} eventName
             * {String} selector of sub elements
             * {Function} the same handler of _on
             */
        var _undelegate = function(el, evt, sel, handler) {
            if (!handler) {
                var listeners = el.listeners[evt];
                listeners.forEach(function(proxy) {
                    el.removeEventListener(evt, proxy, false);
                });
            } else {
                var proxyids = handler.proxy[evt];
                if (proxyids.length) {
                    proxyids.forEach(function(proxyid) {
                        if (el.removeEventListener) {
                            el.removeEventListener(evt, proxies[proxyid], false);
                        }
                    });
                }
            }
        };

        /** 手势识别 */
        var config = {
            tap: true,
            doubleTap: true,
            tapMaxDistance: 10,
            hold: true,
            holdTime: 650,
            //ms
            maxDoubleTapInterval: 300,

            //swipe
            swipe: true,
            swipeTime: 300,
            swipeMinDistance: 18,
            swipeFactor: 5,

            drag: true,
            //pinch config, minScaleRate与minRotationAngle先指定为0
            pinch: true,
            minScaleRate: 0,
            minRotationAngle: 0
        };

        var _hasTouch = ('ontouchstart' in window);
        var smrEventList = {
            TOUCH_START: 'touchstart',
            TOUCH_MOVE: 'touchmove',
            TOUCH_END: 'touchend',
            TOUCH_CANCEL: 'touchcancel',

            MOUSE_DOWN: 'mousedown',
            MOUSE_MOVE: 'mousemove',
            MOUSE_UP: 'mouseup',

            CLICK: 'click',

            //PINCH TYPE EVENT NAMES
            PINCH_START: 'pinchstart',
            PINCH_END: 'pinchend',
            PINCH: 'pinch',
            PINCH_IN: 'pinchin',
            PINCH_OUT: 'pinchout',

            ROTATION_LEFT: 'rotateleft',
            ROTATION_RIGHT: 'rotateright',
            ROTATION: 'rotate',

            SWIPE_START: 'swipestart',
            SWIPING: 'swiping',
            SWIPE_END: 'swipeend',
            SWIPE_LEFT: 'swipeleft',
            SWIPE_RIGHT: 'swiperight',
            SWIPE_UP: 'swipeup',
            SWIPE_DOWN: 'swipedown',
            SWIPE: 'swipe',

            DRAG: 'drag',

            //HOLD AND TAP  
            HOLD: 'hold',
            TAP: 'tap',
            DOUBLE_TAP: 'doubletap'
        };

        /**
             * 获取事件的位置信息
             * @param  ev, 原生事件对象
             * @return array  [{ x: int, y: int }]
             */
        function getPosOfEvent(ev) {
            //多指触摸， 返回多个手势位置信息
            if (_hasTouch) {
                var posi = [];
                var src = null;

                for (var t = 0, len = ev.touches.length; t < len; t++) {
                    src = ev.touches[t];
                    posi.push({
                        x: src.pageX,
                        y: src.pageY
                    });
                }
                return posi;
            } //处理PC浏览器的情况
            else {
                return [{
                    x: ev.pageX,
                    y: ev.pageY
                }];
            }
        }
        /**
             *获取两点之间的距离
             */
        function getDistance(pos1, pos2) {
            var x = pos2.x - pos1.x,
            y = pos2.y - pos1.y;
            return Math.sqrt((x * x) + (y * y));
        }

        /**
             *计算事件的手势个数
             *@param ev {Event}
             */
        function getFingers(ev) {
            return ev.touches ? ev.touches.length: 1;
        }
        //计算收缩的比例
        function calScale(pstart, pmove) {
            if (pstart.length >= 2 && pmove.length >= 2) {
                var disStart = getDistance(pstart[1], pstart[0]);
                var disEnd = getDistance(pmove[1], pmove[0]);

                return disEnd / disStart;
            }
            return 1;
        }

        //return 角度，范围为{-180-0，0-180}， 用来识别swipe方向。
        function getAngle(p1, p2) {
            return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        }
        //return 角度， 范围在{0-180}， 用来识别旋转角度
        function _getAngle180(p1, p2) {
            var agl = Math.atan((p2.y - p1.y) * -1 / (p2.x - p1.x)) * (180 / Math.PI);
            return (agl < 0 ? (agl + 180) : agl);
        }

        //根据角度计算方位 
        //@para agl {int} 是调用getAngle获取的。
        function getDirectionFromAngle(agl) {
            var directions = {
                up: agl < -45 && agl > -135,
                down: agl >= 45 && agl < 135,
                left: agl >= 135 || agl <= -135,
                right: agl >= -45 && agl <= 45
            };
            for (var key in directions) {
                if (directions[key]) return key;
            }
            return null;
        }

        //取消事件的默认行为和冒泡
        function preventDefault(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        function getXYByElement(el) {
            var left = 0,
            top = 0;

            while (el.offsetParent) {
                left += el.offsetLeft;
                top += el.offsetTop;
                el = el.offsetParent;
            }
            return {
                left: left,
                top: top
            };
        }

        function reset() {
            startEvent = moveEvent = endEvent = null;
            __tapped = __touchStart = startSwiping = startPinch = false;
            startDrag = false;
            pos = {};
            __rotation_single_finger = false;
        }

        function isTouchStart(ev) {
            return (ev.type === 'touchstart' || ev.type === 'mousedown');
        }
        function isTouchMove(ev) {
            return (ev.type === 'touchmove' || ev.type === 'mousemove');
        }
        function isTouchEnd(ev) {
            return (ev.type === 'touchend' || ev.type === 'mouseup' || ev.type === 'touchcancel');
        }

        var pos = {
            start: null,
            move: null,
            end: null
        };
        var startTime = 0;
        var fingers = 0;
        var startEvent = null;
        var moveEvent = null;
        var endEvent = null;
        var startSwiping = false;
        var startPinch = false;
        var startDrag = false;

        var __offset = {};
        var __touchStart = false;
        var __holdTimer = null;
        var __tapped = false;
        var __lastTapEndTime = null;

        var __scale_last_rate = 1;
        var __rotation_single_finger = false;
        var __rotation_single_start = []; //元素坐标中心位置
        var __initial_angle = 0;
        var __rotation = 0;

        var __prev_tapped_end_time = 0;
        var __prev_tapped_pos = null;

        var gestures = {
            _getAngleDiff: function(currentPos) {
                var diff = parseInt(__initial_angle - _getAngle180(currentPos[0], currentPos[1]), 10);
                var count = 0;

                while (Math.abs(diff - __rotation) > 90 && count++<50) {
                    if (__rotation < 0) {
                        diff -= 180;
                    } else {
                        diff += 180;
                    }
                }
                __rotation = parseInt(diff, 10);
                return __rotation;
            },
            pinch: function(ev) {
                var el = ev.target;
                if (config.pinch) {
                    //touchend进入此时的getFinger(ev) < 2
                    if (!__touchStart) return;
                    if (getFingers(ev) < 2) {
                        if (!isTouchEnd(ev)) return;
                    }
                    var scale = calScale(pos.start, pos.move);
                    var rotation = this._getAngleDiff(pos.move);
                    var eventObj = {
                        type: '',
                        originEvent: ev,
                        scale: scale,
                        rotation: rotation,
                        direction: (rotation > 0 ? 'right': 'left'),
                        fingersCount: getFingers(ev)
                    };
                    if (!startPinch) {
                        startPinch = true;
                        eventObj.fingerStatus = "start";
                        _trigger(el, smrEventList.PINCH_START, eventObj);
                    } else if (isTouchMove(ev)) {
                        eventObj.fingerStatus = "move";
                    } else if (isTouchEnd(ev)) {
                        eventObj.fingerStatus = "end";
                        _trigger(el, smrEventList.PINCH_END, eventObj);
                        reset();
                    }

                    _trigger(el, smrEventList.PINCH, eventObj);

                    if (Math.abs(1 - scale) > config.minScaleRate) {
                        var scaleEv = _utils.deepCopy(eventObj);

                        //手势放大, 触发pinchout事件
                        var scale_diff = 0.00000000001; //防止touchend的scale与__scale_last_rate相等，不触发事件的情况。
                        if (scale > __scale_last_rate) {
                            __scale_last_rate = scale - scale_diff;
                            _trigger(el, smrEventList.PINCH_OUT, scaleEv, false);
                        } //手势缩小,触发pinchin事件
                        else if (scale < __scale_last_rate) {
                            __scale_last_rate = scale + scale_diff;
                            _trigger(el, smrEventList.PINCH_IN, scaleEv, false);
                        }

                        if (isTouchEnd(ev)) {
                            __scale_last_rate = 1;
                        }
                    }

                    if (Math.abs(rotation) > config.minRotationAngle) {
                        var rotationEv = _utils.deepCopy(eventObj), eventType;

                        eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT: smrEventList.ROTATION_LEFT;
                        _trigger(el, eventType, rotationEv, false);
                        _trigger(el, smrEventList.ROTATION, eventObj);
                    }

                }
            },
            rotateSingleFinger: function(ev) {
                var el = ev.target;
                if (__rotation_single_finger && getFingers(ev) < 2) {
                    if (!pos.move) return;
                    if (__rotation_single_start.length < 2) {
                        var docOff = getXYByElement(el);

                        __rotation_single_start = [{
                            x: docOff.left + el.offsetWidth / 2,
                            y: docOff.top + el.offsetHeight / 2
                        },
                        pos.move[0]];
                        __initial_angle = parseInt(_getAngle180(__rotation_single_start[0], __rotation_single_start[1]), 10);
                    }
                    var move = [__rotation_single_start[0], pos.move[0]];
                    var rotation = this._getAngleDiff(move);
                    var eventObj = {
                        type: '',
                        originEvent: ev,
                        rotation: rotation,
                        direction: (rotation > 0 ? 'right': 'left'),
                        fingersCount: getFingers(ev)
                    };

                    if (isTouchMove(ev)) {
                        eventObj.fingerStatus = "move";
                    } else if (isTouchEnd(ev) || ev.type === 'mouseout') {
                        eventObj.fingerStatus = "end";
                        _trigger(el, smrEventList.PINCH_END, eventObj);
                        reset();
                    }

                    var eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT: smrEventList.ROTATION_LEFT;
                    _trigger(el, eventType, eventObj);
                    _trigger(el, smrEventList.ROTATION, eventObj);
                }
            },
            swipe: function(ev) {
                //目前swipe只存在一个手势上
                var el = ev.target;
                if (!__touchStart || !pos.move || getFingers(ev) > 1) {
                    return;
                }

                var now = Date.now();
                var touchTime = now - startTime;
                var distance = getDistance(pos.start[0], pos.move[0]);
                var position = {
                    x: pos.move[0].x - __offset.left,
                    y: pos.move[0].y - __offset.top
                };
                var angle = getAngle(pos.start[0], pos.move[0]);
                var direction = getDirectionFromAngle(angle);
                var touchSecond = touchTime / 1000;
                var factor = ((10 - config.swipeFactor) * 10 * touchSecond * touchSecond);
                var eventObj = {
                    type: smrEventList.SWIPE,
                    //DEFAULT: smrEventList.SWIPE event.
                    originEvent: ev,
                    position: position,
                    direction: direction,
                    distance: distance,
                    distanceX: pos.move[0].x - pos.start[0].x,
                    distanceY: pos.move[0].y - pos.start[0].y,
                    angle: angle,
                    duration: touchTime,
                    fingersCount: getFingers(ev),
                    factor: factor
                };
                if (config.swipe) {
                    var swipeTo = function() {
                        var elt = smrEventList;
                        switch (direction) {
                        case 'up':
                            _trigger(el, elt.SWIPE_UP, eventObj);
                            break;
                        case 'down':
                            _trigger(el, elt.SWIPE_DOWN, eventObj);
                            break;
                        case 'left':
                            _trigger(el, elt.SWIPE_LEFT, eventObj);
                            break;
                        case 'right':
                            _trigger(el, elt.SWIPE_RIGHT, eventObj);
                            break;
                        }
                    };

                    if (!startSwiping) {
                        eventObj.fingerStatus = eventObj.swipe = 'start';
                        startSwiping = true;
                        _trigger(el, smrEventList.SWIPE_START, eventObj);
                    } else if (isTouchMove(ev)) {
                        eventObj.fingerStatus = eventObj.swipe = 'move';
                        _trigger(el, smrEventList.SWIPING, eventObj);

                        if (touchTime > config.swipeTime && touchTime < config.swipeTime + 50 && distance > config.swipeMinDistance) {
                            swipeTo();
                            _trigger(el, smrEventList.SWIPE, eventObj, false);
                        }
                    } else if (isTouchEnd(ev) || ev.type === 'mouseout') {
                        eventObj.fingerStatus = eventObj.swipe = 'end';
                        _trigger(el, smrEventList.SWIPE_END, eventObj);

                        if (config.swipeTime > touchTime && distance > config.swipeMinDistance) {
                            swipeTo();
                            _trigger(el, smrEventList.SWIPE, eventObj, false);
                        }
                    }
                }

                if (config.drag) {
                    if (!startDrag) {
                        eventObj.fingerStatus = eventObj.swipe = 'start';
                        startDrag = true;
                    } else if (isTouchMove(ev)) {
                        eventObj.fingerStatus = eventObj.swipe = 'move';
                    } else if (isTouchEnd(ev)) {
                        eventObj.fingerStatus = eventObj.swipe = 'end';
                    }
                    _trigger(el, smrEventList.DRAG, eventObj);
                }
            },
            tap: function(ev) {
                var el = ev.target;
                if (config.tap) {
                    var now = Date.now();
                    var touchTime = now - startTime;
                    var distance = getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);

                    clearTimeout(__holdTimer); //去除hold事件
                    var isDoubleTap = (function() {
                        if (__prev_tapped_pos && config.doubleTap && (startTime - __prev_tapped_end_time) < config.maxDoubleTapInterval) {
                            var doubleDis = getDistance(__prev_tapped_pos, pos.start[0]);
                            if (doubleDis < 16) return true;
                        }
                        return false;
                    })();

                    if (isDoubleTap) {
                        _trigger(el, smrEventList.DOUBLE_TAP, {
                            type: smrEventList.DOUBLE_TAP,
                            originEvent: ev,
                            position: pos.start[0]
                        });
                        return;
                    }

                    if (config.tapMaxDistance < distance) return;

                    if (config.holdTime > touchTime && getFingers(ev) <= 1) {
                        //clearTimeout在ios上有时不work（alert引起的）， 先用__tapped顶一下
                        __tapped = true;
                        __prev_tapped_end_time = now;
                        __prev_tapped_pos = pos.start[0];
                        
                        _trigger(el, smrEventList.TAP, {
                            type: smrEventList.TAP,
                            originEvent: ev,
                            fingersCount: getFingers(ev),
                            position: pos.start[0]
                        });

                    }
                }
            },
            hold: function(ev) {
                var el = ev.target;
                if (config.hold) {
                    clearTimeout(__holdTimer);

                    __holdTimer = setTimeout(function() {
                        if (!pos.start) return;
                        var distance = getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);
                        if (config.tapMaxDistance < distance) return;

                        if (!__tapped) {
                            _trigger(el, "hold", {
                                type: 'hold',
                                originEvent: ev,
                                fingersCount: getFingers(ev),
                                position: pos.start[0]
                            });
                        }
                    },
                    config.holdTime);
                }
            }
        };

        var handlerOriginEvent = function(ev) {

            var el = ev.target;
            switch (ev.type) {
            case 'touchstart':
            case 'mousedown':
                //__rotation_single_finger = false;
                __rotation_single_start = [];
                __touchStart = true;
                if (!pos.start || pos.start.length < 2) {
                    pos.start = getPosOfEvent(ev);
                }
                if (getFingers(ev) >= 2) {
                    __initial_angle = parseInt(_getAngle180(pos.start[0], pos.start[1]), 10);
                }

                startTime = Date.now();
                startEvent = ev;
                __offset = {};

                //来自jquery offset的写法: https://github.com/jquery/jquery/blob/master/src/offset.js
                var box = el.getBoundingClientRect();
                var docEl = document.documentElement;
                __offset = {
                    top: box.top + (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0),
                    left: box.left + (window.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0)
                };

                gestures.hold(ev);
                break;
            case 'touchmove':
            case 'mousemove':
                if (!__touchStart || !pos.start) return;
                pos.move = getPosOfEvent(ev);
                if (getFingers(ev) >= 2) {
                    gestures.pinch(ev);
                } else if (__rotation_single_finger) {
                    gestures.rotateSingleFinger(ev);
                } else {
                    gestures.swipe(ev);
                }
                break;
            case 'touchend':
            case 'touchcancel':
            case 'mouseup':
            case 'mouseout':
                if (!__touchStart) return;
                endEvent = ev;

                if (startPinch) {
                    gestures.pinch(ev);
                } else if (__rotation_single_finger) {
                    gestures.rotateSingleFinger(ev);
                } else if (startSwiping) {
                    gestures.swipe(ev);
                } else {
                    gestures.tap(ev);
                }

                reset();
                __initial_angle = 0;
                __rotation = 0;
                if (ev.touches && ev.touches.length === 1) {
                    __touchStart = true;
                    __rotation_single_finger = true;
                }
                break;
            }
        };

        /**
            开发者接口
            usage:
                touch.on("#test", "tap swipeleft swiperight", handler);
                touch.trigger("#test", "tap");
                touch.off("#test", "tap swipeleft swiperight", handler);
             */
        var _on = function() {

            var evts, handler, evtMap, sel, args = arguments;
            if (args.length < 2 || args > 4) {
                return console.error("unexpected arguments!");
            }
            var els = utils.getType(args[0]) === 'string' ? doc.querySelectorAll(args[0]) : args[0];
            els = els.length ? Array.prototype.slice.call(els) : [els];
            //事件绑定
            if (args.length === 3 && utils.getType(args[1]) === 'string') {
                evts = args[1].split(" ");
                handler = args[2];
                evts.forEach(function(evt) {
                    if (!_hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    els.forEach(function(el) {
                        _bind(el, evt, handler);
                    });
                });
                return;
            }
            
            function evtMapDelegate( evt ){
                 if (!_hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                els.forEach(function(el) {
                    _delegate(el, evt, sel, evtMap[evt]);
                });
            }
            //mapEvent delegate
            if (args.length === 3 && utils.getType(args[1]) === 'object') {
                evtMap = args[1];
                sel = args[2];
                for (var evt1 in evtMap) {
                   evtMapDelegate(evt1);
                }
                return;
            }
            
            function evtMapBind(evt){
                if (!_hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                els.forEach(function(el) {
                    _bind(el, evt, evtMap[evt]);
                });
            }
            
            //mapEvent bind
            if (args.length === 2 && utils.getType(args[1]) === 'object') {
                evtMap = args[1];
                for (var evt2 in evtMap) {
                    evtMapBind(evt2);
                }
                return;
            }

            //兼容factor config
            if (args.length === 4 && utils.getType(args[2]) === "object") {
                evts = args[1].split(" ");
                handler = args[3];
                evts.forEach(function(evt) {
                    if (!_hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    els.forEach(function(el) {
                        _bind(el, evt, handler);
                    });
                });
                return;
            }

            //事件代理
            if (args.length === 4) {
                var el = els[0];
                evts = args[1].split(" ");
                sel = args[2];
                handler = args[3];
                evts.forEach(function(evt) {
                    if (!_hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    _delegate(el, evt, sel, handler);
                });
                return;
            }
        };

        var _off = function() {
            var evts, handler;
            var args = arguments;
            if (args.length < 1 || args.length > 4) {
                return console.error("unexpected arguments!");
            }
            var els = utils.getType(args[0]) === 'string' ? doc.querySelectorAll(args[0]) : args[0];
            els = els.length ? Array.prototype.slice.call(els) : [els];

            if (args.length === 1 || args.length === 2) {
                els.forEach(function(el) {
                    evts = args[1] ? args[1].split(" ") : Object.keys(el.listeners);
                    if (evts.length) {
                        evts.forEach(function(evt) {
                            if (!_hasTouch) {
                                evt = utils.getPCevts(evt);
                            }
                            _unbind(el, evt);
                            _undelegate(el, evt);
                        });
                    }
                });
                return;
            }

            if (args.length === 3 && utils.getType(args[2]) === 'function') {
                handler = args[2];
                els.forEach(function(el) {
                    evts = args[1].split(" ");
                    evts.forEach(function(evt) {
                        if (!_hasTouch) {
                            evt = utils.getPCevts(evt);
                        }
                        _unbind(el, evt, handler);
                    });
                });
                return;
            }

            if (args.length === 3 && utils.getType(args[2]) === 'string') {
                var sel = args[2];
                els.forEach(function(el) {
                    evts = args[1].split(" ");
                    evts.forEach(function(evt) {
                        if (!_hasTouch) {
                            evt = utils.getPCevts(evt);
                        }
                        _undelegate(el, evt, sel);
                    });
                });
                return;
            }

            if (args.length === 4) {
                handler = args[3];
                els.forEach(function(el) {
                    evts = args[1].split(" ");
                    evts.forEach(function(evt) {
                        if (!_hasTouch) {
                            evt = utils.getPCevts(evt);
                        }
                        _undelegate(el, evt, sel, handler);
                    });
                });
                return;
            }
        };

        var _dispatch = function(el, evt, detail) {
            var args = arguments;
            if (!_hasTouch) {
                evt = utils.getPCevts(evt);
            }
            var els = utils.getType(args[0]) === 'string' ? doc.querySelectorAll(args[0]) : args[0];
            els = els.length ? Array.prototype.call(els) : [els];

            els.forEach(function(el) {
                _trigger(el, evt, detail);
            });
        };

        //init gesture
        function init() {
            var eventNames = _hasTouch ? 'touchstart touchmove touchend touchcancel': 'mouseup mousedown mousemove mouseout';
            _on(doc, 'DOMContentLoaded',
            function() {
                var env = doc.body;
                _on(env, eventNames, handlerOriginEvent);
            });
        }

        init();

        exports.on = _on;
        exports.off = _off;
        exports.bind = _on;
        exports.unbind = _off;
        exports.live = _on;
        exports.die = _off;
        exports.config = config;
        exports.trigger = _dispatch;

    })(document, touch);
    
    //定义 touch 空间，clouda.touch
    clouda.touch = touch;
});
define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.account = {};
    
    var login = new delegateClass("device","login","login");
    var logout = new delegateClass("device","login","logout");
    
    var sslogin = new delegateClass("authorization","login");
    var loginout = new delegateClass("authorization","loginout");
    var getuserinfo = new delegateClass("authorization","getuserinfo");
    var getstatus = new delegateClass("authorization","getstatus");
    var isLogin = new delegateClass("device","login","isLogin");
    var getAccountInfo = new delegateClass("device","login","getAccountInfo");
    
    
    module.LOGIN_TYPE={
        WEIBO : 'sinaweibo',
        QQ:'qqdenglu',
        KAIXIN:'kaixin',
        QQWEIBO:'qqweibo',
        RENREN:'renren'
    };
    
    /**
     * login
     *
     * @function login
     * @memberof clouda.mbaas.login
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.mediaType] 默认是百度登录
     * @param {string} [options.scope] 百度登录的scope
     * @returns null
     * 
     */
     it.login = function(options){
		
		if (!options.onsuccess || !options.onfail || !options.redirect_uri){
			lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
			return false;
		}
		
		if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG && BLightApp && typeof BLightApp.login === 'function') {
			
			var opt = {
				client_id : clouda.lightapp.ak,
				redirect_uri : options.redirect_uri,
				scope : options.scope || "basic",
				login_mode : options.login_mode || 0,
				login_type : options.login_type || void 0,
				mobile : options.mobile || void 0,
				display : "mobile"
			};
			
			BLightApp.login(JSON.stringify(opt), "("+options.onsuccess.toString()+")", "("+options.onfail.toString()+")");
			
		} else if ( clouda.RUNTIME === clouda.RUNTIMES.NUWA ){
			
			if (!options.mediaType){
				login(options.onsuccess,function(nativeErr){
					if (typeof nativeErr === 'object' && nativeErr.error_code === 1){
						options.onfail(clouda.STATUS.USER_CANCELED);
					}else{
						lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
					}
				},options.scope?options.scope:"basic",options);
			}else{
				sslogin(options.onsuccess,function(nativeErr){
					lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
				},options);
			}
	
		} else {
			var redirect_url = "https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=" + clouda.lightapp.ak + "&redirect_uri=" + encodeURIComponent(options.redirect_uri);
			window.open(redirect_url);
		}
         
     };
    
    /**
     * logout
     *
     * @function logout
     * @memberof clouda.mbaas.login
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.mediaType] 默认是百度登陆
     * @returns null
     * 
     */
    it.logout = function(options){
        if (!options.mediaType){
             logout(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
            },options);
         }else{
             loginout(function(){
                 options.onsuccess(clouda.STATUS.SUCCESS);
             },function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options);
         }
    };
    it.getStatus = function(options){
        if (!options.mediaType){
             isLogin(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
            },options);
         }else{
             getstatus(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options);
         }
    };
    it.getUserInfo = function(options){
        if (!options.mediaType){
             getAccountInfo(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
            },options);
         }else{
             getuserinfo(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options);
         }
    };
    // return module;
    
});define("mbaas", function(module) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.app = {};

    /**
     * addShortcut
     *
     * @function addShortcut
     * @memberof clouda.mbaas.app
     * @instance
     *
     * @param appid string 轻应用的id
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     *
     */
    it.addShortcut = function(appid, options) {
        if (!appid){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return ;
        }
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
            //Bdbox.invokeApp("BLightApp","createShortCut",[successCallback,errorCallback]); 
             var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";   
             BLightApp.createShortCut(
                cloudasuccess,
                "("+options.onfail.toString()+")");   
             return false;
        }
        installPlugin("device", function(device) {
            var info = {
                type : nuwa.am.SHORTCUT_INFO.TYPE.APP,
                appId : appid
            };
            nuwa.am.addShortcut(info, function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(err){
                lightapp.error(ErrCode.APP_ERROR, err, options);
            });
        });

    };
    
    /**
     * followSite
     *
     * @function followSite
     * @memberof clouda.mbaas.app
     * @instance
     *
     * @param appid string 轻应用的id
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     *
     */
    it.followSite = function(appid,options){
        if (!appid){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return ;
        }
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";
             BLightApp.followSite(
                cloudasuccess,
                "("+options.onfail.toString()+")");   
             return false;
        }
        installPlugin("device", function(device) {
            nuwa.am.subscribe(appid, function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(err){
                lightapp.error(ErrCode.APP_ERROR, err, options);
            });
        });
        
    };

}); define("mbaas",function(module) {
    var lightapp = this;
    var it = module.face = {};
    
    /**
     * @object facerecognition
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.facerecognition
     * 
     */
    module.FR_ERROR={
        NETWORK_ERR : 1, 
        TIMEOUT_ERR : 2,
        CANCEL_ERR : 3,
        REGISTER_ERR : 4,
        VERIFY_ERR : 5,
        DETECT_FACE_ERR : 6,
        AUTHORIZE_DEVICE_ERR : 7,
        GET_DEVICE_LIST_ERR : 8,
        CLECK_BLINK_ERR : 9,
        SERVER_ERR : 99,
        UNKNOWN_ERR : 100
    };
     
     /**
     * 注册人脸识别
     *
     * @function register
     * @memberof clouda.mbaas.facerecognition
     * @instance
     *
     * @param {string} uid 用户唯一标识符
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 
     * @param {function} [options.onfail] 
     * @returns null
     * 
     */
    it.register = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.register(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //uid
    it.verify = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            face.verify(function(){
                 options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //检查眨眼
    it.checkBlink = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.check_blink(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //绑定设备
    it.authorizeDevice = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.authorize_device(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //获取设备列表
    it.listDevice = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.get_device_list(function(){
                options.onsuccess.apply(this,arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    
});define("mbaas",function(module) {
    var lightapp = this;
    //定义 map 空间，clouda.mbaas.map 
    var it = module.map = {};
    
    /**
     * @object map
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.map
     */
    var start = new delegateClass("map","start");
    var stop = new delegateClass("map","stop");
    var locationRequest = new delegateClass("map","locationRequest");
    var poiRequest = new delegateClass("map","poiRequest");
    
    var loadScript = function(xyUrl,callback){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;
        //借鉴了jQuery的script跨域方法
        script.onload = script.onreadystatechange = function() {
            if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                if (typeof callback === 'function') {
                    callback();
                }
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if (head && script.parentNode) {
                    head.removeChild(script);
                }
            }
        };
        head.insertBefore(script, head.firstChild);
    };
    
    it.Convertor = {};
    
    it.Convertor.translate = function(point, type, callback) {
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000); //随机函数名
        var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=clouda.mbaas.map.Convertor." + callbackName;
        //动态创建script标签
        loadScript(xyUrl);
        it.Convertor[callbackName] = function(xyResult) {
            delete it.Convertor[callbackName]; //调用完需要删除改函数
            var point = new BMap.Point(xyResult.x, xyResult.y);
            if (typeof callback === 'function') {
                callback(point);
            }
        };
    };
    
    it.start = function(options){
        
        start(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
    
    it.stop = function(options){
        stop(function(data){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
    it.locationRequest = function(options){
        locationRequest(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
    it.poiRequest = function(options){
        //{poi:{p:[{x,y,dis,name}]}}
        poiRequest(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
});define("mbaas",function( module ) {
    
    //deal with clouda.mbaas
    module.share = {};
    
    return module;
    
});define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.pay = {};
    
    var init = new delegateClass("lightpay","init");
    var dopay = new delegateClass("lightpay","dopay");
    
    /**
     * init
     *
     * @function init
     * @memberof clouda.mbaas.pay
     * @instance
     *
     * @param {string} partner_id 初始化partner_id
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
     var PARTNER_ID,MD5_PRIVATE;
     
     it.init = function(partner_id,options){
         if (!partner_id || typeof partner_id !='string'){
             lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
             return false;
         }
         if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG && BLightApp && typeof BLightApp.initpay === 'function' ) {
         
         /**
          * void initpay(final String successCallback, final String errorCallback, String sp)
          */
            BLightApp.initpay("(function(result){("+options.onsuccess.toString()+")(result);})", "("+options.onfail.toString()+")", partner_id);
            return false;
         } else if (clouda.RUNTIME === clouda.RUNTIMES.NUWA){
             PARTNER_ID = partner_id;
             init(partner_id,options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.PAY_ERROR,nativeErr,options);
             },partner_id,options);
         }
         
     };
     // function createOrder($goodsname,$price){
            // var orderNO = time()*1000;
            // var tmpOrder = "currency=1&extra=";
            // tmpOrder = tmpOrder+"&goods_desc="+goodsname;
            // tmpOrder = tmpOrder+"&goods_name="+goodsname;
            // tmpOrder = tmpOrder+"&goods_url=http://item.jd.com/736610.html";
            // tmpOrder = tmpOrder+"&input_charset=1&order_create_time="+date(YmdHis)+"&order_no=";
            // tmpOrder = tmpOrder+orderNO;
            // tmpOrder = tmpOrder+"&pay_type=2&return_url=http://item.jd.com/736610.html";
            // tmpOrder = tmpOrder+"&service_code=1&sign_method=1&sp_no="+PARTNER_ID;
            // tmpOrder = tmpOrder+"&total_amount=".price;
            // tmpOrder = tmpOrder+"&transport_amount=0&unit_amount=".price;
            // tmpOrder = tmpOrder+"&unit_count=1";
//             
            // signed =md5(tmpOrder+"&key="+MD5_PRIVATE);
//             
            // tmpOrder = tmpOrder+"&sign="+signed+"&goods_channel=";
            // tmpOrder = tmpOrder+"&goods_channel_sp=0001";
//           
          // return $tmpOrder; 
//       
      // }
    /**
     * pay
     *
     * @function login
     * @memberof clouda.mbaas.login
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.orderInfo] 订单信息
     * @param {boolen} [options.hideLoading] 隐藏加载中的dialog,默认false
     * @returns null
     * 
     */
     it.doPay = function(options){
         if (!options.hideLoading){
            options.hideLoading = false;
         }
         
         if (!options.orderInfo) {
            lightapp.error(ErrCode.PAY_ERROR,ErrCode.UNKNOW_INPUT,options);
         }
         /**
          * void dopay(final String successCallback, final String errorCallback, String orderInfo, final String hideLoadingDialog)
          */
         if (clouda.RUNTIME === clouda.RUNTIMES.KUANG && BLightApp && typeof BLightApp.dopay === 'function') {
            
			BLightApp.dopay("(function(result){("+options.onsuccess.toString()+")(result);})",
						"("+options.onfail.toString()+")", options.orderInfo,options.hideLoading);
			return false;
            
         } else if (clouda.RUNTIME === clouda.RUNTIMES.NUWA) {
		 
            dopay(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.PAY_ERROR,nativeErr,options);
             },options.orderInfo,options.showdDialog,options);
			 
         } else {
			
			location.href= "https://www.baifubao.com/api/0/pay/0/wapdirect/0?" + options.orderInfo;
			return false;
			
         }
         
        
     };
    
});define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.pcs = {};
    
    // var login = new delegateClass("device","login","login");
    // var logout = new delegateClass("device","login","logout");
    module.VIDEO_STREAM = {
        "P360":"MP4_360P",
        "P480":"MP4_480P",
    };
    module.MEDIA_TYPE = {
        "IMG":"image",
        "AUD":"audio",
        "VID":"video",
        "DOC":"doc",
    };
    //M3U8_320_240、M3U8_480_224、M3U8_480_360、M3U8_640_480 和 M3U8_854_480

    module.CODEC_TYPE = {
        "M320":"M3U8_320_240",
        "M480224":"M3U8_480_224",
        "M480360":"M3U8_480_360",
        "M640":"M3U8_640_480",
        "M854":"M3U8_854_480"
    };
    /**
     * initPCS
     *
     * @function initPCS
     * @memberof clouda.mbaas.pcs
     * @instance
     * @param {string} token 使用从登录获得的token初始化pcs
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调，返回pcs
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    var currentPcs;
    var defaultPCSPath = "";
    
    it.init = function(token,options){
        if (!token){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        installPlugin("pcs", function(pcs) {
            pcs.initPCS(token,function(){
                options.onsuccess(pcs);
                currentPcs = pcs;
            },function(nativeErr){
                lightapp.error(ErrCode.PCS_ERROR,nativeErr,options);
            });
        });
        
    };
    /**
     * mkdir
     *
     * @function mkdir
     * @memberof clouda.mbaas.pcs
     * @instance
     * @param {string} pcs pcs实例
     * @param {string} path 创建路径
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调，返回pcs
     * @param {function} [options.onfail] 失败的回调
     * @param {function} [options.pcs] 默认使用初始化过的pcs
     * @returns null
     * 
     */
    it.mkdir = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.makeDir(defaultPCSPath + path, 
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.getQuota = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.quota(
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    // FIXME what's status mean?
    it.uploadFile = function(localpath,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        // serverpath =;
        currentPcs.uploadFile({"source":localpath, "target":(defaultPCSPath + serverpath)},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          },
          function(status) {
             options.onprogress(status);
          }
        );
        // pcs.uploadFile({"source":sourcePath, "target":targetPath},
          // function(result) {
            // document.getElementById('success').innerText = 'uploadFile: ' + JSON.stringify(result);
          // },
          // function (error) {
            // document.getElementById('fail').innerText = 'uploadFile: ' + JSON.stringify(error);
          // },
          // function (status) {
            // document.getElementById('status').innerText = 'uploadFile: ' + JSON.stringify(status);
          // }
     // );
    // }
    };
    it.deleteFiles = function(patharr,options){
        if (!currentPcs || !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.deleteFiles(patharr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.getMeta = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.meta(path,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //by order FIXME ORDERBY
    it.getList = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var params = {path:path};
        params.by = options.by?options.by:"time";
        params.order = options.order?options.order:"asc";
        
        currentPcs.list(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //"source":sourcePath, "type":"MP4_360P"
    //TODO all types
    it.getStreamingURL = function(serverpath,codeType,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        if (typeof codeType !== 'string'){
            codeType = module.VIDEO_STREAM.P360;
        }
        var params = {"source":defaultPCSPath + serverpath, "type":codeType};
        currentPcs.getStreamingURL(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //recursive
    it.search = function(serverpath,key,recursive,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var params = {"path":defaultPCSPath + serverpath, "key":key, "recursive":recursive};
        currentPcs.search(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //"quality":80, "width": 30,"height":
    it.thumbnail = function(serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        //{"path":testPath + '/file.png', "quality":80, "width": 30,"height": 30}
        var params = {"path":defaultPCSPath + serverpath, "quality":options.quality, "width":options.width,"height":options.height};
        currentPcs.thumbnail(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //{"from":sourcePath1,"to":targetPath1}
    it.move = function(patharr,options){
        if (!currentPcs || !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        for (var i=0,len=patharr.length;i<len;i++){
            patharr[i].from =defaultPCSPath + patharr[i].from;
            patharr[i].to =defaultPCSPath + patharr[i].to;
        }
        currentPcs.move(patharr,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //{"oldName":sourcePath1,"newName":targetPath1
    it.rename = function(patharr,options){
        if (!currentPcs|| !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        for (var i=0,len=patharr.length;i<len;i++){
            patharr[i].oldName =defaultPCSPath + patharr[i].oldName;
            patharr[i].newName =defaultPCSPath + patharr[i].newName;
        }
        currentPcs.rename(patharr,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //{"from":sourcePath1,"to":targetPath1}
    it.copy = function(patharr,options){
        if (!currentPcs|| !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        for (var i=0,len=patharr.length;i<len;i++){
            patharr[i].from =defaultPCSPath + patharr[i].from;
            patharr[i].to =defaultPCSPath + patharr[i].to;
        }
        currentPcs.copy(patharr,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.getListByCategory = function(mediaType,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.streamWithSpecificMediaType({"type":mediaType},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.createFileLink = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.createFileLink(defaultPCSPath + path,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.deleteFileLink = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.deleteFileLink(defaultPCSPath + path,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.cloudMatch = function(localpath,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cloudMatch({"localPath": localpath, "serverPath": serverpath},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.cloudMatchAndUploadFile = function(localpath,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cloudMatchAndUploadFile({"localPath": localpath, "serverPath": serverpath},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          },
          function (status) {
             options.onprogress(status);
          }
        );
    };
    
    it.listRecycle = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.listRecycle({},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //["1874002074"] 
    it.restore = function(filesukarr,options){
        if (!currentPcs || !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.restoreRecycle(filesukarr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.cleanRecycle = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cleanRecycle(
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.downloadFile = function(serverpath,localpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var func;
        var params = {"source":serverpath, "target":localpath};
        if (Array.isArray(serverpath)){
            func = currentPcs.batchDownloadFiles;
            delete params.source;
            params.sourceList = serverpath;
        }else if (options.codecType){
            func = currentPcs.downloadFileAsSpecificCodecType;
            params.type = options.codecType;
        }else if (options.asStream){
            func = currentPcs.downloadFileFromStream;
        }else{
            func = currentPcs.downloadFile;
        }
        func(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          },
          function(status) {
             options.onprogress(status);
          }
        );
    };
    
    it.cloudDownload = function(url,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var params = {"sourceUrl":url, "serverPath":serverpath, "rateLimit":options.rateLimit?options.rateLimit:0, "timeOut":options.timeout?options.timeout:0};
        currentPcs.cloudDownload(params,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.cloudDownloadTaskList = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        //TODO params
        options.asc = (options.order === 'desc')?0:1;
        
        var params = {"start":options.start?options.start:0, "limit":options.limit?options.limit:0, "asc":options.asc,"status":options.status?options.status:-1, "needTaskInfo":options.needTaskInfo?options.needTaskInfo:true};
        currentPcs.cloudDownloadTaskList(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.queryCloudDownloadTaskStatus = function(filesukarr,options){
        if (!currentPcs || !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.queryCloudDownloadTaskStatus(filesukarr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.queryCloudDownloadTaskProgress = function(filesukarr,options){
        if (!currentPcs || !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.queryCloudDownloadTaskProgress(filesukarr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.cancelCloudDownload = function(serverpath,options){
        if (!currentPcs|| !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cancelCloudDownload(serverpath,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.diff = function(cursor,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.diff(cursor,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    return module;
    
});define("mbaas",function(module) {
    var lightapp = this;
    var it = module.mediaplayer = {};
    
    /**
     * @object player
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.mediaplayer
     */
    
    /**
     * 播放
     *
     * @function play
     * @memberof clouda.mbaas.mediaplayer
     * @instance
     *
     * @param {string} link 播放的链接,全路径
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    
    it.play = function(link,options){
        installPlugin("videoplayer", function(plg) {
            var opt = new plg.VideoPlayerOptions(link);
            plg.play(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.CPS_ERROR,error,options);
            },opt);
        });
    };
    
});define("mbaas",function(module) {
    var lightapp = this;
    var it = module.push = {};
    
    var injectScript = function (url,cb){
        var script = document.createElement('script');
        script.setAttribute('src', url);
        document.head.appendChild(script);
        script.onload = function(){
            if(cb){cb(script);}
        };
    };
    
    /**
     * @object push
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.push
     */
    
    var bind = new delegateClass("device","push","bind");
    var unbind = new delegateClass("device","push","unbind");
    var checkBindState = new delegateClass("device","push","checkBindState");
    var setTag = new delegateClass("device","push","setTag");
    var deleteTag = new delegateClass("device","push","deleteTag");
    var listTag = new delegateClass("device","push","listTag");
    var pushMsg = new delegateClass("device","push","pushMsg");
    
    
    /**
     * 注册
     *
     * @function register
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.register = function(options){
        bind(function(data){
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (data.uid){
                options.onsuccess(data);
            }else{
                lightapp.error(ErrCode.PUSH_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_GET_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    /**
     * 取消注册
     *
     * @function unregister
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregister = function(options){
        unbind(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    /**
     * checkStatus
     *
     * @function check
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.checkStatus = function(options){
        checkBindState(function(bool){
            options.onsuccess(bool);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    it.setTag = function(tags,options){
        setTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },tags,options);
    };
    it.removeTag = function(tags,options){
        deleteTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },tags,options);
    };
    it.listTag = function(options){
        listTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },options);
    };
    
     /**
     * pushMsg
     *
     * @function pushMsg
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.title] 
     * @param {string} [options.description] 
     * @param {string} [options.uid] 
     * @param {string} [options.channelId] 
     * @returns null
     * 
     */
    
    it.pushMsg = function(options){
        pushMsg(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },options.uid,options.channelId,{title:options.title,description:options.description});
       
    };
    
    
    //new push service
    
    /**
     * getPushVersion
     *
     * @function register
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     */
    
    /*
    it.getPushVersion = function (options){
        
        //jsonp callback
        window.getPushServiceVersion = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/getPushServiceVersion?callback=getPushServiceVersion", function(script){
            document.head.removeChild(script);
        });
        
    };
	*/
    
    
    /**
     * register unicast
     *
     * @function registerUnicast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.registerUnicast = function (options){
        
		//优先调用框的getPushToken接口
		if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ){
			BLightApp.getPushToken("(function(result){("+options.onsuccess.toString()+")(result);})", "("+options.onfail.toString()+")");
			return false;
		} else {
			//jsonp callback
			window.cloudaPushServiceRegisterUnicast = function(data){
				if(!data.error){
					options.onsuccess(data);
				} else {
					options.onfail(data);
				}
			};
			
			injectScript("http://127.0.0.1:7777/bindLight?apikey=" + clouda.lightapp.ak + "&callback=cloudaPushServiceRegisterUnicast", function(script){
				document.head.removeChild(script);
			});
		}
        
    };
    
    /**
     * unregister unicast
     *
     * @function unregisterUnicast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregisterUnicast = function (options){
        
		//jsonp callback
		window.cloudaPushServiceUnregisterUnicast = function(data){
			if(!data.error){
				options.onsuccess(data);
			} else {
				options.onfail(data);
			}
		};
		
		injectScript("http://127.0.0.1:7777/unbindLight?apikey=" + clouda.lightapp.ak + "&callback=cloudaPushServiceUnregisterUnicast", function(script){
			document.head.removeChild(script);
		});
        
    };
    
    /**
     * register multicast
     *
     * @function registerMulticast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {string} [options.tag]  订阅的服务所用的tag名称
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.registerMulticast = function (options){
        
        //jsonp callback
        window.cloudaPushServiceRegisteMulticast = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/subscribeService?apikey=" + clouda.lightapp.ak + "&tag=" + options.tag + "&callback=cloudaPushServiceRegisteMulticast", function(script){
            document.head.removeChild(script);
        });
        
    };
    
    /**
     * unregister multicast
     *
     * @function unregisterMulticast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {string} [options.tag]  订阅的服务所用的tag名称
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregisterMulticast = function (options){
        
        //jsonp callback
        window.cloudaPushServiceUnregisterMulticast = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/unsubscribeService?apikey=" + clouda.lightapp.ak + "&tag=" + options.tag + "&callback=cloudaPushServiceUnregisterMulticast", function(script){
            document.head.removeChild(script);
        });
        
    };
    
});define("mbaas",function(module) {
    var lightapp = this;
    var vtt = module.vtt = {};
    var tts = module.tts = {};
    
    /**
     * @object vtt
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.vtt clouda.mbaas.vtt
     */
    
    
    // var voiceRecognition = new delegateClass("voice","voiceRecognition");
    var say = new delegateClass("voice","tts","say");
    var showDialog = new delegateClass("voice","vtt","showDialog");
    
    // module.VTT_STATUS={};
    // module.VTT_STATUS.START_RECORDING = 0;
    // module.VTT_STATUS.NONE = 1;
    // module.VTT_STATUS.SPEECH_START = 2;
    // module.VTT_STATUS.SPEECH_END = 4;
    // module.VTT_STATUS.FINISH = 5;
    // module.VTT_STATUS.PLAY_BEGINE_TONE_START = 6;
    // module.VTT_STATUS.PLAY_BEGINE_TONE_END = 7;
    // module.VTT_STATUS.PLAY_END_TONE_START = 8;
    // module.VTT_STATUS.PLAY_END_TONE_END = 9;
    // module.VTT_STATUS.UPDATE_RESULTS = 10;
    // module.VTT_STATUS.AUDIO_DATA = 11;
    // module.VTT_STATUS.USER_CANCELED = 61440;
    // module.VTT_STATUS.ERROR = 65535;
    module.VTT_SPEECHMODE = {
        SEARCH:0,
        INPUT:1
    };
    module.VTT_RATE = {
        K8:8000,
        K16:16000
    };
    var mykey = {};
    
    
    vtt.init = function(ak,sk,pid){
        mykey.ak = ak;
        mykey.sk = sk;
        mykey.pid = '' + pid ;
    };
    
    /**
     * 启动识别
     *
     * @function showDialog
     * @memberof clouda.mbaas.vtt
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {int} [options.speechMode] 
     * @param {int} [options.dialogTheme] 
     * @param {function} [options.onfail] 
     * @returns null
     * 
     */
    
    vtt.showDialog = function(options){
        if (!mykey.ak){
            lightapp.error(ErrCode.vtt_ERR,'api need init first',options);
            return false;
        }
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             if (!options.uuid){
                 options.uuid = 'uuid-uuid';
             }
             if (options.speechMode !== module.VTT_SPEECHMODE.SEARCH){
                 options.speechMode = module.VTT_SPEECHMODE.INPUT;
             }
             options.speechMode = options.speechMode+'';
             if (!options.filename){
                 options.filename = '2000000.wav';
             }
            BLightApp.launchSeniorVoiceRecognition(JSON.stringify({
                config : {
                    pid : mykey.pid,
                    uuid : options.uuid,
                    enablePower: 'true',
                    key: mykey.ak,
                    secKey: mykey.sk,
                    speechMode: options.speechMode,
                    filename: options.filename
                }
            }),"("+options.onsuccess.toString()+")",
                            "("+options.onfail.toString()+")");
             return false;
        }
        if (options.speechMode !== module.VTT_SPEECHMODE.SEARCH){
             options.speechMode = module.VTT_SPEECHMODE.INPUT;
        }
        if (!options.dialogTheme){
            options.dialogTheme = 1;
        }
        options.ak = mykey.ak;
        options.sk = mykey.sk;
        options.pid = mykey.pid;
        //var json = {"speechMode":0, "dialogTheme":2};
        showDialog(options.onsuccess, options.onfail, options);
    };
   
    // /**
     // * 启动识别
     // *
     // * @function startCapture
     // * @memberof clouda.mbaas.vtt
     // * @instance
     // *
     // * @param {{}} options 由onsuccess 和 onfail组成
     // * @param {function} options.onsuccess 成功的回调
     // * @param {function} [options.onfail] 失败的回调
     // * @param {boolen} [options.voicePower] 
     // * @param {int} [options.speechMode] 
     // * @param {function} [options.onfail] 
     // * @returns null
     // * 
     // */
     // vtt.startCapture = function(options){
         // installPlugin("voice",function(plg){
             // var voiceRecognition = plg.vtt;
             // if (options.voicePower){
                 // voiceRecognition.enableVoicePower(function(){}, function(){}, options.voicePower);
            // }
            // if (options.speechMode){
                 // voiceRecognition.setSpeechMode(function(){}, function(){}, options.speechMode);
            // }
            // voiceRecognition.startVoiceRecognition(function(string){//success callback
                    // // options.onsuccess.apply(this,arguments);
                    // voiceRecognition.setStatusChangeListener(
                      // function(result) {
                        // if (result.status === module.VTT_STATUS.FINISH ){
                            // options.onsuccess.apply(this,arguments);
                        // }else if (result.status === module.VTT_STATUS.USER_CANCELED) {
                            // options.onfail.call(this,clouda.STATUS.USER_CANCELED);
                        // }else if (result.status === module.VTT_STATUS.ERROR) {
                            // options.onfail.call(this,result.status);
                        // }
                      // },
                      // function(error) {
                        // lightapp.error(ErrCode.vtt_ERR,error.code,options);
                      // }
                    // );
//                 
            // },function(nativeErr){
                // lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
            // },options);
         // });
//         
     // };
//      
     // vtt.speakFinish = function(options){
         // installPlugin("voice",function(plg){
            // var voiceRecognition = plg.vtt;
            // voiceRecognition.speakFinish(function(string){//success callback
                // options.onsuccess(clouda.STATUS.SUCCESS);
            // },function(nativeErr){
                // lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
            // },options);
       // });
     // };
//      
     // vtt.terminateCapture = function(options){
         // installPlugin("voice",function(plg){
            // var voiceRecognition = plg.vtt;
            // voiceRecognition.stopVoiceRecognition(function(string){//success callback
                // options.onsuccess(clouda.STATUS.SUCCESS);
            // },function(nativeErr){
                // lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
            // },options);
        // });
     // };
     
     /**
     * @object tts
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.vtt clouda.mbaas.tts
     */
    tts.TYPE_DICT_US =  'dict_en';
    tts.TYPE_DICT_UK =  'dict_uk';
    tts.TYPE_DICT_ZH =  'trans_zh';
 
   /**
     * 语音外放
     *
     * @function say
     * @memberof clouda.mbaas.tts
     * @instance
     *
     * @param {string} say word
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.type] 类型
     * @returns null
     * 
     */
     tts.say = function(word,options){
         //say: function(successCallback, errorCallback, text, type) {
        say(function(string){//success callback
            if (typeof string=='string'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.vtt_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
        },word,options.type);
     };
});

   // return clouda;
})(window);