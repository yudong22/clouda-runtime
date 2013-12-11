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
    
    var setTag = new delegateClass("device","push","setTag");
    var deleteTag = new delegateClass("device","push","deleteTag");
    var listTag = new delegateClass("device","push","listTag");
    
    /**
     * 注册
     *
     * @function register
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.register = function(options){
        bind(function(data){
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
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
     * @function unregister
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregister = function(options){
        unbind(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
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
        checkBindState(function(bool){
            options.onsuccess(bool);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    it.setTag = function(tags,options){
        setTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },tags,options);
    };
    it.removeTag = function(tags,options){
        deleteTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },tags,options);
    };
    it.listTag = function(options){
        listTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },options);
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
        lightapp.error(ErrCode.NOT_FINISH,ErrCode.NOT_FINISH,options);
    };
});