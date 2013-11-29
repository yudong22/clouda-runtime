define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.media 支持退化
    var it = module.media = {};
    /**
     * @object camera
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.media
     */
    //需要device的camera模块
    
     it.DestinationType = {
        DATA_URL : 0,      // Return image as base64-encoded string
        FILE_URI : 1,      // Return image file URI
        NATIVE_URI : 2     // Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
     };
     it.EncodingType = {
        JPEG : 0,               // Return JPEG encoded image
        PNG : 1                 // Return PNG encoded image
     };
     it.MediaType = {
        PICTURE: 0,    // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
        VIDEO: 1,      // allow selection of video only, WILL ALWAYS RETURN FILE_URI
        ALLMEDIA : 2   // allow selection from all media types
     };
     it.PictureSourceType = {
        PHOTOLIBRARY : 0,
        CAMERA : 1
     };
     it.Direction = {
        BACK : 0,      // Use the back-facing camera
        FRONT : 1      // Use the front-facing camera
    };
    var getPicture = new delegateClass("device","camera","getPicture");
    // var cleanup = new delegateClass("device","camera","cleanup");
    var captureAudio = new delegateClass("device","capture","captureAudio");
    // var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
    
    
    /**
     * 启动canema，读取手机图库
     *
     * @function getPicture
     * @memberof clouda.device.media
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} options.onSuccess 成功
     * @param {function} options.onFail 失败
     * @param {number} [options.quality] 
     * @param {number} [options.destinationType]
     * @param {number} [options.sourceType] 
     * @param {number} [options.mediaType]
     * @param {number} [options.mediaDirection]
     * @param {number} [options.encodingType]
     * @param {boolen} [options.saveToPhotoAlbum] 
     * @returns null
     * 
     */
    
    it.captureImage = function(options){
        getPicture(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.REACH_ERR);
            }else{
                lightapp.error(ErrCode.REACH_ERR);
            }
        },options);
        // getPicture(options.onSuccess,options.onFail,options);
    };
    //没有终止
    
    
    /**
     * Launch audio recorder application for recording audio clip(s).
     *
     * @function captureAudio
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     * @param {int} [options.limit=1]
     * @param {int} [options.duration=0]
     *
     *
     */
    it.captureAudio = function(options){
        captureAudio(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.CAP_GET_ERR);
            }else{
                lightapp.error(ErrCode.CAP_GET_ERR);
            }
        },options);
    };
    
    
    /**
     * Launch device camera application for recording video(s).
     *
     * @function captureVideo
     * @memberof clouda.device.media
     * @instance
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     * @param {int} [options.limit=1]
     * @param {int} [options.duration=0]
     */
     it.captureVideo = function(options){
        captureVideo(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.CAP_GET_ERR);
            }else{
                lightapp.error(ErrCode.CAP_GET_ERR);
            }
        },options);
     };
     
    return module;
});