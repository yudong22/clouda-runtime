define("device",function(module) {
    var lightapp = this;
    //定义 geolocation 空间，clouda.device.geolocation 支持退化
    var it = module.geolocation = {};
    
    /**
     * @object geolocation
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.geolocation
     */
    
    module.LOCATION_METHOD = {
        BASE_STATION:0,
        GPS:1
    };
    
    var mapstart = new delegateClass("map","start");
    var mapstop = new delegateClass("map","stop");
    var maplocation = new delegateClass("map","locationRequest");
    
    var watchPosition = new delegateClass("device","geolocation","watchPosition");
    var clearWatch = new delegateClass("device","geolocation","clearWatch");
    
    /**
     * 获取当前地理位置，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @param {int} [options.maximumAge] 
     * @param {int} [options.timeout] 
     * @returns null
     * 
     */
    it.get = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             BLightApp.getCurrentPosition("(function(result){("+options.onsuccess.toString()+")(result.coords);})",
                            "("+options.onfail.toString()+")");
             return false;
         }
        // if (options.method === module.LOCATION_METHOD.BASE_STATION ){
             // options.enableHighAccuracy = false;
         // }else{
             // options.enableHighAccuracy = true;
         // }
        mapstart(function(obj){
            if ( typeof obj==='object' ){
                options.onsuccess(obj);
            }else{
                lightapp.error(ErrCode.LOC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            mapstop(function(){},function(){});
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前加速度，接收成功，失败的回调和间隔
     *
     * @function startListen
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @param {int} [options.maximumAge] 
     * @param {int} [options.timeout] 
     * 
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             Bdbox.invokeApp("BLightApp","startListenLocation",["(function(result){("+options.onsuccess.toString()+")(result.coords);})",
                            "("+options.onfail.toString()+")"]);   
             return false;
         }
         
        mapstart(function(obj){
            if ( typeof obj==='object' ){
                options.onsuccess(obj);
            }else{
                lightapp.error(ErrCode.LOC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },options);
     
    };
    
    /**
     * 终止获取回调
     *
     * @function stopListen
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function(){
        
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            var funcs = [];
            if (options.onsuccess){
                funcs.push("("+ options.onsuccess.toString() + ")");
                
                if (options.onfail){
                    funcs.push("("+ options.onfail.toString() + ")");
                }
            }
            
            Bdbox.invokeApp("BLightApp","stopListenLocation",funcs);
            return;
        }
        
        mapstop(function(obj){
                options.onsuccess(obj);
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },options);
    };
    
    return module;
});