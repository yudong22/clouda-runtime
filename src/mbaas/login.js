define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.login = {};
    
    var login = new delegateClass("device","login","login");
    var logout = new delegateClass("device","login","logout");
    
    var sslogin = new delegateClass("authorization","login");
    var loginout = new delegateClass("authorization","loginout");
    var getuserinfo = new delegateClass("authorization","getuserinfo");
    var getstatus = new delegateClass("authorization","getstatus");
    var isLogin = new delegateClass("device","login","isLogin");
    var getAccountInfo = new delegateClass("device","login","getAccountInfo");
    
    
    module.LOGIN_TYPE={
        WEIBO : 'sinaweibo',
        QQ:'qqdenglu',
        KAIXIN:'kaixin',
        QQWEIBO:'qqweibo',
        RENREN:'renren'
    };
    
    /**
     * login
     *
     * @function login
     * @memberof clouda.mbaas.login
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.mediaType] 默认是百度登录
     * @param {string} [options.scope] 百度登录的scrope
     * @returns null
     * 
     */
     it.login = function(options){
         if (!options.mediaType){
             login(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options.scope?options.scope:"basic",options);
         }else{
             sslogin(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options);
         }
        
     };
    
    /**
     * logout
     *
     * @function logout
     * @memberof clouda.mbaas.login
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.mediaType] 默认是百度登陆
     * @returns null
     * 
     */
    it.logout = function(options){
        if (!options.mediaType){
             logout(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
            },options);
         }else{
             loginout(function(){
                 options.onsuccess(clouda.STATUS.SUCCESS);
             },function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options);
         }
        
    };
    it.getstatus = function(options){
        if (!options.mediaType){
             isLogin(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
            },options);
         }else{
             getstatus(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options);
         }
    };
    it.getuserinfo = function(options){
        if (!options.mediaType){
             getAccountInfo(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
            },options);
         }else{
             getuserinfo(options.onsuccess,function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
             },options);
         }
    };
    return module;
    
});