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
            options.onsuccess;
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
    it.listen = function(options){
        start_id = watchAcceleration(function(obj){
            options.onsuccess;
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
     * 终止获取回调
     *
     * @function stop
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stop = function() {
        clearWatch(start_id);
    };
    return it;
});