clouda.lightapp("VeDdg6Kees4APXuaOFslObjS");


var capturemedia = function(){
    clouda.device.media.captureMedia({onSuccess:function(mediadata){
        console.log(mediadata);
    },onFail:function(errcode){
        console.error(arguments);
    },duration:10,limit:2,mediaType:clouda.device.MEDIA_TYPE.VIDEO});
};

var getmedia = function(){
    clouda.device.media.getMedia({onSuccess:function(mediadata){
        console.log(mediadata);
    },onFail:function(errcode){
        console.error(arguments);
    },duration:10,limit:2,mediaType:clouda.device.MEDIA_TYPE.VIDEO});
};
