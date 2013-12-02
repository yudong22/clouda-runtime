define("device",function(module) {
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
     
    return module;
});