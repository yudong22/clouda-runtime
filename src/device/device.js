define("device",function(module) {
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
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
            if (window.screen){
                options.onsuccess(window.screen);
            }else{
                lightapp.error(ErrCode.DEVICE_ERR,ErrCode.DEVICE_ERR,options);
            }
            return ;
             // BLightApp.getDeviceInfo(
                 // "(function(result){("+options.onsuccess.toString()+")(window.screen);})",
                            // "("+options.onfail.toString()+")");
             // return false;
        }
        getScreenSize(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.DEVICE_ERR,nativeErr,options);
        },options);
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
});