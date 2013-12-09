define("device",function(module) {
    var lightapp = this;
    var it = module.screen = {};
    
    /**
     * @object screen
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.screen
     */
    
    var takeScreenshot = new delegateClass("device","sharescreenshot","takeScreenshot");
    var sharePicture = new delegateClass("device","sharescreenshot","sharePicture");
    var shareScreenshot = new delegateClass("device","sharescreenshot","shareScreenshot");
    
    /**
     * 截屏
     *
     * @function takeScreenShot
     * @memberof clouda.mbaas.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.takeScreenshot = function(options) {
        takeScreenshot(function(base64jpeg){
            options.onsuccess(base64jpeg);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
    /**
     * 分享
     *
     * @function sharePicture
     * @memberof clouda.mbaas.screen
     * @instance
     *
     * @param {imgData} base64imgData 图片
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.sharePicture = function(imgData,options) {
        sharePicture(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        },imgData);
    };
    
    /**
     * 截屏+分享
     *
     * @function shareScreenShot
     * @memberof clouda.mbaas.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.shareScreenshot = function(options) {
        shareScreenshot(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
});