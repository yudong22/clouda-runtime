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
var accstop = function(){
    clouda.device.accelerometer.stop({});
};
var acclisten = function(){
    clouda.device.accelerometer.stop();
};
var bindpush = function(){
    clouda.mbaas.push.registerForRemoteNotification({onsuccess:function(data){
        alert(JSON.stringify(data));
    },onfail:function(errcode){
        alert("error"+errcode);
    }});
};
var unbindpush = function(){
    clouda.mbaas.push.unregisterForRemoteNotification({onsuccess:function(){
        
    },onfail:function(errcode){
        alert("error"+errcode);
    }});
};
