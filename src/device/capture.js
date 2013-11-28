define("device",function(module) {
    var lightapp = this;
    //定义 capture 空间，clouda.device.capture 
    var it = module.capture = {};
    
    //需要device的capture模块
    var boot = ['captureAudio','captureImage','captureVideo'];
    
    for(var i=0,len=boot.length;i<len;i++){
        it[boot[i]] = new delegateClass("device","capture",boot[i]);
    }
    
    return module;
});