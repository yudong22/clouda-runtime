define("mbaas",function(module) {
    var lightapp = this;
    var vtt = module.vtt = {};
    var tts = module.tts = {};
    
    /**
     * @object vtt
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.vtt clouda.mbaas.vtt
     */
    
    
    // var voiceRecognition = new delegateClass("voice","voiceRecognition");
    var say = new delegateClass("voice","tts","say");
    
    module.VTT_STATUS={};
    module.VTT_STATUS.START_RECORDING = 0;
    module.VTT_STATUS.NONE = 1;
    module.VTT_STATUS.SPEECH_START = 2;
    module.VTT_STATUS.SPEECH_END = 4;
    module.VTT_STATUS.FINISH = 5;
    module.VTT_STATUS.PLAY_BEGINE_TONE_START = 6;
    module.VTT_STATUS.PLAY_BEGINE_TONE_END = 7;
    module.VTT_STATUS.PLAY_END_TONE_START = 8;
    module.VTT_STATUS.PLAY_END_TONE_END = 9;
    module.VTT_STATUS.UPDATE_RESULTS = 10;
    module.VTT_STATUS.AUDIO_DATA = 11;
    module.VTT_STATUS.USER_CANCELED = 61440;
    module.VTT_STATUS.ERROR = 65535;
    module.VTT_SPEECHMODE = {
        SEARCH:0,
        INPUT:1
    };
    
    // for(var name in module.VTT_STATUS){
        // module.VTT_STATUS
    // }
    /**
     * 启动识别
     *
     * @function scanQrcode
     * @memberof clouda.mbaas.vtt
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.voicePower] 
     * @param {int} [options.speechMode] 
     * @param {function} [options.onfail] 
     * @returns null
     * 
     */
     vtt.startCapture = function(options){
         installPlugin("voice",function(plg){
             var voiceRecognition = plg.vtt;
             if (options.voicePower){
                 voiceRecognition.enableVoicePower(function(){}, function(){}, options.voicePower);
            }
            if (options.speechMode){
                 voiceRecognition.setSpeechMode(function(){}, function(){}, options.speechMode);
            }
            voiceRecognition.startVoiceRecognition(function(string){//success callback
                    // options.onsuccess.apply(this,arguments);
                    voiceRecognition.setStatusChangeListener(
                      function(result) {
                        if (result.status === module.VTT_STATUS.FINISH ){
                            options.onsuccess.apply(this,arguments);
                        }else if (result.status === module.VTT_STATUS.USER_CANCELED) {
                            options.onfail.call(this,clouda.STATUS.USER_CANCELED);
                        }else if (result.status === module.VTT_STATUS.ERROR) {
                            options.onfail.call(this,result.status);
                        }
                      },
                      function(error) {
                        lightapp.error(ErrCode.vtt_ERR,error.code,options);
                      }
                    );
                
            },function(nativeErr){
                lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
            },options);
         });
        
     };
     
     vtt.speakFinish = function(options){
         installPlugin("voice",function(plg){
            var voiceRecognition = plg.vtt;
            voiceRecognition.speakFinish(function(string){//success callback
                options.onsuccess(clouda.STATUS.SUCCESS);
            },function(nativeErr){
                lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
            },options);
       });
     };
     
     vtt.terminateCapture = function(options){
         installPlugin("voice",function(plg){
            var voiceRecognition = plg.vtt;
            voiceRecognition.stopVoiceRecognition(function(string){//success callback
                options.onsuccess(clouda.STATUS.SUCCESS);
            },function(nativeErr){
                lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
            },options);
        });
     };
     
     /**
     * @object tts
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.vtt clouda.mbaas.tts
     */
    module.TTS_TYPE = {
      TYPE_DICT_US: 'dict_en',
      TYPE_DICT_UK: 'dict_uk',
      // TRANS_EN: 'trans_en',
      TYPE_DICT_ZH: 'trans_zh',
    };
   
   /**
     * 语音外放
     *
     * @function say
     * @memberof clouda.mbaas.tts
     * @instance
     *
     * @param {string} say word
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.type] 类型
     * @returns null
     * 
     */
     tts.say = function(word,options){
         //say: function(successCallback, errorCallback, text, type) {
        say(function(string){//success callback
            if (typeof string=='string'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.vtt_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
        },word,options.type);
     };
});
