define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.battery = {};
    
    //需要device的battery模块
    var boot = ['start','stop'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = device.batteryStatus[boot[i]];//FIXME take a look at this function
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});