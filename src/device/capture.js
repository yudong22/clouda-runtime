define("device",function(module) {
    var lightapp = this;
    //定义 capture 空间，clouda.device.capture 
    var it = module.capture = {};
    
    /**
     * @object capture
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.capture
     */
    
    var captureAudio = new delegateClass("device","capture","captureAudio");
    var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
    
    
    /**
     * Launch audio recorder application for recording audio clip(s).
     *
     * @function captureAudio
     * @memberof clouda.device.capture
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
     *
     * Launch camera application for taking image(s).
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     * @param {int} [options.limit=1]
     * @function captureImage
     * @memberof clouda.device.capture
     * @instance
     */
     it.captureImage = function(options){
        captureImage(options.onSuccess,function(){
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
     * @memberof clouda.device.capture
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
    
});