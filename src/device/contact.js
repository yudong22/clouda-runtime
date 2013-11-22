define("device",function(module) {
    var lightapp = this;
    //定义 contact 空间，clouda.device.contact 支持退化
    var it = module.contact = {};
    
    //需要device的contact模块
    var boot = ['create','find'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = device.contact[boot[i]];
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});