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
    
    var getUuid = new delegateClass("device","getUuid");
    
   
    /**
     * 获取uuid
     *
     * @function startListen
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
             BLightApp.getDeviceInfo("("+options.onsuccess.toString()+")",
                            "("+options.onfail.toString()+")");
             return false;
        }
        getUuid(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    
    return it;
});