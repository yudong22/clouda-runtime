define("device",function(module) {
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
