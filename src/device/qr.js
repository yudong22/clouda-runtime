define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.qr = {};
    
    /**
     * @object qr
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.qr
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
     * @function startCapture
     * @memberof clouda.device.qr
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
     it.startCapture = function(options){
         
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {

            if (options.type == clouda.device.QR_TYPE.QRCODE) {
                BLightApp.startQRcode('lightapp.device.QR_TYPE.QRCODE',"("+options.onsuccess.toString()+")",
                            "("+options.onfail.toString()+")");
            } else if (options.type == clouda.device.QR_TYPE.BARCODE) {
                BLightApp.startQRcode('lightapp.device.QR_TYPE.BARCODE', "("+options.onsuccess.toString()+")",
                            "("+options.onfail.toString()+")");
            }
            
            return ;
        }
         
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
    QR_DESTTYPE.JPEG = "jpeg";
    
    /**
     * 生成二维码
     *
     * @function generate
     * @memberof clouda.device.qr
     * @instance
     *
     * @param {string} 要生成的文字
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.animate] 
     * @param {string} [options.backgroundUrl] 
     * @param {boolen} [options.mono] 
     * @param {boolen} [options.offline] 离线生成二维码，不支持多余配置
     * @returns null
     * 
     */
    it.generate = function(content,options){
        //function(sucessCallback, errorCallback, type, content, backgroundUrl, destType){
        
        //目前生成使用js能力
        if (typeof options.offline == 'undefined'){
            options.offline = true;
        }
        
        //0. 先判断是否使用离线生成能力
        if (options.offline){
            if (content.length > 255){
                lightapp.error(ErrCode.QR_ERR,999,options);
            }else{
                try{
                    var len = content.length;
                    for(var t=1;t<9;t++){
                        if (len/2 < 1){
                            break;
                        }else{
                            len = len/2;
                        }
                    }
                    var qr = clouda.lib.qrcode(t+2,'M');
                    // var qr = qrcode(typeNumber || 4, errorCorrectLevel || 'M');
                    qr.addData(content);
                    qr.make();
                    options.onsuccess(qr.createImgTag());
                }catch(e){
                    lightapp.error(ErrCode.QR_ERR,998,options);
                }
      
            }
            return ;
        }
        //1.判断动画与否
        if ( options.animate ){//设定生成图片的类型
            options.destType = QR_DESTTYPE.GIF;
            options.type = QR_TYPE.DYNAMIC;
        }else{
            options.destType = QR_DESTTYPE.JPEG;
        }
        //2.判断黑白与否
        if (options.destType === QR_DESTTYPE.JPEG){// png在判断是否为黑白
            if ( options.mono === false ) {//默认是mono是true，即是黑白
                options.type = QR_TYPE.COLOR;
            }else{
                options.type = QR_TYPE.BLACK;
            }
        }
        installPlugin("barcode",function(plg){
            var opt = new plg.QRcodeOptions(options.type, options.destType, options.backgroundUrl||"");
            plg.createQRcode(
              function(result) {
                options.onsuccess(result);
              },
              function (error) {
                  lightapp.error(ErrCode.QR_ERR,error,options);
              },
              content,
              opt
            );
        });
        // create(function(string){//success callback
            // if (typeof string=='string'){
                // options.onsuccess.apply(this,arguments);
            // }else{
                // lightapp.error(ErrCode.QR_ERR,ErrCode.UNKNOW_CALLBACK,options);
            // }
//             
        // },function(nativeErr){
            // lightapp.error(ErrCode.QR_ERR,nativeErr,options);
        // },options.type,content,options.backgroundUrl,options.destType);
     };
});