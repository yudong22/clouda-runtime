define("mbaas",function(module) {
    var lightapp = this;
    var it = module.push = {};
    
    var injectScript = function (url,cb){
        var script = document.createElement('script');
        script.setAttribute('src', url);
        document.head.appendChild(script);
        script.onload = function(){
            if(cb){cb(script);}
        };
    };
    
    /**
     * @object push
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.push
     */
    
    var bind = new delegateClass("device","push","bind");
    var unbind = new delegateClass("device","push","unbind");
    var checkBindState = new delegateClass("device","push","checkBindState");
    var setTag = new delegateClass("device","push","setTag");
    var deleteTag = new delegateClass("device","push","deleteTag");
    var listTag = new delegateClass("device","push","listTag");
    var pushMsg = new delegateClass("device","push","pushMsg");
    
    
    /**
     * 注册
     *
     * @function register
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.register = function(options){
        bind(function(data){
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (data.uid){
                options.onsuccess(data);
            }else{
                lightapp.error(ErrCode.PUSH_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_GET_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    /**
     * 取消注册
     *
     * @function unregister
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregister = function(options){
        unbind(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    /**
     * checkStatus
     *
     * @function check
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.checkStatus = function(options){
        checkBindState(function(bool){
            options.onsuccess(bool);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },lightapp.ak,options);
    };
    
    it.setTag = function(tags,options){
        setTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },tags,options);
    };
    it.removeTag = function(tags,options){
        deleteTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },tags,options);
    };
    it.listTag = function(options){
        listTag(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },options);
    };
    
     /**
     * pushMsg
     *
     * @function pushMsg
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.title] 
     * @param {string} [options.description] 
     * @param {string} [options.uid] 
     * @param {string} [options.channelId] 
     * @returns null
     * 
     */
    
    it.pushMsg = function(options){
        pushMsg(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.PUSH_ERR,nativeErr,options);
        },options.uid,options.channelId,{title:options.title,description:options.description});
       
    };
    
    
    //new push service
    
    /**
     * getPushVersion
     *
     * @function register
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     */
    
    
    it.getPushVersion = function (options){
        
        //jsonp callback
        window.getPushServiceVersion = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/getPushServiceVersion?callback=getPushServiceVersion", function(script){
            document.head.removeChild(script);
        });
        
    };
    
    
    /**
     * register unicast
     *
     * @function registerUnicast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.registerUnicast = function (options){
        
        //jsonp callback
        window.cloudaPushServiceRegisterUnicast = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/bindLight?apikey=" + clouda.lightapp.ak + "&callback=cloudaPushServiceRegisterUnicast", function(script){
            document.head.removeChild(script);
        });
        
    };
    
    /**
     * unregister unicast
     *
     * @function unregisterUnicast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregisterUnicast = function (options){
        
        //jsonp callback
        window.cloudaPushServiceUnregisterUnicast = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/unbindLight?apikey=" + clouda.lightapp.ak + "&callback=cloudaPushServiceUnregisterUnicast", function(script){
            document.head.removeChild(script);
        });
        
    };
    
    /**
     * register multicast
     *
     * @function registerMulticast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {string} [options.tag]  订阅的服务所用的tag名称
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.registerMulticast = function (options){
        
        //jsonp callback
        window.cloudaPushServiceRegisteMulticast = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/subscribeService?apikey=" + clouda.lightapp.ak + "&tag=" + options.tag + "&callback=cloudaPushServiceRegisteMulticast", function(script){
            document.head.removeChild(script);
        });
        
    };
    
    /**
     * unregister multicast
     *
     * @function unregisterMulticast
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {string} [options.tag]  订阅的服务所用的tag名称
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.unregisterMulticast = function (options){
        
        //jsonp callback
        window.cloudaPushServiceUnregisterMulticast = function(data){
            if(!data.error){
                options.onsuccess(data);
            } else {
                options.onfail(data);
            }
        };
        
        injectScript("http://127.0.0.1:7777/unsubscribeService?apikey=" + clouda.lightapp.ak + "&tag=" + options.tag + "&callback=cloudaPushServiceUnregisterMulticast", function(script){
            document.head.removeChild(script);
        });
        
    };
    
});