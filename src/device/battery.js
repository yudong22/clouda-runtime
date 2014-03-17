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
    
    var start = new delegateClass("device","batterystatus","start");
    var stop = new delegateClass("device","batterystatus","stop");
    
    it.get = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            var successCallback ="("+ options.onsuccess.toString() + ")";
            var errorCallback ="("+  options.onfail.toString() + ")";
            Bdbox.invokeApp("BLightApp","getBattery",[successCallback,errorCallback]);
            return;
        }
        start(function(){
            options.onsuccess.apply(this,arguments);
            stop(function(){},function(){});
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    /**
     * 已一定的频率获取电池状态
     *
     * @function startListen
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.startListen = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            var successCallback = "("+ options.onsuccess.toString() + ")";
            var errorCallback = "("+ options.onfail.toString() + ")";
            Bdbox.invokeApp("BLightApp","startListenBattery",[successCallback,errorCallback]);
            return;
        }
        start(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    /**
     * 停止获取电池状态
     *
     * @function stopListen
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            var funcs = [];
            if (options.onsuccess){
                funcs.push("("+ options.onsuccess.toString() + ")");
            }
            if (options.onfail){
                funcs.push("("+ options.onfail.toString() + ")");
            }
            Bdbox.invokeApp("BLightApp","stopListenBattery",funcs);
            return;
        }
        if (typeof options == 'undefined') {
            stop(function(){},function(){});
        }else{
            stop(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
            },options);
        }
        
    };
    
    return it;
});