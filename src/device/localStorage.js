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
    
    
    it.set = function(key,value,options){
        try{
            window.localStorage.setItem(key,value);
            options.onsuccess(clouda.STATUS.SUCCESS);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
        
    };
    it.get = function(key,options){
        
        try{
            options.onsuccess(window.localStorage.getItem(key));
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
    };
    it.remove = function(key,options){
        
        try{
            window.localStorage.removeItem(key);
            options.onsuccess(clouda.STATUS.SUCCESS);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
    };
    it.count = function(options){
        try{
            options.onsuccess(window.localStorage.length);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
    };
    it.empty = function(options){
        try{
            window.localStorage.clear();
            options.onsuccess(clouda.STATUS.SUCCESS);
        }catch(e){
            console.log(e.stack);
            options.onfail(clouda.STATUS.SYSTEM_FAILURE);
        }
       
    };
});