define("mbaas",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.qr = {};
    
    /**
     * @object qr
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.qr
     */
    
    module.QR_TYPE = {};
    module.QR_TYPE.BLACK = 0;
    module.QR_TYPE.COLOR = 1;
    module.QR_TYPE.DYNAMIC = 2;
    
    module.QR_DESTTYPE = {};
    module.QR_DESTTYPE.GIF = "gif";
    module.QR_DESTTYPE.PNG = "png";
    
    
    var qr = new delegateClass("barcode","identifyQRcode");
    var bar = new delegateClass("barcode","identifyBarcode");
    // var optionClass = new delegateClass("barcode","QRcodeOptions");
    var create = new delegateClass("barcode","createQRcode");
    
    
    /**
     * 扫二维码
     *
     * @function scanQrcode
     * @memberof clouda.mbaas.qr
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
     it.scanQrcode = function(options){
        qr(function(string){//success callback
            if (typeof string=='string'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.QR_ERR,nativeErr,options);
        },options);
     };
     /**
     * 扫条形码
     *
     * @function scanBarcode
     * @memberof clouda.mbaas.qr
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.scanBarcode = function(options){
        bar(function(string){//success callback
            if (typeof string=='string'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.QR_ERR,nativeErr,options);
        },options);
     };
    /**
     * 生成二维码
     *
     * @function generate
     * @memberof clouda.mbaas.qr
     * @instance
     *
     * @param {string} 要生成的文字
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {int} [options.type] 生成qr的类别
     * @param {string} [options.backgroundUrl] 
     * @param {int} [options.destType] 
     * @returns null
     * 
     */
    it.generate = function(content,options){
        //function(sucessCallback, errorCallback, type, content, backgroundUrl, destType){
        create(function(string){//success callback
            if (typeof string=='string'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.QR_ERR,nativeErr,options);
        },options.type,content,options.backgroundUrl,options.destType);
     };
});