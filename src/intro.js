(function(window){
    // for client js only
    if (typeof window !== 'object')return ;
    
    if (typeof window.clouda === 'undefined') {
        window.clouda = {};
    }
    var clouda = window.clouda;
    
    clouda.lightapp = function(ak){
        clouda.lightapp.ak = ak;
    };
    //定义错误格式
    var ErrCode = {
        /*SUCCESS*/
        SUCCESS:0,
        
        //RUNTIME ERROR
        AK_UNDEFINED:1,
        RT_UNDEFINED:2,
        RT_GETERROR:5,
       
        EXEC_ERROR:3,
        USER_CANCEL:4,
        
        //API ERROR
        ACC_GET_ERR:6,
        LOC_GET_ERR:7,
        
        
        
    };
    var errorMessage = {
      0:"成功",
      1:"错误，您需要在调用api前设置ak。 clouda.lightapp(your_ak_here);",
      2:"接口的运行环境不存在。",
      3:"执行接口出错。",
      4:"用户取消",
      5:"接口的运行环境准备中出错。",
      6:"accelerometer 接口返回错误",
      7:"geolocation 接口返回错误",
    };
    var runtimeError  = function(errno){
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.error(errorMessage[errno] ," " + stackStr[2].replace(/\s*/,""));
        }
    };
    
    var delegateClass = function(module,submodule,func){
        this.module = module;
        this.submodule = submodule;
        this.func = func;
        return (function(that){
            return function(){
                that.exec.apply(that, arguments);
            };
        })(this);
    };
    delegateClass.prototype.exec = function(){
        var args = arguments;
        var _this = this;
        execDelegate.call(this,this.module,function(module){
            try{
                module[_this.submodule][_this.func].apply(_this,args);
            }catch(e){
                if (args.length && typeof args[args.length-1] === 'object' ){//检查 onFail
                    if (typeof args[args.length-1].onFail === 'function'){
                        args[args.length-1].onFail(ErrCode.EXEC_ERROR);
                    }
                }
                if(module){
                    _this.error(ErrCode.EXEC_ERROR);
                }
            }
            
        });
    };
    clouda.lightapp.error = delegateClass.prototype.error = runtimeError;
    
    
    var regPlugins = {};
    var execDelegate = function(pluginName,callback){
        if (!clouda.lightapp.ak) {
            this.error(ErrCode.AK_UNDEFINED);
            console.error("错误，'"+pluginName+"' clouda.lightapp(your_ak_here);");
            return false;
        }
        var _this = this;
        if (!pluginName) {
            return false;
        }
        //判断1.是否为undefined
        //判断2.是否为null，
        if (typeof regPlugins[pluginName] != 'undefined'){
            return callback(regPlugins[pluginName]);//此处是同步的逻辑
        }
        //在结果返回前，使用代理模式
        try{
            nuwa.pm.bindAk(clouda.lightapp.ak);
            
            nuwa.pm.absorb(pluginName,function(inst){
                inst.on('error',function(err){
                    _this.error(ErrCode.RT_GETERROR);
                    callback(null);
                });
                inst.on('progress',function(err){
                    
                });
                inst.on('complete',function(err){
                    regPlugins[pluginName] = nuwa.require(pluginName);
                    callback(regPlugins[pluginName]);
                });
            });
            
        }catch(e){
            _this.error(ErrCode.RT_UNDEFINED);
            callback(null);
        }
        
        return false;
    };
    /**
     * 定义执行类型，所有子文件均通过此函数进行预处理，过滤错误，支持退化
     *
     * @function define
     * @memberof 
     * @instance
     *
     * @param {string} name
     * @param {Function} bindFunction
     *
     */
    var define= function(name,bindFunction){
        var module = clouda[name];
        //执行空间在clouda.lightapp下，防止污染其他空间
        bindFunction.call(clouda.lightapp,module);
        // bindFunction.call(undefined,module);
    };
    clouda.device = {};
    clouda.mbaas = {};
    // clouda.ui={};
