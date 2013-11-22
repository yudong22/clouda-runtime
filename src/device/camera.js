define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.camera 支持退化
    var it = module.camera = {};
    
    //需要device的camera模块
    var boot = ['getPicture','cleanup'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = device.camera[boot[i]];
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});