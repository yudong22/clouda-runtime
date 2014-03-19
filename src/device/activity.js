define("device",function(module) {
    var lightapp = this;
    //定义 activity 空间，clouda.device.activity 
     /**
     * @object activity
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.activity
     */
    var it = module.activity = {};
    
    var startActivity = new delegateClass("device","activity","startActivity");
    
    //device.activity.startActivity(successCallback, errorCallback, intent);
    
    /**
     * 调起第三方app
     *
     * @function get
     * @memberof clouda.device.activity
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} options.onsuccess 成功的回调
     * @param {object} options.intent 参考android调起应用参数intent
     * @returns null
     * 
     */
    it.start = function(options){
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";
             BLightApp.invokeThirdApp(JSON.stringify(options.intent),
                cloudasuccess,
                "("+options.onfail.toString()+")");   
             return false;
        }
        
        startActivity(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.ACC_GET_ERR,nativeErr,options);
        },options.intent,options);
    };
    
    
});
