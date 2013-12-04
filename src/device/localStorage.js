define("device",function(module) {
    var lightapp = this;
    //定义 localStorage 空间，clouda.device.localStorage 支持退化
    var it = module.localStorage = {};
    
    /**
     * @object localStorage
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.localStorage
     */
    
    
    it.set = function(){
        window.localStorage.setItem.apply(this,arguments);
    };
    it.get = function(){
        window.localStorage.getItem.apply(this,arguments);
    };
    it.remove = function(){
        window.localStorage.removeItem.apply(this,arguments);
    };
    it.count = function(options){
        if (typeof options.onsuccess === 'function'){
            options.onsuccess(window.localStorage.length);
        }else{
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
        }
    };
    it.clean = function(){
        window.localStorage.clear();
    };
});