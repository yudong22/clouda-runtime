define("device",function(module) {
    var lightapp = this;
    //定义 sqlite 空间，clouda.device.sqlite 
    var it = module.sqlite = {};
    
    //需要device的sqlite模块
    var boot = ['openDatabase'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = device.sqlite[boot[i]];
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});