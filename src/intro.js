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
    clouda.lightapp.error = function(){
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.log("Call lightapp api Error! " + stackStr[2].replace(/\s*/,""));
        }
    };
    //定义错误格式
    // clouda.__noSuchMethod__ = function(){
        // alert('no such method');
        // console.log(arguments);
    // };
    //__defineGetter__
    var delegateClass = function(module,submodule,func){
        this.module = module;
        this.submodule = submodule;
        this.func = func;
        return (function(that){
            return function(){
                that.run.apply(that, arguments);
            };
        })(this);
    };
    delegateClass.prototype.run = function(){
        var args = arguments;
        var _this = this;
        execDelegate(this.module,function(module){
            try{
                module[_this.submodule][_this.func].apply(_this,args);
            }catch(e){
                _this.error(_this.module+"."+_this.submodule+"."+_this.func);
            }
            
        });
    };
    delegateClass.prototype.error = function(err){
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.log(err ," Error! " + stackStr[2].replace(/\s*/,""));
        }
    };
    
    var regPlugins = {};
    var execDelegate = function(pluginName,callback){
        if (!clouda.lightapp.ak) {
            console.error("错误，'"+pluginName+"' clouda.lightapp(your_ak_here);");
            return false;
        }
        
        if (!pluginName) {
            return false;
        }
        //判断1.是否为undefined
        //判断2.是否为null，
        if (typeof regPlugins[pluginName] != 'undefined'){
            return callback(regPlugins[pluginName]);//此处是同步的逻辑
        }
        //在结果返回前，使用代理模式
        regPlugins[pluginName] = null;
        
        //此处使用require
        nuwa.pm.bindAk(clouda.lightapp.ak);
        
        nuwa.pm.absorb(pluginName,function(inst){
            inst.on('error',function(err){
                callback(null);
            });
            inst.on('progress',function(err){
                
            });
            inst.on('complete',function(err){
                regPlugins[pluginName] = nuwa.require(pluginName);
                callback(regPlugins[pluginName]);
            });
        });
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
