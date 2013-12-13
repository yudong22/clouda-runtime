define("mbaas",function(module) {
    var lightapp = this;
    var it = module.face = {};
    
    /**
     * @object facerecognition
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.facerecognition
     * 
     */
    module.FR_ERROR={
        NETWORK_ERR : 1, 
        TIMEOUT_ERR : 2,
        CANCEL_ERR : 3,
        REGISTER_ERR : 4,
        VERIFY_ERR : 5,
        DETECT_FACE_ERR : 6,
        AUTHORIZE_DEVICE_ERR : 7,
        GET_DEVICE_LIST_ERR : 8,
        CLECK_BLINK_ERR : 9,
        SERVER_ERR : 99,
        UNKNOWN_ERR : 100
    };
     
     /**
     * 注册人脸识别
     *
     * @function register
     * @memberof clouda.mbaas.facerecognition
     * @instance
     *
     * @param {string} uid 用户唯一标识符
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 
     * @param {function} [options.onfail] 
     * @returns null
     * 
     */
    it.register = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.register(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //uid
    it.verify = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            face.verify(function(){
                 options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //检查眨眼
    it.checkBlink = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.check_blink(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //绑定设备
    it.authorizeDevice = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.authorize_device(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //获取设备列表
    it.listDevice = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.get_device_list(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    
});