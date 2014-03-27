define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.account = {};
    
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
     * @param {string} [options.scope] 百度登录的scope
     * @returns null
     * 
     */
     it.login = function(options){
		
		if (!options.onsuccess || !options.onfail || !options.redirect_uri){
			lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
			return false;
		}
		
		if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG && BLightApp && typeof BLightApp.login === 'function') {
			
			var opt = {
				client_id : clouda.lightapp.ak,
				redirect_uri : options.redirect_uri,
				scope : options.scope || "basic",
				login_mode : options.login_mode || 0,
				login_type : options.login_type || void 0,
				mobile : options.mobile || void 0
			};
			
			BLightApp.login(JSON.stringify(opt), "("+options.onsuccess.toString()+")", "("+options.onfail.toString()+")");
			
		} else if ( clouda.RUNTIME === clouda.RUNTIMES.NUWA ){
			
			if (!options.mediaType){
				login(options.onsuccess,function(nativeErr){
					if (typeof nativeErr === 'object' && nativeErr.error_code === 1){
						options.onfail(clouda.STATUS.USER_CANCELED);
					}else{
						lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
					}
				},options.scope?options.scope:"basic",options);
			}else{
				sslogin(options.onsuccess,function(nativeErr){
					lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
				},options);
			}
	
		} else {
			var redirect_url = "https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=" + clouda.lightapp.ak + "&redirect_uri=" + encodeURIComponent(options.redirect_uri);
			location.href = redirect_url;
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
    it.getStatus = function(options){
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
    it.getUserInfo = function(options){
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
    // return module;
    
});