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

}); 