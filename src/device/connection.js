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
     * @function startListen
     * @memberof clouda.device.connection
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
     // it.startListen = function(options){
//         
     // };
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
    it.startListen = function(options){
        getInfo(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.REACH_ERR);
            }else{
                lightapp.error(ErrCode.REACH_ERR);
            }
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
        lightapp.error(ErrCode.NOT_FINISH,nativeErr,options);
    };
    return module;
});