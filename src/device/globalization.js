define("device",function(module) {
    var lightapp = this;
    //定义 globalization 空间，clouda.device.globalization 
    var it = module.globalization = {};
    /**
     * @object globalization
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.globalization
     */
    
     var boot = ['dateToString','getCurrencyPattern','getDateNames','getDatePattern','getFirstDayOfWeek',
        'getLocaleName','getNumberPattern','getPreferredLanguage','isDayLightSavingsTime','numberToString',
        'stringToDate','stringToNumber'];
     var toolKit={};
     for(var i=0,len=boot.length;i<len;i++){
         toolKit[boot[i]] = new delegateClass("device","globalization",boot[i]);
     }
    
    
    /**
     *
     * @function getPreferredLanguage
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
     it.getPreferredLanguage = function (options) {
        toolKit.getPreferredLanguage(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
     };
    /**
     *
     * @function getLocaleName
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getLocaleName = function (options) {
        toolKit.getLocaleName(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function dateToString
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {Date} date
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.dateToString = function (date, options) {
        toolKit.dateToString(date,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function stringToDate
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {string} dateString
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.stringToDate = function (dateString, options) {
        toolKit.stringToDate(dateString,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getDatePattern
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getDatePattern = function (options) {
        toolKit.getDatePattern(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getDateNames
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getDateNames = function (options) {
        toolKit.getDateNames(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function isDayLightSavingsTime
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {Date} date
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.isDayLightSavingsTime = function (date, options) {
        toolKit.isDayLightSavingsTime(date,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getFirstDayOfWeek
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getFirstDayOfWeek = function (options) {
        toolKit.getFirstDayOfWeek(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function numberToString
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {int} number
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.numberToString = function (number, options) {
        toolKit.numberToString(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function stringToNumber
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {string} numberString
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.stringToNumber = function (numberString, options) {
        toolKit.stringToNumber(numberString,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     *
     * @function getNumberPattern
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getNumberPattern = function (options) {
        toolKit.getNumberPattern(options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    /**
     * @function getCurrencyPattern
     * @memberof clouda.device.globalization
     * @instance
     *
     * @param {string} currencyCode
     * @param {{}} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFail
     */
    it.getCurrencyPattern = function (currencyCode, options) {
        toolKit.getCurrencyPattern(currencyCode,options.onSuccess,function(){
            if (options && typeof options.onFail == 'function'){
                options.onFail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    
    return module;
});