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
    
    
    var qr = new delegateClass("barcode","identifyQRcode");
    var bar = new delegateClass("barcode","identifyBarcode");
    // var optionClass = new delegateClass("barcode","QRcodeOptions");
    var create = new delegateClass("barcode","createQRcode");
    
    module.QR_TYPE = {
        QRCODE : 1,
        BARCODE: 2
    };
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
     it.startCapture = function(options){
         if (options.type === module.QR_TYPE.BARCODE){//默认是qr，除非指定barcode
             bar(function(string){//success callback
                if (typeof string=='string'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
                
            },function(nativeErr){
                lightapp.error(ErrCode.QR_ERR,nativeErr,options);
            },options);
         }else{
             qr(function(string){//success callback
                if (typeof string=='string'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
                
            },function(nativeErr){
                lightapp.error(ErrCode.QR_ERR,nativeErr,options);
            },options);
         }
        
     };
     
   
    var QR_TYPE = {};
    QR_TYPE.BLACK = 0;
    QR_TYPE.COLOR = 1;
    QR_TYPE.DYNAMIC = 2;
    
    var QR_DESTTYPE = {};
    QR_DESTTYPE.GIF = "gif";
    QR_DESTTYPE.PNG = "png";
    
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
     * @param {int} [options.animate] 
     * @param {string} [options.backgroundPath] 
     * @param {int} [options.mono] 
     * @returns null
     * 
     */
    it.generate = function(content,options){
        //function(sucessCallback, errorCallback, type, content, backgroundUrl, destType){
        //1.判断动画与否
        if ( options.animate ){//设定生成图片的类型
            options.destType = QR_DESTTYPE.GIF;
            options.type = QR_TYPE.DYNAMIC;
        }else{
            options.destType = QR_DESTTYPE.PNG;
        }
        //2.判断黑白与否
        if (options.destType === QR_DESTTYPE.PNG){// png在判断是否为黑白
            if ( options.mono === false ) {//默认是mono是true，即是黑白
                options.type = QR_TYPE.COLOR;
            }else{
                options.type = QR_TYPE.BLACK;
            }
        }
        create(function(string){//success callback
            if (typeof string=='string'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.QR_ERR,nativeErr,options);
        },options.type,content,options.backgroundPath,options.destType);
     };
});