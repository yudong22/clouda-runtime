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
    clouda.device.accelerometer.stopListen();
};
var acclisten = function(){
    clouda.device.accelerometer.stopListen();
};
var bindpush = function(){
    clouda.mbaas.push.register({onsuccess:function(data){
        alert(JSON.stringify(data));
    },onfail:function(errcode){
        alert("error"+errcode);
    }});
};
var unbindpush = function(){
    clouda.mbaas.push.unregister({onsuccess:function(){
        
    },onfail:function(errcode){
        alert("error"+errcode);
    }});
};
var dianchistart = function(){
    clouda.device.battery.startListen({onsuccess:function(data){
        alert("success"+data.level);
        console.log(data);
    },onfail:function(errno){
        alert("error");
        console.log(errno);
    }});
};
