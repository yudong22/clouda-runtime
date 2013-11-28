/*! clouda-runtime - v0.1.0 - 2013-11-28 */
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
    clouda.lightapp.error = function(){
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.log("Call lightapp api Error! " + stackStr[2].replace(/\s*/,""));
        }
    };
    //定义错误格式
    // clouda.__noSuchMethod__ = function(){
        // alert('no such method');
        // console.log(arguments);
    // };
    //__defineGetter__
    var delegateClass = function(module,submodule,func){
        this.module = module;
        this.submodule = submodule;
        this.func = func;
        return (function(that){
            return function(){
                that.run.apply(that, arguments);
            };
        })(this);
    };
    delegateClass.prototype.run = function(){
        var args = arguments;
        var _this = this;
        execDelegate(this.module,function(module){
            try{
                module[_this.submodule][_this.func].apply(_this,args);
            }catch(e){
                _this.error(_this.module+"."+_this.submodule+"."+_this.func);
            }
            
        });
    };
    delegateClass.prototype.error = function(err){
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.log(err ," Error! " + stackStr[2].replace(/\s*/,""));
        }
    };
    
    var regPlugins = {};
    var execDelegate = function(pluginName,callback){
        if (!clouda.lightapp.ak) {
            console.error("错误，'"+pluginName+"' clouda.lightapp(your_ak_here);");
            return false;
        }
        
        if (!pluginName) {
            return false;
        }
        //判断1.是否为undefined
        //判断2.是否为null，
        if (typeof regPlugins[pluginName] != 'undefined'){
            return callback(regPlugins[pluginName]);//此处是同步的逻辑
        }
        //在结果返回前，使用代理模式
        regPlugins[pluginName] = null;
        
        //此处使用require
        nuwa.pm.bindAk(clouda.lightapp.ak);
        
        nuwa.pm.absorb(pluginName,function(inst){
            inst.on('error',function(err){
                callback(null);
            });
            inst.on('progress',function(err){
                
            });
            inst.on('complete',function(err){
                regPlugins[pluginName] = nuwa.require(pluginName);
                callback(regPlugins[pluginName]);
            });
        });
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
    var define= function(name,bindFunction){
        var module = clouda[name];
        //执行空间在clouda.lightapp下，防止污染其他空间
        bindFunction.call(clouda.lightapp,module);
        // bindFunction.call(undefined,module);
    };
    clouda.device = {};
    clouda.mbaas = {};
    // clouda.ui={};
define("device",function(module) {
    var lightapp = this;
    //定义 accelerometer 空间，clouda.device.accelerometer 
    var it = module.accelerometer = {};
    
    //需要device的accelerometer模块
    var boot = ['clearWatch','getCurrentAcceleration','watchAcceleration'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = new delegateClass("device","accelerometer",boot[i]);
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.battery = {};
    
    //需要device的battery模块
    var boot = ['start','stop'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = new delegateClass("device","batteryStatus",boot[i]);//FIXME take a look at this function
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.camera 支持退化
    var it = module.camera = {};
    
    //需要device的camera模块
    var boot = ['getPicture','cleanup'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","camera",boot[i]);
    }
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 capture 空间，clouda.device.capture 
    var it = module.capture = {};
    
    //需要device的capture模块
    var boot = ['captureAudio','captureImage','captureVideo'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","capture",boot[i]);
    }
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 contact 空间，clouda.device.contact 支持退化
    var it = module.contact = {};
    
    //需要device的contact模块
    var boot = ['create','find'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","contact",boot[i]);
    }
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 geolocation 空间，clouda.device.geolocation 支持退化
    var it = module.geolocation = {};
    
    //需要device的geolocation模块
    var boot = ['clearWatch','getCurrentPosition','watchPosition'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","geolocation",boot[i]);
    }
    //TODO deviceOrientation 合并于此
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 globalization 空间，clouda.device.globalization 
    var it = module.globalization = {};
    
    //需要device的globalization模块
    var boot = ['dateToString','getCurrencyPattern','getDateNames','getDatePattern','getFirstDayOfWeek',
    'getLocaleName','getNumberPattern','getPreferredLanguage','isDayLightSavingsTime','numberToString',
    'stringToDate','stringToNumber'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","globalization",boot[i]);
    }
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.network 支持退化
    var it = module.network = {};
    
    //需要device的network模块
    var boot = ['getInfo'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","network",boot[i]);
    }
    //初始化格式化数据,clouda.device.network.UNKNOWN
    it.UNKNOWN=0;
    it.ETHERNET=1;
    it.WIFI=2;
    it.CELL_2G=3;
    it.CELL_3G=4;
    it.CELL_4G=5;
    it.CELL=6;
    it.NONE=7;
    //clouda.device.network.UNKNOWN
    it.status = it.UNKNOWN;
    //TODO 应该提供监听方法
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 notification 空间，clouda.device.notification 支持退化
    var it = module.notification = {};
    
    //需要device的notification模块
    var boot = ['alert','confirm','prompt','beep','vibrate'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","notification",boot[i]);
    }
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 sqlite 空间，clouda.device.sqlite 
    var it = module.sqlite = {};
    
    //需要device的sqlite模块
    var boot = ['openDatabase'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","sqlite",boot[i]);
    }
    
    return module;
});define("mbaas",function( module ) {
    
    //deal with clouda.mbaas
    module.share = {};
    
    return module;
    
});
   // return clouda;
})(window);