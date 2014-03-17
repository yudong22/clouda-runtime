define("mbaas", function(module) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.app = {};

    /**
     * addShortcut
     *
     * @function addShortcut
     * @memberof clouda.mbaas.app
     * @instance
     *
     * @param appid string 轻应用的id
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     *
     */
    it.addShortcut = function(appid, options) {
        if (!appid){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return ;
        }
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
            //Bdbox.invokeApp("BLightApp","createShortCut",[successCallback,errorCallback]);    
             Bdbox.invokeApp("BLightApp","createShortCut",[
                "(function(result){("+options.onsuccess.toString()+")(result);})",
                "("+options.onfail.toString()+")"]);   
             return false;
        }
        installPlugin("device", function(device) {
            var info = {
                type : nuwa.am.SHORTCUT_INFO.TYPE.APP,
                appId : appid
            };
            nuwa.am.addShortcut(info, options.onsuccess, function(err){
                lightapp.error(ErrCode.APP_ERROR, err, options);
            });
        });

    };
    
    /**
     * followSite
     *
     * @function followSite
     * @memberof clouda.mbaas.app
     * @instance
     *
     * @param appid string 轻应用的id
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     *
     */
    it.followSite = function(appid,options){
        if (!appid){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return ;
        }
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             Bdbox.invokeApp("BLightApp","followSite",[
                "(function(result){("+options.onsuccess.toString()+")(result);})",
                "("+options.onfail.toString()+")"]);   
             return false;
        }
        // Bdbox.invokeApp("BLightApp","followSite",[successCallback,errorCallback]);
        installPlugin("device", function(device) {
            nuwa.am.subscribe(appid, options.onsuccess, function(err){
                lightapp.error(ErrCode.APP_ERROR, err, options);
            });
        });
        
    };

}); 