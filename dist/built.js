/*! clouda-runtime - v0.1.0 - 2013-12-02 */
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
    //定义错误格式
    var ErrCode = {
        /*SUCCESS*/
        SUCCESS:0,
        
        //不符合预期
        UNKNOW_CALLBACK:-1,
        //用户取消
        USER_CANCEL:-2,
        
        //RUNTIME ERROR
        AK_UNDEFINED:-4,
        RT_UNDEFINED:-3,
        RT_GETERROR:5,
       
        
        
        EXEC_ERROR:-5,
        
        //API ERROR
        ACC_GET_ERR:6,
        LOC_GET_ERR:7,
        CAP_GET_ERR:8,
        CONTACT_FIND_ERR:9,
        GLO_ERR:10,
        REACH_ERR:11,
        MEDIA_ERR:12,
        
        
    };
    var errorMessage = {
      0:"成功",
      "-1":"接口返回不符合预期",
      "-2":"用户取消",
      "-3":"接口的运行环境不存在。",
      "-4":"错误，您需要在调用api前设置ak。 clouda.lightapp(your_ak_here);",
      "-5":"执行接口出错。",
      5:"接口的运行环境准备中出错。",
      6:"accelerometer 接口返回错误",
      7:"geolocation 接口返回错误",
    };
    
    //第一个是接口层错误号，第二个是app层错误号，第三个是options，如果定义了onFail要触发
    var runtimeError  = function(errno,apperrno,options){
        //整合errno
        if (errno < 0 ){//如果是用户取消或者接口不符标准，直接覆盖传入
            apperrno = errno;
        }
        if (typeof options === 'object' && typeof options.onFail === 'function'){
            options.onFail(apperrno);
        }
        
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.error(errorMessage[errno]+ (apperrno?" app错误号"+apperrno:"")+ stackStr[2].replace(/\s*/,""));
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
        execDelegate.call(this,this.module,function(module){
            try{
                module[_this.submodule][_this.func].apply(_this,args);
            }catch(e){
                if (args.length && typeof args[args.length-1] === 'object' ){//检查 onFail
                    if (typeof args[args.length-1].onFail === 'function'){
                        args[args.length-1].onFail(ErrCode.EXEC_ERROR);
                    }
                }
                if(module){
                    _this.error(ErrCode.EXEC_ERROR);
                }
            }
            
        });
    };
    clouda.lightapp.error = delegateClass.prototype.error = runtimeError;
    
    
    var regPlugins = {};
    var execDelegate = function(pluginName,callback){
        if (!clouda.lightapp.ak) {
            this.error(ErrCode.AK_UNDEFINED);
            console.error("错误，'"+pluginName+"' clouda.lightapp(your_ak_here);");
            return false;
        }
        var _this = this;
        if (!pluginName) {
            return false;
        }
        //判断1.是否为undefined
        //判断2.是否为null，
        if (typeof regPlugins[pluginName] != 'undefined'){
            return callback(regPlugins[pluginName]);//此处是同步的逻辑
        }
        //在结果返回前，使用代理模式
        try{
            nuwa.pm.bindAk(clouda.lightapp.ak);
            
            nuwa.pm.absorb(pluginName,function(inst){
                inst.on('error',function(err){
                    _this.error(ErrCode.RT_GETERROR);
                    callback(null);
                });
                inst.on('progress',function(err){
                    
                });
                inst.on('complete',function(err){
                    regPlugins[pluginName] = nuwa.require(pluginName);
                    callback(regPlugins[pluginName]);
                });
            });
            
        }catch(e){
            _this.error(ErrCode.RT_UNDEFINED);
            callback(null);
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
    var define= function(name,bindFunction){
        var module = clouda[name];
        //执行空间在clouda.lightapp下，防止污染其他空间
        bindFunction.call(clouda.lightapp,module, clouda);
        // bindFunction.call(undefined,module);
    };
    clouda.device = {};
    clouda.mbaas = {};
    // clouda.ui={};
define("device",function(module) {
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
    // var boot = ['clearWatch','getCurrentAcceleration','watchAcceleration'];
    
    var getCurrentAcceleration = new delegateClass("device","accelerometer","getCurrentAcceleration");
    var watchAcceleration = new delegateClass("device","accelerometer","watchAcceleration");
    var clearWatch = new delegateClass("device","accelerometer","clearWatch");
    
    
    /**
     * 获取当前加速度，接收成功和失败的回调
     *
     * @function getCurrentAcceleration
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调
     * @param {function} [options.onFail] 失败的回调
     * @returns null
     * 
     */
    it.getCurrentAcceleration = function(options){
        getCurrentAcceleration(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.ACC_GET_ERR);
            }else{
                lightapp.error(ErrCode.ACC_GET_ERR);
            }
        },options);
    };
    
    /**
     * 已一定的频率，获取当前加速度，接收成功，失败的回调和间隔
     *
     * @function listen
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调 
     * @param {function} [options.onFail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认10000 ms
     * @returns null
     * 
     */
    var start_id;
    it.listen = function(options){
        start_id = watchAcceleration(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.ACC_GET_ERR);
            }else{
                lightapp.error(ErrCode.ACC_GET_ERR);
            }
            
        },options);
    };
    /**
     * 终止获取回调
     *
     * @function stop
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 
     * @param {function} [options.onFail] 失败的回调
     * @returns null
     * 
     */
    it.stop = function() {
        clearWatch(start_id);
    };
    return it;
});define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.battery = {};
    
    /**
     * @object battery
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.battery
     */
    
    var start = new delegateClass("device","batteryStatus","start");
    var stop = new delegateClass("device","batteryStatus","stop");
    
    var start_id;
    /**
     * 已一定的频率获取电池状态
     *
     * @function listen
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调
     * @param {function} [options.onFail] 失败的回调
     * @returns null
     * 
     */
    it.listen = function(){
        start_id = start(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.ACC_GET_ERR);
            }
            
        },options);
    };
    /**
     * 停止获取电池状态
     *
     * @function stop
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调
     * @param {function} [options.onFail] 失败的回调
     * @returns null
     * 
     */
    it.stop = function(){
        stop(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.ACC_GET_ERR);
            }
            
        },options);
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
     * @function getCurrentHeading
     * @memberof clouda.device.compass
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调
     * @param {function} [options.onFail] 失败的回调
     * @returns null
     * 
     */
    it.getCurrentHeading = function(options){
        getCurrentHeading(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.ACC_GET_ERR);
            }else{
                lightapp.error(ErrCode.ACC_GET_ERR);
            }
        },options);
    };
    
    /**
     * 已一定的频率，获取当前指南针坐标，接收成功，失败的回调和间隔
     *
     * @function listen
     * @memberof clouda.device.compass
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调 
     * @param {function} [options.onFail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认100 ms
     * @returns null
     * 
     */
    var start_id;
    it.listen = function(options){
        start_id = watchHeading(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.ACC_GET_ERR);
            }else{
                lightapp.error(ErrCode.ACC_GET_ERR);
            }
            
        },options);
    };
    /**
     * 终止获取回调
     *
     * @function stop
     * @memberof clouda.device.compass
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 
     * @param {function} [options.onFail] 失败的回调
     * @returns null
     * 
     */
    it.stop = function() {
        clearWatch(start_id);
    };
    return it;
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
    
    
    /**
     * Returns an array of Contacts matching the search criteria.
     *
     * @function find
     * @memberof clouda.device.contact
     * @instance
     *
     * @param fields that should be searched
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     * @return null
     */
    it.find = function(fields,options){
        find(fields,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.CONTACT_FIND_ERR);
            }else{
                lightapp.error(ErrCode.CONTACT_FIND_ERR);
            }
        },options);
    };
    
});define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.reachability 使用nuwa.network 
    var it = module.fs = {};
    
    /**
     * @object fs
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.fs
     */
    
    // var getInfo = new delegateClass("device","network","getInfo");
    
    
    //TODO
    /**
     * 上传文件
     *
     * @function postFile
     * @memberof clouda.device.fs
     * @instance
     * @param {string} file_url 之前获得的127.0.0.1的文件URL地址 
     * @param {string} target 要POST到的目标,如http://some.host/foo
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.postFile = function(link,target,options){
        
    };
     /**
     * 应该提供停止监听网络变化的方法
     *
     * @function stop
     * @memberof clouda.device.reachability
     * @instance
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
     
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
    
    var getCurrentPosition = new delegateClass("device","geolocation","getCurrentPosition");
    var watchPosition = new delegateClass("device","geolocation","watchPosition");
    var clearWatch = new delegateClass("device","geolocation","clearWatch");
    
    /**
     * 获取当前地理位置，接收成功和失败的回调
     *
     * @function getCurrentPosition
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调
     * @param {function} [options.onFail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @returns null
     * 
     */
    it.getCurrentPosition = function(options){
        getCurrentPosition(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.LOC_GET_ERR);
            }
        },options);
    };
    
    /**
     * 已一定的频率，获取当前加速度，接收成功，失败的回调和间隔
     *
     * @function listen
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 成功的回调 
     * @param {function} [options.onFail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @returns null
     * 
     */
    var start_id;
    it.listen = function(){
        start_id = watchPosition(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.LOC_GET_ERR);
            }
            
        },options);
    };
    
    /**
     * 终止获取回调
     *
     * @function stop
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onSuccess 和 onFail组成
     * @param {function} options.onSuccess 
     * @param {function} [options.onFail] 失败的回调
     * @returns null
     * 
     */
    it.stop = function(){
        clearWatch(start_id);
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
    
     var boot = ['dateToString','getCurrencyPattern','getDateNames','getDatePattern','getFirstDayOfWeek',
        'getLocaleName','getNumberPattern','getPreferredLanguage','isDayLightSavingsTime','numberToString',
        'stringToDate','stringToNumber'];
     var toolKit={};
     for(var i=0,len=boot.length;i<len;i++){
         toolKit[boot[i]] = new delegateClass("device","globalization",boot[i]);
     }
    
    
    /**
     *
     * @function getPreferredLanguage
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
     it.getPreferredLanguage = function (options) {
        toolKit.getPreferredLanguage(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
     };
    /**
     *
     * @function getLocaleName
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getLocaleName = function (options) {
        toolKit.getLocaleName(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function dateToString
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {Date} date
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.dateToString = function (date, options) {
        toolKit.dateToString(date,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function stringToDate
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {string} dateString
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.stringToDate = function (dateString, options) {
        toolKit.stringToDate(dateString,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getDatePattern
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getDatePattern = function (options) {
        toolKit.getDatePattern(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getDateNames
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getDateNames = function (options) {
        toolKit.getDateNames(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function isDayLightSavingsTime
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {Date} date
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.isDayLightSavingsTime = function (date, options) {
        toolKit.isDayLightSavingsTime(date,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getFirstDayOfWeek
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getFirstDayOfWeek = function (options) {
        toolKit.getFirstDayOfWeek(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function numberToString
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {int} number
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.numberToString = function (number, options) {
        toolKit.numberToString(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function stringToNumber
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {string} numberString
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.stringToNumber = function (numberString, options) {
        toolKit.stringToNumber(numberString,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getNumberPattern
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getNumberPattern = function (options) {
        toolKit.getNumberPattern(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function getCurrencyPattern
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {string} currencyCode
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getCurrencyPattern = function (currencyCode, options) {
        toolKit.getCurrencyPattern(currencyCode,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.media 支持退化
    var it = module.media = {};
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
    module.MEDIA_TYPE.ALLMEDIA = 2; //for function getMedia only
    module.MEDIA_TYPE.AUDIO = 3; //for function captureMedia only
    
    
    module.MEDIA_SOURCE.PHOTOLIBRARY = 0;
    module.MEDIA_SOURCE.CAMERA = 1;
    
    module.MEDIA_DIRECTION.BACK = 0;
    module.MEDIA_DIRECTION.FRONT = 1;
    
    
     
    var getPicture = new delegateClass("device","camera","getPicture");
    // var cleanup = new delegateClass("device","camera","cleanup");
    var captureAudio = new delegateClass("device","capture","captureAudio");
    var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
    
    
    /**
     * 启动canema，支持读取手机图库或者拍照
     *
     * @function getMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options 可定义
     * @param {function} options.onSuccess 成功
     * @param {function} options.onFail 失败
     * @param {number} [options.quality] 
     * @param {number} [options.destinationType]
     * @param {number} [options.sourceType] 
     * @param {number} [options.mediaType]
     * @param {number} [options.mediaDirection]
     * @param {number} [options.encodingType]
     * @param {boolen} [options.saveToPhotoAlbum] 
     * @returns null
     * 
     */
    
    it.getMedia = function(options){
        getPicture(function(imageData){//success callback
            if (imageData && typeof imageData=='string'){
                options.onSuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.MEDIA_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
        },options);
    };
    
    /**
     *
     * Launch audio recorder application for recording audio clip(s).
     *
     * @function captureMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     * @param {int} options.mediaType=clouda.device.MEDIA_TYPE.PICTURE
     * @param {int} [options.limit=1]
     * @param {int} [options.duration=0]
     * @returns null
     * 
     */
    
    it.captureMedia = function(options){
        var func;
        if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO){
            func=captureVideo;
        }else if (options.mediaType == clouda.device.MEDIA_TYPE.AUDIO){
            func=captureAudio;
        }else{//默认 MEDIA_TYPE.PICTURE
            func=captureImage;
        }
        func(function(mediaFile){
            if (mediaFile && typeof mediaFile=='object'){
                options.onSuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.MEDIA_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },options.onSuccess,function(nativeErr){
            lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
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
    
    /**
     * 调用系统 alert 方法，接收一个message参数和一个可选的配置
     *
     * @function alert
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onSuccess] 点击button的callback
     * @param {string} [options.title] 弹出框的title
     * @param {string} [options.buttonName] 弹出框的buttonName
     * @returns null
     * 
     */
    it.alert = function(msg,options){
        if (typeof options === 'object'){
            return alert(msg,options.onSuccess,options.title,options.buttonName,options);
        }
        return alert(msg);
    };
    /**
     * 调用系统 confirm 方法，接收一个message参数和一个可选的配置
     *
     * @function confirm
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onSuccess] 点击确定的callback
     * @param {string} [options.title] 弹出框的title
     * @param {array} [options.buttonLabels] 弹出框的确定和取消按键，默认是['ok','cancel']
     * @returns null
     * 
     */
    it.confirm = function(msg,options){
        if (typeof options === 'object'){
            return confirm.apply(this,msg,options.onSuccess,options.title,options.buttonLabels,options);
        }
        return confirm(msg);
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
    it.beep = beep;
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
    it.vibrate = vibrate;
    
    /**
     * 弹出定制化的dialog，接收一个message参数和一个可选的配置
     *
     * @function prompt
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onSuccess] 点击确定的callback
     * @param {string} [options.title] 标题
     * @param {array} [options.buttonLabels] 确定和取消按键，默认是['ok','cancel']
     * @param {string} [options.defaultText] 输入框默认文字
     * @returns null
     * 
     */
    it.prompt = function(msg,options){
        if (typeof options === 'object'){
            return prompt(msg,options.onSuccess,options.title,options.buttonLabels,options.defaultText,options);
        }
        return prompt(msg);
    };
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.reachability 使用nuwa.network 
    var it = module.reachability = {};
    
    /**
     * @object reachability
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.reachability
     */
    
    it.ConnectionType = {
        UNKNOWN:0,
        ETHERNET:1,
        WIFI:2,
        CELL_2G:3,
        CELL_3G:4,
        CELL_4G:5,
        CELL:6,
        NONE:7
    };
    
    // it.status = it.ConnectionType.UNKNOWN;
    
    var getInfo = new delegateClass("device","network","getInfo");
    
    /**
     * Launch device camera application for recording video(s).
     *
     * @function getStatus
     * @memberof clouda.device.reachability
     * @instance
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
     it.get = function(options){
        getInfo(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.REACH_ERR);
            }else{
                lightapp.error(ErrCode.REACH_ERR);
            }
        },options);
     };
    //TODO 应该提供监听方法
    /**
     * 应该提供监听网络变化的方法
     *
     * @function listen
     * @memberof clouda.device.reachability
     * @instance
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.listen = function(options){
        
    };
     /**
     * 应该提供停止监听网络变化的方法
     *
     * @function stop
     * @memberof clouda.device.reachability
     * @instance
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.stop = function(options){
        
    };
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 sqlite 空间，clouda.device.sqlite 
    var it = module.sqlite = {};
    
    /**
     * @object sqlite 使用sqllit接口未封装
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.sqlite
     */
    
    // var openDatabase = new delegateClass("device","sqlite","openDatabase");
//     
    // it.openDatabase = function(options){
        // openDatabase(options.onSuccess,function(){
            // if (options && typeof options.onFail == 'function'){
                // options.onFail(ErrCode.REACH_ERR);
            // }else{
                // lightapp.error(ErrCode.REACH_ERR);
            // }
        // },options);
     // };
    
    return module;
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
			if(!el.bytouch){return;}
            detail = detail || {};
            var e,
                opt = {
                bubbles: true,
                cancelable: true,
                detail: detail
            };

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
                    e[p] = e.detail[p];
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
                    e[p] = e.detail[p];
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

                        _trigger(el, smrEventList.CLICK, {
                            type: smrEventList.CLICK,
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
						el.bytouch = true;
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
					el.bytouch = true;
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
					el.bytouch = true;
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
						el.bytouch = true;
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
					el.bytouch = true;
                    _delegate(el, evt, sel, handler);
                });
                return;
            }
        };

        var _off = function() {
            var evts;
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

        var _dispatch = function(el, evt) {
            var args = arguments;
            if (!_hasTouch) {
                evt = utils.getPCevts(evt);
            }
            var els = utils.getType(args[0]) === 'string' ? doc.querySelectorAll(args[0]) : args[0];
            els = els.length ? Array.prototype.call(els) : [els];

            els.forEach(function(el) {
                _trigger(el, evt);
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
});define("mbaas",function( module ) {
    
    //deal with clouda.mbaas
    module.share = {};
    
    return module;
    
});
   // return clouda;
})(window);