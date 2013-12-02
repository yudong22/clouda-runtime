define("device",function(module) {
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
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.listen = function(){
        start_id = start(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.ACC_GET_ERR);
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
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stop = function(){
        stop(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.ACC_GET_ERR);
            }
            
        },options);
    };
    
    return it;
});