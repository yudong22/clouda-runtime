define("mbaas",function(module) {
    var lightapp = this;
    var it = module.push = {};
    
    /**
     * @object push
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.push
     */
    
    var bind = new delegateClass("device","push","bind");
    var unbind = new delegateClass("device","push","unbind");
    
    
    var checkBindState = new delegateClass("device","push","checkBindState");
    
    
    
    /**
     * 注册
     *
     * @function registerForRemoteNotification
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.registerForRemoteNotification = function(options){
        bind(function(data){
            data = JSON.parse(data);
            if (data.uid){
                options.onsuccess(data);
            }else{
                lightapp.error(ErrCode.PUSH_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_GET_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    /**
     * 取消注册
     *
     * @function unregisterForRemoteNotification
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregisterForRemoteNotification = function(options){
        unbind(function(){
            options.onsuccess();
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    /**
     * checkStatus
     *
     * @function check
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.checkStatus = function(options){
        checkStatus(function(bool){
            options.onsuccess(bool);
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
     /**
     * onReceive
     *
     * @function onreceive
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.onreceive = function(options){
        lightapp.error(ErrCode.NOT_FINISH,nativeErr,options);
    };
});