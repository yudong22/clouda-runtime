define("device",function(module) {
    var lightapp = this;
    //定义 notification 空间，clouda.device.notification 支持退化
    var it = module.notification = {};
    
    //需要device的notification模块
    var boot = ['alert','confirm','prompt','beep','vibrate'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = device.notification[boot[i]];
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    
    return module;
});