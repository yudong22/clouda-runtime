define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.media 支持退化
    var it = module.media = {};
    
    module.media.mediamsg = {
        0:"NONE ACTIVE.",
        1:"ABORT_ERR.",
        2:"CONNECTION ERR.",
        3:"DECODE ERR.",
        4:"SRC NOT SUPPORT.",
    };
    var mediaerror = function(first,err,options){
        //deal with err
        if (err.code){
            if (module.media.mediamsg[err.code]){
                err.error_info = module.media.mediamsg[err.code];
            }
            err.result = err.code;
            delete err.code;
        }
        
        lightapp.error(first,err,options);
    };
    // _MediaError.MEDIA_ERR_NONE_ACTIVE = _MediaError.MEDIA_ERR_NONE_ACTIVE || 0, 
    // _MediaError.MEDIA_ERR_ABORTED = _MediaError.MEDIA_ERR_ABORTED || 1, _MediaError.MEDIA_ERR_NETWORK = _MediaError.MEDIA_ERR_NETWORK || 2, 
    // _MediaError.MEDIA_ERR_DECODE = _MediaError.MEDIA_ERR_DECODE || 3, _MediaError.MEDIA_ERR_NONE_SUPPORTED = _MediaError.MEDIA_ERR_NONE_SUPPORTED || 4, 
    // _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED = _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || 4;
            
    /**
     * @object media
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.media
     */
    
    module.MEDIA_DESTINATION={};
    module.MEDIA_ENCODEING={};
    module.MEDIA_TYPE={};
    module.MEDIA_SOURCE={};
    module.MEDIA_DIRECTION={};
    
    //定义类型
    module.MEDIA_DESTINATION.DATA_URL = 0;
    module.MEDIA_DESTINATION.FILE_URI = 1;
    module.MEDIA_DESTINATION.NATIVE_URI = 2;
    
    module.MEDIA_ENCODEING.JPEG = 0;
    module.MEDIA_ENCODEING.PNG = 1;
    
    module.MEDIA_TYPE.PICTURE = 0;
    module.MEDIA_TYPE.VIDEO = 1;
    module.MEDIA_TYPE.ALLMEDIA = 2; //for function getPicture only
    module.MEDIA_TYPE.AUDIO = 3; //for function captureMedia only
    
    
    module.MEDIA_SOURCE.ALBUM = 1;
    module.MEDIA_SOURCE.CAMERA = 0;
    
    module.MEDIA_DIRECTION.BACK = 0;
    module.MEDIA_DIRECTION.FRONT = 1;
    
    //MEDIA_FORMAT.FILE
    module.MEDIA_FORMAT = {
        FILE : 0,
        BASE64:1,
    };
    module.MEDIA_STATUS = {
        NONE : 0,
        STARTING : 1,
        RUNNING : 2,
        PAUSED : 3,
        STOPPED : 4
    };
     
    var getPicture = new delegateClass("device","camera","getPicture");
    // var cleanup = new delegateClass("device","camera","cleanup");
    var captureAudio = new delegateClass("device","capture","captureAudio");
    var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
    
    
    /**
     * 启动canema，支持读取手机图库或者拍照
     *
     * @function getPicture
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options 可定义
     * @param {function} options.onsuccess 成功
     * @param {function} options.onfail 失败
     
     * @returns null
     * 
     */
    
    // it.getPicture = function(options){
        // getPicture(function(imageData){//success callback
            // if (typeof imageData=='string'){
                // options.onsuccess.apply(this,arguments);
            // }else{
                // lightapp.error(ErrCode.MEDIA_ERR,ErrCode.UNKNOW_CALLBACK,options);
            // }
