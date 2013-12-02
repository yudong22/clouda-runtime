define("mbaas",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.qr = {};
    
    /**
     * @object qr
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.qr
     */
    
    var start = new delegateClass("qr","start");
    var stop = new delegateClass("qr","stop");
    var generate = new delegateClass("qr","generate");
    
    var start_id;
    /**
     * 生成
     *
     * @function genterate
     * @memberof clouda.mbaas.qr
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    
    return it;
});