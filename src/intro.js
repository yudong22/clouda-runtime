(function(window){
    // for client js only
    if (typeof window !== 'object')return ;
    
    if (typeof window.clouda === 'undefined') {
        window.clouda = {};
    }
    var clouda = window.clouda;
    
    clouda.lightapp = function(ak){
        clouda.lightapp.ak = ak;
    };
    clouda.STATUS = {
        SUCCESS:1,
        SYSTEM_FAILURE:-3,
        USER_CANCELED:-2
    };
    clouda.RUNTIMES = {
        WEB:0,
        KUANG:1,
        NUWA:2
    };
    (function(){
        if( typeof BLightApp !== 'undefined' ){
            clouda.RUNTIME = clouda.RUNTIMES.KUANG;
        }else if(typeof nuwa !=='undefined'){
            clouda.STATUS.SUCCESS = 0;//在 runtimeready 后会执为1
            clouda.RUNTIME = clouda.RUNTIMES.NUWA;
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
        PCS_ERROR:25
        
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
            console.error(word + (apperrno?" app错误号"+apperrno:"")+ stackStr[2].replace(/\s*/,""));
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
        if (Array.isArray( regPlugins[pluginName])){
            return regPlugins[pluginName].push(callback);
        }else if (typeof regPlugins[pluginName] != 'undefined' && regPlugins[pluginName]){
            return callback(regPlugins[pluginName]);//此处是同步的逻辑
        }
        //在结果返回前，使用代理模式
        try{
            nuwa.pm.bindAk(clouda.lightapp.ak);
            regPlugins[pluginName] = [];//等待下载
            regPlugins[pluginName].push(callback);
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
                    // regPlugins[pluginName]
                    for(var i=0,len=regPlugins[pluginName].length;i<len;i++){
                        regPlugins[pluginName][i](plg);
                    }
                    regPlugins[pluginName] = plg;
                });
            });
            
        }catch(e){
            try{
                callback(null);
            }catch(e){
                if (typeof options === 'object' ){//检查 onfail
                    if (typeof options.onfail === 'function'){
                        options.onfail(clouda.STATUS.SYSTEM_FAILURE);
                    }
                }
                console.error(e.stack);
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
