define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.pay = {};
    
    var init = new delegateClass("lightpay","init");
    var dopay = new delegateClass("lightpay","dopay");
    
    /**
     * init
     *
     * @function init
     * @memberof clouda.mbaas.pay
     * @instance
     *
     * @param {string} parter_id 初始化parter_id
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
     it.init = function(parter_id,options){
         if (!parter_id || typeof parter_id !='string'){
             lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
             return false;
         }
         init(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.PAY_ERROR,nativeErr,options);
         },parter_id,options);
         
        
     };
    /**
     * pay
     *
     * @function login
     * @memberof clouda.mbaas.login
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.orderInfo] 订单信息
     * @param {boolen} [options.showdDialog] 展示加载中的dialog,默认true
     * @returns null
     * 
     */
     it.pay = function(options){
         if (!options.showdDialog){
             options.showdDialog = true;
         }
         dopay(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.PAY_ERROR,nativeErr,options);
         },options.orderInfo,options.showdDialog,options);
        
     };
    
});