//             
        // },function(nativeErr){
            // lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
        // },options);
    // };
    
    /**
     *
     * Launch audio recorder application for recording audio clip(s).
     *
     * @function captureMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {int} options.mediaType=clouda.device.MEDIA_TYPE.PICTURE
     * @param {int} [options.limit=1]
     * @param {int} [options.duration=0]
     * @param {int} [options.format=FILE]
     * @param {number} [options.quality] 
     * @param {number} [options.destinationType]
     * @param {number} [options.sourceType] 
     * @param {number} [options.mediaType]
     * @param {number} [options.mediaDirection]
     * @param {number} [options.encodingType]
     * @param {boolen} [options.saveToPhotoAlbum] 
     * @param {boolen} [options.details] 
     * @returns null
     * 
     */
    
    it.captureMedia = function(options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            if (!options.source ){
                options.source = clouda.device.MEDIA_SOURCE.CAMERA;
            }
            var successstring = "(function(result){if(result.lastModified){result.lastModifiedDate=result.lastModified;}("+options.onsuccess.toString()+")(result);})";
            var failstring = "(function(result){if(result.error_info=='cancel'){result.result=clouda.STATUS.USER_CANCELED};("+options.onfail.toString()+")(result);})";
            // var failstring = "("+options.onfail.toString()+")";
            
            if (options.mediaType == clouda.device.MEDIA_TYPE.AUDIO) {
                lightapp.error(ErrCode.NOT_FINISH,ErrCode.NOT_FINISH,options);
            } else if (options.source == clouda.device.MEDIA_SOURCE.CAMERA) {
                if (options.mediaType == clouda.device.MEDIA_TYPE.IMAGE) {
                    BLightApp.cloudaLaunchCamera(
                            'lightapp.device.MEDIA_TYPE.IMAGE', successstring,failstring);
                } else if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO) {
                    BLightApp.cloudaLaunchCamera(
                            'lightapp.device.MEDIA_TYPE.VIDEO',  successstring,failstring);
                }
            } else if (options.source == clouda.device.MEDIA_SOURCE.ALBUM) {
                if (options.mediaType == clouda.device.MEDIA_TYPE.IMAGE) {
                    BLightApp.cloudaLaunchGallery(
                            'lightapp.device.MEDIA_TYPE.IMAGE',  successstring,failstring);
                } else if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO) {
                    BLightApp.cloudaLaunchGallery(
                            'lightapp.device.MEDIA_TYPE.VIDEO',  successstring,failstring);
                }
            }else{
                lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            }
            
            return false;
        }
        
        /*

var getPicture = new delegateClass("device","camera","getPicture");
    // var cleanup = new delegateClass("device","camera","cleanup");
    var captureAudio = new delegateClass("device","capture","captureAudio");
    var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
             */
        installPlugin("device", function(device) {
            var func;
            if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO){
                
                if (options.source === clouda.device.MEDIA_SOURCE.ALBUM){
                    func=device.camera.getPicture;
                    options.sourceType = module.MEDIA_SOURCE.ALBUM;
                }else{
                    func=device.capture.captureVideo;
                }
            }else if (options.mediaType == clouda.device.MEDIA_TYPE.AUDIO){
                func=device.capture.captureAudio;
            }else{//默认 MEDIA_TYPE.PICTURE
                if (options.format === module.MEDIA_FORMAT.BASE64){
                    options.destType = module.MEDIA_DESTINATION.DATA_URL;
                }else if (options.format === module.MEDIA_FORMAT.FILE) {
                    options.destType = module.MEDIA_DESTINATION.FILE_URI;
                }
                
                if (options.source === clouda.device.MEDIA_SOURCE.ALBUM){
                    func=device.camera.getPicture;
                    options.sourceType = module.MEDIA_SOURCE.ALBUM;
                }else if (options.format === module.MEDIA_FORMAT.BASE64){//base 64 should
                    func=device.camera.getPicture;
                }else{
                    func=device.capture.captureImage;
                }
            }
            func(function(mediaFile){
                if (Array.isArray(mediaFile)){
                    if (mediaFile.length == 1 && options.details){//处理详细信息
                        var i = 0;
                        mediaFile[i].getFormatData(function(obj){
                            mediaFile[i].width = obj.width;
                            mediaFile[i].height = obj.height;
                            mediaFile[i].duration = obj.duration;
                            options.onsuccess(mediaFile[0]);
                        },function(){});
                    }else{
                        if (mediaFile.length === 1){
                            options.onsuccess(mediaFile[0]);
                        }else{
                            options.onsuccess(mediaFile);
                        }
                    }
                } else {//base64
                    if (options.format === module.MEDIA_FORMAT.FILE) {
                        var mediaFile1 = new device.fs.MediaFile("tmpfile",mediaFile);
                        options.onsuccess(mediaFile1);
                    }else{
                        options.onsuccess(mediaFile);
                    }
                    
                }
            },function(nativeErr){
                if (nativeErr.code){
                    nativeErr.result = nativeErr.code;
                    nativeErr.error_info = nativeErr.message;
                }
                if(nativeErr.result == 3){// 取消code hack对齐
                    lightapp.error(ErrCode.MEDIA_ERR,{result:clouda.STATUS.USER_CANCELED,error_info:"cancel"},options);
                }else{
                    lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
                }
                
            },options);
        },options);
        
        
    };
    
     /**
     *
     * create mediafile by link
     *
     * @function createMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {string} link
     * @param {string} operator
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onstatus
     * @param {float} volume 设置声音大小 最大1.0 仅限(setVolume)
     * @param {int} time 从开始到的毫秒数 仅限(getDuration)
     * @returns null
     * 
     */
    var media={};
    it.operateMedia = function(link,operator,options){
        if (clouda.RUNTIME === clouda.RUNTIMES.KUANG){
            var successstring = "(function(result){if(result.lastModified){result.lastModifiedDate=result.lastModified;}("+options.onsuccess.toString()+")(result);})";
            var recordsuccess = "(function(result){("+options.onsuccess.toString()+")(result.fullPath);})";
            var failstring = "(function(result){if (!result.error_info){result.error_info=clouda.device.media.mediamsg[result.result]};("+options.onfail.toString()+")(result);})";
            var emptystring = "(function(){})";
            switch(operator){
                case "startRecord":
                    BLightApp.startRecording(link,recordsuccess,
                            failstring);
                    break;
                case "stopRecord":
                    BLightApp.stopRecording(recordsuccess,
                            failstring);
                    break;
                case "play":
                    BLightApp.playAudio(link,'lightapp.device.AUDIO_TYPE.PLAY',emptystring,
                            failstring);
                    break;
                case "stop":
                    BLightApp.playAudio(link,'lightapp.device.AUDIO_TYPE.STOP',recordsuccess,
                            failstring);
                    break;
                case "seekTo":
                    BLightApp.audioSeekTo(options.time,successstring,failstring);
                    break;
                case "setVolume":
                    BLightApp.setVolume(options.volume,successstring,failstring);
                    break;
                
                default:
                    lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            }
            return false;
        }
        installPlugin("device", function(device) {
            if (!media[link]){
                media[link] = new device.Media(link,function(id){
                },function(nativeErr){
                    mediaerror(ErrCode.MEDIA_ERR,nativeErr,options);
                },options.onstatus);
            }
            switch(operator){
                case "getCurrentPosition":
                    media[link][operator].call(media[link],options.onsuccess,options.onfail);
                    break;
                case "getDuration":
                    var duration = media[link][operator]();
                    if (duration > -1) {
                        options.onsuccess(duration);
                    }else{
                        options.onfail(duration);
                    }
                    break;
                case "seekTo":
                    media[link][operator](options.time);
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                case "setVolume":
                    media[link][operator](options.volume);
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                case "play"://没有callback
                    media[link][operator]();
                    break;
                case "startRecord":
                case "stop":
                    media[link][operator]();
                    options.onsuccess();
                    break;
                case "pause":
                case "stopRecord":
                    media[link][operator]();
                    options.onsuccess(link);
                    break;
                case "release":
                    media[link][operator]();
                    options.onsuccess(link);
                    delete media[link];
                
            }
            
            
        },options);
    };
   
    return module;
});