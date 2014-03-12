define("device",function(module) {
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
});