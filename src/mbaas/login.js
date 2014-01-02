define("mbaas",function( module ) {
    
    //deal with clouda.mbaas
    var it = module.login = {};
    
    var login = new delegateClass("device","login","login");
    var logout = new delegateClass("device","login","logout");
    
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
     * @returns null
     * 
     */
     it.login = function(options){
        login(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
        },word,options.type);
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
     * @returns null
     * 
     */
    it.logout = function(options){
        logout(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
        },word,options.type);
    };
     
    return module;
    
});