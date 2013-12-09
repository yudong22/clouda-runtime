define("device",function(module) {
    /**
     * @object notification
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.notification
     */
    // var lightapp = this;
    var it = module.notification = {};
    
    var alert = new delegateClass("device","notification","alert");
    var confirm = new delegateClass("device","notification","confirm");
    var prompt = new delegateClass("device","notification","prompt");
    var beep = new delegateClass("device","notification","beep");
    var vibrate = new delegateClass("device","notification","vibrate");
    
    var activityStart = new delegateClass("device","notification","activityStart");
    var activityStop = new delegateClass("device","notification","activityStop");
    var progressStart = new delegateClass("device","notification","progressStart");
    
    /**
     * 调用系统 alert 方法，接收一个message参数和一个可选的配置
     *
     * @function alert
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 点击button的callback
     * @param {string} [options.title] 弹出框的title
     * @param {string} [options.buttonName] 弹出框的buttonName
     * @returns null
     * 
     */
    it.alert = function(msg,options){
        if (typeof options === 'object'){
            return alert(msg,options.onsuccess,options.title,options.buttonName,options);
        }
        return alert(msg);
    };
    /**
     * 调用系统 confirm 方法，接收一个message参数和一个可选的配置
     *
     * @function confirm
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 点击确定的callback
     * @param {string} [options.title] 弹出框的title
     * @param {array} [options.buttonLabels] 弹出框的确定和取消按键，默认是['ok','cancel']
     * @returns null
     * 
     */
    it.confirm = function(msg,options){
        if (typeof options === 'object'){
            return confirm.call(this,msg,options.onsuccess,options.title,options.buttonLabels,options);
        }
        return confirm(msg);
    };
    /**
     * 滴滴声
     *
     * @function beep
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {number} milliseconds 持续时间，1000 毫秒 等于 1 秒
     * @returns null
     * 
     */
    it.beep = beep;
     /**
     * 振动
     *
     * @function vibrate
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {number} milliseconds 持续时间，1000 毫秒 等于 1 秒
     * @returns null
     * 
     */
    it.vibrate = vibrate;
    
    /**
     * 弹出定制化的dialog，接收一个message参数和一个可选的配置
     *
     * @function prompt
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} msg 提示文字
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 点击确定的callback
     * @param {string} [options.title] 标题
     * @param {array} [options.buttonLabels] 确定和取消按键，默认是['ok','cancel']
     * @param {string} [options.defaultText] 输入框默认文字
     * @returns null
     * 
     */
    it.prompt = function(msg,options){
        if (typeof options === 'object'){
            prompt(msg,options.onsuccess,options.title,options.buttonLabels,options.defaultText,options);
        }
        prompt(msg);
    };
    
    /**
     * 弹出loading
     *
     * @function activityStart
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} title 
     * @param {string} msg 
     * @param {{}} options 可定义
     * @param {function} [options.onfail] 失败调用
     * @returns null
     * 
     */
    it.activityStart = function(title,msg,options){
        activityStart(title,message,options);
    };
    
     /**
     * 关闭loading
     *
     * @function activityStart
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {{}} options 可定义
     * @param {function} [options.onfail] 失败调用
     * @returns null
     * 
     */
    it.activityStop = function(options){
        activityStop(options);
    };
    
     /**
     * 弹出进度条
     *
     * @function activityStart
     * @memberof clouda.device.notification
     * @instance
     *
     * @param {string} title 
     * @param {string} msg 
     * @param {{}} options 可定义
     * @param {function} [options.onfail] 失败调用
     * @returns null
     * 
     */
    it.progress = function(title,message,options){
        progressStart(title,message);
    };
    
    return module;
});