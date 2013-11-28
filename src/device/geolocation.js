define("device",function(module) {
    var lightapp = this;
    //定义 geolocation 空间，clouda.device.geolocation 支持退化
    var it = module.geolocation = {};
    
    //需要device的geolocation模块
    var boot = ['clearWatch','getCurrentPosition','watchPosition'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","geolocation",boot[i]);
    }
    //TODO deviceOrientation 合并于此
    
    return module;
});