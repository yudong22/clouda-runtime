define("mbaas",function(module) {
    var lightapp = this;
    var it = module.facerecognition = {};
    
    /**
     * @object facerecognition
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.face
     */
    var face;
    it.register = function(link,options){
        installPlugin("facerecognition", function(plg) {
            if (!face)face = new plg.FaceRecognition(lightapp.ak);
            
            face.register(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            },opt);
        });
    };
    
    it.verify = function(link,options){
        installPlugin("facerecognition", function(plg) {
            if (!face)face = new plg.FaceRecognition(lightapp.ak);
            
            face.verify(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            },opt);
        });
    };
    
    it.check_blink = function(link,options){
        installPlugin("facerecognition", function(plg) {
            if (!face)face = new plg.FaceRecognition(lightapp.ak);
            
            face.check_blink(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            },opt);
        });
    };
    
    it.authorize_device = function(link,options){
        installPlugin("facerecognition", function(plg) {
            if (!face)face = new plg.FaceRecognition(lightapp.ak);
            
            face.authorize_device(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            },opt);
        });
    };
    
    it.get_device_list = function(link,options){
        installPlugin("facerecognition", function(plg) {
            if (!face)face = new plg.FaceRecognition(lightapp.ak);
            
            face.get_device_list(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            },opt);
        });
    };
    
});