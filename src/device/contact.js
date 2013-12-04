define("device",function(module) {
    var lightapp = this;
    //定义 contact 空间，clouda.device.contact 支持退化
    var it = module.contact = {};
    
    /**
     * @object contact
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.contact
     */
    
    var create = new delegateClass("device","contact","create");
    var find =new delegateClass("device","contact","find");
    
    module.CONTACT_COLUMN={
        NAME:"name",
        PHONE:"phoneNumbers",
        EMAIL:"emails",
    };
    /**
     * Returns an array of Contacts matching the search criteria.
     *
     * @function find
     * @memberof clouda.device.contact
     * @instance
     *
     * @param fields that should be searched
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @return null
     */
    it.find = function(fields,options){
        find(fields,function(contact_array){
            if ( Array.isArray(contact_array) ){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.CONTACT_FIND_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
        },options);
        
    };
    
    it.insert = function(fields,options){
        
    };
    
    it.update = function(fields,options){
        
    };
    
    it.remove = function(fields,options){
        
    };
    it.count = function(fields,options){
        
    };
});