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
    var progressValue = new delegateClass("device","notification","progressValue");
    var progressStop = new delegateClass("device","notification","progressStop");
    /**
     * 调用系统 alert 方法，接收一个msg参数和一个可选的配置
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
     * 调用系统 confirm 方法，接收一个msg参数和一个可选的配置
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
        confirm.call(this,msg,function(data){
            if (data === 2){//cancel
                options.onfail(clouda.STATUS.USER_CANCELED);
            }else{
                options.onsuccess(clouda.STATUS.SUCCESS);
            }
        },options.title,options.buttonLabels,options);
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
    it.beep = function(time){
        beep(time);
    };
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
    it.vibrate = function(time){
        vibrate(time);
    };
    
    /**
     * 弹出定制化的dialog，接收一个msg参数和一个可选的配置
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
        //device.notification.prompt("Prompt Message", promptCB, "Hello", ["OK", "Cancel"], "Hello you!");
        prompt(msg,options.onsuccess,options.title,options.buttonLabels,options.defaultText);
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
    it.startLoad = function(title,msg,options){
        activityStart(title,msg,options);
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
    it.stopLoad = function(options){
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
    it.startProgress = function(title,msg,options){
        progressStart(title,msg);
    };
    it.updateProgress = function(value){
        progressValue(value);
    };
    it.stopProgress = function(){
        progressStop();
    };
    return module;
});
