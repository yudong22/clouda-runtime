define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.network 支持退化
    var it = module.network = {};
    
    //需要device的network模块
    var boot = ['getInfo'];
    
    for(var i=0,len=boot.length;i<len;i++){
        try{
            it[boot[i]] = device.network[boot[i]];
        }catch(e){
            it[boot[i]] = this.error;
        }
    }
    //初始化格式化数据,clouda.device.network.UNKNOWN
    it.UNKNOWN=0;
    it.ETHERNET=1;
    it.WIFI=2;
    it.CELL_2G=3;
    it.CELL_3G=4;
    it.CELL_4G=5;
    it.CELL=6;
    it.NONE=7;
    //clouda.device.network.UNKNOWN
    it.status = it.UNKNOWN;
    //TODO 应该提供监听方法
    
    return module;
});