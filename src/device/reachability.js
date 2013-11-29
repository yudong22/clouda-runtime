define("device",function(module) {
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
});