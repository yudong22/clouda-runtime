define("device",function(module) {
    var lightapp = this;
    //定义 sqlite 空间，clouda.device.sqlite 
    var it = module.sqlite = {};
    
    /**
     * @object sqlite 使用sqllit接口未封装
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.sqlite
     */
    
    // var openDatabase = new delegateClass("device","sqlite","openDatabase");
//     
    // it.openDatabase = function(options){
        // openDatabase(options.onSuccess,function(){
            // if (options && typeof options.onFail == 'function'){
                // options.onFail(ErrCode.REACH_ERR);
            // }else{
                // lightapp.error(ErrCode.REACH_ERR);
            // }
        // },options);
     // };
    
    return module;
});