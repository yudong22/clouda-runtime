
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
		
		var opt = {
			client_id : clouda.lightapp.ak,
			redirect_uri : options.redirect_uri,
			scope : options.scope || "basic",
			login_mode : options.login_mode || 0,
			login_type : options.login_type || void 0,
			mobile : options.mobile || void 0,
			display : "mobile",
			response_type : "code",
			state : options.state || void 0
		};
		
		if(opt.login_mode === 1) {
			opt.confirm_login = 1;
		}
		
		if(opt.login_mode === 2) {
			opt.force_login = 1;
		}
		
		if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG && BLightApp && typeof BLightApp.login === 'function') {
			
			BLightApp.login(JSON.stringify(opt), "("+options.onsuccess.toString()+")", "("+options.onfail.toString()+")");
			
		} else {
			
            var redirect_url = "https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=" + clouda.lightapp.ak + "&redirect_uri=" + encodeURIComponent(options.redirect_uri);
			
			if(opt.login_mode) { redirect_url += ("&login_mode=" + opt.login_mode); }
			if(opt.login_type) { redirect_url += ("&login_type=" + opt.login_type); }
			if(opt.client_id) { redirect_url += ("&client_id=" + opt.client_id); }
			if(opt.scope) { redirect_url += ("&scope=" + opt.scope); }
			if(opt.state) { redirect_url += ("&state=" + opt.state); }
			if(opt.display) { redirect_url += ("&display=" + opt.display); }
			if(opt.force_login) { redirect_url += ("&force_login=" + opt.force_login); }
			if(opt.confirm_login) { redirect_url += ("&confirm_login=" + opt.confirm_login); }
			if(opt.mobile) { redirect_url += ("&mobile=" + opt.mobile); }
            redirect_url += ("&return_callback=window.parent.clouda.mbaas.account.closeLoginDialog");

            var iframePage = document.createElement("iframe");
            iframePage.src = redirect_url;
            iframePage.style.position = "absolute";
            iframePage.style.width = window.innerWidth + "px";
            iframePage.style.height = window.innerHeight + "px";
            iframePage.style.top = "0px";
            iframePage.scrolling = "no";
			iframePage.style.border = "none";
            iframePage.style.backgroundColor = "#fff";
            document.body.appendChild(iframePage);
            it.closeLoginDialog = function(){
                if(iframePage) { document.body.removeChild(iframePage);}
            };

		}
         
    };
});