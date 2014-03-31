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
             var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";   
             BLightApp.createShortCut(
                cloudasuccess,
                "("+options.onfail.toString()+")");   
             return false;
        }
        installPlugin("device", function(device) {
            var info = {
                type : nuwa.am.SHORTCUT_INFO.TYPE.APP,
                appId : appid
            };
            nuwa.am.addShortcut(info, function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(err){
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
             var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(clouda.STATUS.SUCCESS);})";
             BLightApp.followSite(
                cloudasuccess,
                "("+options.onfail.toString()+")");   
             return false;
        }
        installPlugin("device", function(device) {
            nuwa.am.subscribe(appid, function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(err){
                lightapp.error(ErrCode.APP_ERROR, err, options);
            });
        });
        
    };
    //status 0 未填加，1已添加，2添加中
    it.checkFollow = function(appid,options){
        if (!appid){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return ;
        }
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
             var cloudasuccess = "(function(result){("+options.onsuccess.toString()+")(result);})";
             BLightApp.queryWzStatus(
                cloudasuccess,
                "("+options.onfail.toString()+")");   
             return false;
        }
        installPlugin("device", function(device) {
            nuwa.am.hasSubscribed(appid, function(result){
                options.onsuccess(result);
            }, function(err){
                lightapp.error(ErrCode.APP_ERROR, err, options);
            });
        });
    };

}); 