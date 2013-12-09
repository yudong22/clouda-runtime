define("device",function(module) {
    var lightapp = this;
    var it = module.screen = {};
    
    /**
     * @object screen
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.screen
     */
    
    var takeScreenshot = new delegateClass("device","sharescreenshot","takeScreenshot");
    var sharePicture = new delegateClass("device","sharescreenshot","sharePicture");
    var shareScreenshot = new delegateClass("device","sharescreenshot","shareScreenshot");
    
    /**
     * 截屏
     *
     * @function captureScreen
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.captureScreen = function(options) {
        takeScreenshot(function(base64jpeg){
            options.onsuccess(base64jpeg);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
    /**
     * 分享
     *
     * @function shareImage
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {imgData} base64imgData 图片
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.shareImage = function(imgData,options) {
        sharePicture(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        },imgData);
    };
    
    /**
     * 截屏+分享
     *
     * @function shareScreen
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.shareScreen = function(options) {
        shareScreenshot(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
});