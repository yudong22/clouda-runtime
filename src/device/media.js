define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.media 支持退化
    var it = module.media = {};
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
        
        var func;
        if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO){
            func=captureVideo;
        }else if (options.mediaType == clouda.device.MEDIA_TYPE.AUDIO){
            func=captureAudio;
        }else{//默认 MEDIA_TYPE.PICTURE
            if (options.format === module.MEDIA_FORMAT.BASE64) {
                func=getPicture;
            }else if (options.source === clouda.device.MEDIA_SOURCE.ALBUM){
                if (options.format === module.MEDIA_FORMAT.FILE) {
                    options.destType = module.MEDIA_DESTINATION.FILE_URI;
                }
                func=getPicture;
                options.sourceType = module.MEDIA_SOURCE.ALBUM;
        
            }else{
                func=captureImage;
            }
        }
        
        installPlugin("device", function(device) {
        
            func(function(mediaFile){
                if (Array.isArray(mediaFile)){
                    if (options.details){//处理详细信息
                        var i = 0;
                        mediaFile[i].getFormatData(function(obj){
                            mediaFile[i].width = obj.width;
                            mediaFile[i].height = obj.height;
                            mediaFile[i].duration = obj.duration;
                        },function(){});
                    }
                    if (mediaFile.length == 1){
                        options.onsuccess(mediaFile[0]);
                    }else{
                        options.onsuccess(mediaFile);
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
                lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
            },options);
        });
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
        installPlugin("device", function(device) {
            if (!media[link]){
                media[link] = new device.Media(link,function(id){
                    //options.onsuccess(media);
                },function(nativeErr){
                    delete media[link];
                    lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
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
                case "play":
                case "pause":
                case "release":
                case "startRecord":
                case "stopRecord":
                case "stop":
                    media[link][operator]();
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                
            }
            
            
        });
    };
   
    return module;
});