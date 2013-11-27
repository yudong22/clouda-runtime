define("device",function(module) {
    var lightapp = this;
    //定义 accelerometer 空间，clouda.device.accelerometer 
    var it = module.accelerometer = {};
    
    //需要device的accelerometer模块
    var boot = ['clearWatch','getCurrentAcceleration','watchAcceleration'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = new delegateClass("device","accelerometer",boot[i]);
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});