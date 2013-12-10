/*! clouda-runtime - v0.1.0 - 2013-12-10 */
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
    clouda.STATUS = {
        SUCCESS:0,//在 runtimeready 后会执为1
        SYSTEM_FAILURE:-3,
        USER_CANCELED:-2
    };
    //定义错误格式
    var ErrCode = {
        //不符合预期
        UNKNOW_CALLBACK:-1,
        
        //不符合预期的input
        UNKNOW_INPUT:-1,
        
        //用户取消
        // USER_CANCEL:-2,
        
        //RUNTIME ERROR
        AK_UNDEFINED:-4,
        
        RT_GETERROR:5,
         
        EXEC_ERROR:-5,
        NOT_FINISH:-99,
        //API ERROR
        ACC_GET_ERR:6,
        LOC_GET_ERR:7,
        CAP_GET_ERR:8,
        CONTACT_FIND_ERR:9,
        GLO_ERR:10,
        REACH_ERR:11,//reachability
        MEDIA_ERR:12,
        CPS_ERROR:13,
        BTY_ERROR:14,
        QR_ERR:15,
        FS_ERR:16,
        BTY_ERR:17,
        CONNECT_ERROR:18,
        SCREEN_ERROR:19,
        FR_ERROR:20,
        PUSH_ERR:21,
        
    };
    var errorMessage = {
      0:"成功",
      "-1":"接口返回不符合预期",
      "-2":"用户取消",
      "-3":"接口的运行环境不存在。",
      "-4":"错误，您需要在调用api前设置ak。 clouda.lightapp(your_ak_here);",
      "-5":"执行接口出错。",
      "-99":"功能开发中。",
      5:"接口的运行环境准备中出错。",
      6:"accelerometer 接口返回错误",
      7:"geolocation 接口返回错误",
    };
    
    //第一个是接口层错误号，第二个是app层错误号，第三个是options，如果定义了onfail要触发
    var runtimeError  = function(errno,apperrno,options){
        //整合errno
        if (errno < 0 ){//如果是用户取消或者接口不符标准，直接覆盖传入
            apperrno = errno;
        }
        if (typeof options === 'object' && typeof options.onfail === 'function'){
            options.onfail(apperrno);
        }
        
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.error(errorMessage[errno]+ (apperrno?" app错误号"+apperrno:"")+ stackStr[2].replace(/\s*/,""));
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
        installPlugin(this.module,function(module){
            try{
                if (!_this.func){//二级目录
                    module[_this.submodule].apply(_this,args);
                }else{
                    module[_this.submodule][_this.func].apply(_this,args);
                }
            }catch(e){
                var code;
                if (!module){
                    code = clouda.STATUS.SYSTEM_FAILURE;
                }else{
                    code = ErrCode.EXEC_ERROR;
                }
                if (args.length && typeof args[args.length-1] === 'object' ){//检查 onfail
                    if (typeof args[args.length-1].onfail === 'function'){
                        args[args.length-1].onfail(code);
                    }
                }
                _this.error(code);
            }
            
        });
    };
    clouda.lightapp.error = delegateClass.prototype.error = runtimeError;
    
    //定义
    var beforeRuntimeReadyStack = [];
    document.addEventListener("runtimeready",function(){
        clouda.STATUS.SUCCESS = 1;
        if (beforeRuntimeReadyStack.length){
            for(var i=0,len=beforeRuntimeReadyStack.length;i<len;i++){
                installPlugin.apply(undefined,beforeRuntimeReadyStack[i]);
            }
            beforeRuntimeReadyStack.length = 0;
        }
    });
    var n=0; //6s后超时
    setTimeout(function(){
        n=100;//timeout!
        if (beforeRuntimeReadyStack.length){
            for(var i=0,len=beforeRuntimeReadyStack.length;i<len;i++){
                installPlugin.apply(undefined,beforeRuntimeReadyStack[i]);
            }
            beforeRuntimeReadyStack.length = 0;
        }
    },6000);
    var regPlugins = {};
    var installPlugin = function(pluginName,callback){
        if (!clouda.lightapp.ak) {
            runtimeError(ErrCode.AK_UNDEFINED);
            console.error("错误，'"+pluginName+"' clouda.lightapp(your_ak_here);");
            return false;
        }
        if ( !clouda.STATUS.SUCCESS && n < 100 ){//还没有 ready 
            beforeRuntimeReadyStack.push([pluginName,callback]);
            return;
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
        try{
            nuwa.pm.bindAk(clouda.lightapp.ak);
            
            nuwa.pm.absorb(pluginName,function(inst){
                inst.on('error',function(err){
                    runtimeError(ErrCode.RT_GETERROR);
                    callback(null);
                });
                inst.on('progress',function(percentage){
                    console.log( pluginName + ' percentage = ' + percentage);
                });
                inst.on('complete',function(err){
                    regPlugins[pluginName] = nuwa.require(pluginName);
                    callback(regPlugins[pluginName]);
                });
            });
            
        }catch(e){
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
    var define = function(name,bindFunction){
        var module = clouda[name];
        //执行空间在clouda.lightapp下，防止污染其他空间
        bindFunction.call(clouda.lightapp,module, clouda);
        // bindFunction.call(undefined,module);
    };
    clouda.device = {};
    clouda.mbaas = {};
    // clouda.ui={};
define("device",function(module) {
    var lightapp = this;
    //定义 accelerometer 空间，clouda.device.accelerometer 
     /**
     * @object accelerometer
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.accelerometer
     */
    var it = module.accelerometer = {};
    
    //需要device的accelerometer模块
    
    var getCurrentAcceleration = new delegateClass("device","accelerometer","getCurrentAcceleration");
    var watchAcceleration = new delegateClass("device","accelerometer","watchAcceleration");
    var clearWatch = new delegateClass("device","accelerometer","clearWatch");
    
    
    /**
     * 获取当前加速度，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.get = function(options){
        getCurrentAcceleration(function(obj){
            if ( typeof obj==='object' && typeof obj.x !='undefined' && typeof obj.y !='undefined' && typeof obj.z !='undefined'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.ACC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.ACC_GET_ERR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前加速度，接收成功，失败的回调和间隔
     *
     * @function listen
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认10000 ms
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        installPlugin("device", function(device) {
            start_id = device.accelerometer.watchAcceleration(function(obj){
                if ( typeof obj==='object' && typeof obj.x !='undefined' && typeof obj.y !='undefined' && typeof obj.z !='undefined'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.ACC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            }, function(error) {
               lightapp.error(ErrCode.ACC_GET_ERR,error,options);
            },options);
        });
    };
    /**
     * 终止获取回调
     *
     * @function stop
     * @memberof clouda.device.accelerometer
     * @instance
     *
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function() {
        clearWatch(start_id);
    };
    return it;
});
define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.battery = {};
    
    /**
     * @object battery
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.battery
     */
    
    var start = new delegateClass("device","batterystatus","start");
    var stop = new delegateClass("device","batterystatus","stop");
    
    it.get = function(options){
        start(function(){
            options.onsuccess.apply(this,arguments);
            stop(function(){},function(){});
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    /**
     * 已一定的频率获取电池状态
     *
     * @function startListen
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.startListen = function(options){
        start(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    /**
     * 停止获取电池状态
     *
     * @function stopListen
     * @memberof clouda.device.battery
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function(options){
        stop(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    
    return it;
});define("device",function(module) {
    var lightapp = this;
    //定义 compass 空间，clouda.device.compass 
     /**
     * @object compass
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.compass
     */
    var it = module.compass = {};
    
    //需要device的compass模块
    // var boot = ['clearWatch','getCurrentHeading','watchHeading'];
    
    var getCurrentHeading = new delegateClass("device","compass","getCurrentHeading");
    var watchHeading = new delegateClass("device","compass","watchHeading");
    var clearWatch = new delegateClass("device","compass","clearWatch");
    
    
    /**
     * 获取当前指南针坐标，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.compass
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.get = function(options){

        getCurrentHeading(function(obj){
            if ( typeof obj==='object' && typeof obj.magneticHeading !='undefined' && typeof obj.trueHeading !='undefined' ){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.CPS_ERROR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.CPS_ERROR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前指南针坐标，接收成功，失败的回调和间隔
     *
     * @function startListen
     * @memberof clouda.device.compass
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认100 ms
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        installPlugin("device", function(device) {
            start_id = device.compass.watchHeading(function(obj){
                if ( typeof obj==='object' && typeof obj.magneticHeading !='undefined' && typeof obj.trueHeading !='undefined' ){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.CPS_ERROR,ErrCode.UNKNOW_CALLBACK,options);
                }
            }, function(error) {
               lightapp.error(ErrCode.CPS_ERROR,error,options);
            });
        });
    };
    /**
     * 终止获取回调
     *
     * @function stopListen
     * @memberof clouda.device.compass
     * @instance
     * 
     * 
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function() {
        clearWatch(start_id);
    };
    return it;
});define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.connection 使用nuwa.network 
    var it = module.connection = {};
    
    /**
     * @object connection
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.connection
     */
    module.CONNECTION_STATUS = {
        UNKNOWN: "unknown",
        ETHERNET: "ethernet",
        WIFI: "wifi",
        CELL_2G: "2g",
        CELL_3G: "3g",
        CELL_4G: "4g",
        CELL:"cellular",
        NONE: "none"
    };
    
    
    it.status = module.CONNECTION_STATUS.UNKNOWN;
    
    var getInfo = new delegateClass("device","network","getInfo");
    /**
     * Launch device camera application for recording video(s).
     *
     * @function startListen
     * @memberof clouda.device.connection
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
     it.get = function(options){
         if (it.status !== module.CONNECTION_STATUS.UNKNOWN) {
              options.onsuccess(it.status);
              return;
         }
        getInfo(function(status){
           it.status = status;
           options.onsuccess.call(this,status);
           delete options.onsuccess;
        },function(nativeErr){
            lightapp.error(ErrCode.CONNECT_ERROR,nativeErr,options);
        },options);
     };
    //TODO 应该提供监听方法
    /**
     * 应该提供监听网络变化的方法
     *
     * @function startListen
     * @memberof clouda.device.connection
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    var triggerfunction = null;
    it.startListen = function(options){
        triggerfunction = options.onsuccess;
        getInfo(function(status){
           it.status = status;
           if (typeof triggerfunction === 'function'){
               triggerfunction.call(undefined,status);
           }
           triggerfunction(status);
        },function(nativeErr){
            lightapp.error(ErrCode.CONNECT_ERROR,nativeErr,options);
        },options);
    };
     /**
     * 应该提供停止监听网络变化的方法
     *
     * @function stopListen
     * @memberof clouda.device.connection
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.stopListen = function(options){
        triggerfunction = null;
    };
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 contact 空间，clouda.device.contact 支持退化
    var it = module.contact = {};
    
    /**
     * @object contact
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.contact
     */
    
    var create = new delegateClass("device","contact","create");
    var find =new delegateClass("device","contact","find");
    var findBounds = new delegateClass("device","contact","findBounds");
    
    // module.CONTACT_COLUMN={
        // ID:"id",
        // DISPLAYNAME:"displayName",
        // NICKNAME:"nickname",
        // PHONE:"phoneNumbers",
        // EMAIL:"emails",
        // ADDRESS:"addresses",
        // ORGANIZATION:"organizations",
        // BIRTHDAY:"birthday",
        // PHOTO:"photos",
        // CATEGORY:"categories",
        // IM:"ims",
        // URL:"urls",
        // NOTE:"note",
//   
    // };
    /*
     * Returns an array of Contacts matching the search criteria.
     *
     * @function find
     * @memberof clouda.device.contact
     * @instance
     *
     * @param fields that should be searched
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {string} options.filter
     * @param {boolean} options.multiple
     * @return null
     */
    it.find = function(fields,options){
        installPlugin("device", function(device) {
           
            device.contact.find(fields,function(contact_array){
                if ( Array.isArray(contact_array) ){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            },options);
        });
        
        
    };
    
    
    it.insert = function(fields, options) {
        installPlugin("device", function(device) {
            var person = device.contact.create();

            for (var i in fields) {
                person[i] = fields[i];
            }
            person.save(function() {
                options.onsuccess.apply(this, arguments);
            }, function(errno) {
                lightapp.error(ErrCode.CONTACT_FIND_ERR, errno, options);
            });
        });
    }; 

    
    it.update = function(id,fields,options){
        installPlugin("device", function(device) {
           var myoptions = {"multiple":false,"filter":id};
            device.contact.find(["*"],function(contacts){
                if (contacts && contacts[0]){
                    for (var i in fields){
                        contacts[0][i] = fields[i];
                    }
                    contacts[0].save(function(){
                        options.onsuccess.apply(this,arguments);
                    },function(errno){
                        lightapp.error(ErrCode.CONTACT_FIND_ERR,errno,options);
                    });
                }else{
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            },myoptions);
        });
    };
    
    it.remove = function(id,options){
        installPlugin("device", function(device) {
           var myoptions = {"multiple":false,"filter":id};
            device.contact.find(["*"],function(contacts){
                if (contacts && contacts[0]){
                    contacts[0].remove(function(){
                        options.onsuccess.apply(this,arguments);
                    },function(errno){
                        lightapp.error(ErrCode.CONTACT_FIND_ERR,errno,options);
                    });
                }else{
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            },myoptions);
        });
    };
    it.count = function(options){
        installPlugin("device", function(device) {
            var media = device.contact.findBounds(["id"],function(contacts){
                options.onsuccess(contacts.count);
                contacts.close(function(){},function(){});
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            });
        });
    };
    it.getCursor = function(cursorOffset,length,options){
        installPlugin("device", function(device) {
            device.contact.findBounds(["id"],function(contacts){
                contacts.get(cursorOffset, function(refs){
                    options.onsuccess(refs);
                    contacts.close(function(){},function(){});
                }, function(nativeErr){
                    lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
                }, length);
            },function(nativeErr){
                lightapp.error(ErrCode.CONTACT_FIND_ERR,nativeErr,options);
            });
        });
    };
    // it.nextCursor = function(cursorOffset,options){
        // lightapp.error(ErrCode.NOT_FINISH,ErrCode.NOT_FINISH,options);
    // };
});define("device",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.device 支持退化
    var it = module.device = {};
    
    /**
     * @object device
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.device
     */
    
    var getUuid = new delegateClass("device","getUuid");
    
   
    /**
     * 获取uuid
     *
     * @function startListen
     * @memberof clouda.device.device
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.uuid = function(options){
        getUuid(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.BTY_ERR,nativeErr,options);
        },options);
    };
    
    return it;
});define("device",function(module) {
    var lightapp = this;
    //定义 network 空间，clouda.device.reachability 使用nuwa.network 
    var it = module.fs = {};
    
    /**
     * @object fs
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.fs
     */
    
    var localDir = function(callback){
        // return "/sdcard/Baidu/"+lightapp.ak;
        installPlugin("device", function(device) {

            var fileEntry = new device.fs.fileEntry(getFileNameFromPath(link), link);
            
            device.fs.requestFileSystem(LocalFileSystem.PERSISTENT, 100000000, function(fileSystem){
                callback(fileSystem);
            }, function(){
                callback(null);
            });
            
        });
    };
    var getFileNameFromPath = function(str){
        return str.substring(str.lastIndexOf("/")+1);
    };
    //TODO
    /**
     * 上传文件
     *
     * @function postFile
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink
     * @param {string} target 要POST到的目标,如http://some.host/foo
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onprogress
     * @param {string} options.uploadKey
     */
    var fileTransfer=null;
    it.postFile = function(link,target,options) {
        installPlugin("filetransfer", function(ft) {
            ft = ft.fileTransfer;
            if (fileTransfer === null) {
                fileTransfer = new ft.FileTransfer();
                if (options.onprogress){
                    fileTransfer.onprogress = function(data){
                        options.onprogress(data.loaded/data.total);
                    };
                }
            }
            
            var opt = new ft.FileUploadOptions();
            opt.fileKey = options.uploadKey;
            opt.fileName = getFileNameFromPath(link);
            // opt.mimeType = "text/html";
            fileTransfer.upload(link, target, function(result) {
                options.onsuccess.apply(this,arguments);
            }, function(err) {
                lightapp.error(ErrCode.FS_ERR,err,options);
            }, opt,options);

        });
    };
    
     /**
     * 下载文件
     *
     * @function downloadFile
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink
     * @param {string} filename 保存到本地的文件名 
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onprogress
     */
    
 
    it.downloadFile = function(link, name, options) {
        installPlugin("filetransfer", function(ft) {
            ft = ft.fileTransfer;
            if (fileTransfer === null) {
                fileTransfer = new ft.FileTransfer();
                if (options.onprogress) {
                    fileTransfer.onprogress = function(data){
                        options.onprogress(data.loaded/data.total);
                    };
                }
            }
            //可能需要加下载路径
            localDir(function(direntry){
                if (!direntry) {
                    lightapp.error(ErrCode.FS_ERR, err, options);
                    return ;
                }
                fileTransfer.download(link, direntry.name +"/" + name, function(result) {
                    options.onsuccess.apply(this, arguments);
                }, function(err) {
                    lightapp.error(ErrCode.FS_ERR, err, options);
                },options);
            });
            
        });
    }; 
    
    /**
     * 终止
     *
     * @function abort
     * @memberof clouda.device.fs
     * @instance
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    
    it.abort = function() {
        if(fileTransfer === null){
            lightapp.error(ErrCode.FS_ERR, err, options);
        }else{
            fileTransfer.abort();
        }
    }; 
    /**
     * remove
     *
     * @function remove
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.remove = function(link,options){
       
        installPlugin("device", function(device) {

            var fileEntry = new device.fs.fileEntry(getFileNameFromPath(link), link);
            
            fileEntry.remove(function() {
               options.onsuccess.apply(this,arguments);
            }, function(error) {
               lightapp.error(ErrCode.FS_ERR,error,options);
            },options);
        });
    };
    
    it.empty = function(options){
        installPlugin("device", function(device){
            //var ld = localDir();
            localDir(function(direntry){
                var directEntry = direntry;
                directEntry.removeRecursively(function(){
                    options.onsuccess.apply(this,arguments);
                }, function(error){
                    lightapp.error(ErrCode.FS_ERR,error,options);
                },options);
            });
            
        });
    };
    
    it.getCount = function(options){
        installPlugin("device", function(device) {
            localDir(function(direntry){
                var directEntry = direntry;
                var directReader = directEntry.createReader();
                
                directReader.readEntries(function(entries){
                    options.onsuccess.call(this,entries.length);
                }, function(error){
                    lightapp.error(ErrCode.FS_ERR,error,options);
                },options);
            });
            
        });
    };
    /**
     * getInfo
     *
     * @function getInfo
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink 文件全路径
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    
    it.getInfo = function(link,options){
        installPlugin("device", function(device) {
            var fileEntry = new device.fs.fileEntry(getFileNameFromPath(link), link);
            fileEntry.file(function(fileobj){
                options.onsuccess(fileobj);
            },function(){
                lightapp.error(ErrCode.FS_ERR,ErrCode.UNKNOW_CALLBACK,options);
            });
            
        },options);
    };
    it.getInfoByOffset = function(offset,options){
        installPlugin("device", function(device) {
            localDir(function(direntry){
                var directEntry = direntry;
                var directReader = directEntry.createReader();
                directReader.readEntries(function(entries){
                    if (offset >= entries.length){
                        lightapp.error(ErrCode.FS_ERR,ErrCode.UNKNOW_CALLBACK,options);
                        return ;
                    }
                    fileEntry.file(function(fileobj){
                        options.onsuccess(fileobj);
                    },function(){
                        lightapp.error(ErrCode.FS_ERR,ErrCode.UNKNOW_CALLBACK,options);
                    });
                }, function(error){
                    lightapp.error(ErrCode.FS_ERR,error,options);
                },options);
            });
            
        },options);
    };
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 geolocation 空间，clouda.device.geolocation 支持退化
    var it = module.geolocation = {};
    
    /**
     * @object geolocation
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.geolocation
     */
    
    var getCurrentPosition = new delegateClass("device","geolocation","getCurrentPosition");
    var watchPosition = new delegateClass("device","geolocation","watchPosition");
    var clearWatch = new delegateClass("device","geolocation","clearWatch");
    
    /**
     * 获取当前地理位置，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @param {int} [options.maximumAge] 
     * @param {int} [options.timeout] 
     * @returns null
     * 
     */
    it.get = function(options){
        
        getCurrentPosition(function(obj){
            if ( typeof obj==='object' && typeof obj.latitude !='undefined' && typeof obj.longitude !='undefined' ){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.LOC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.LOC_GET_ERR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前加速度，接收成功，失败的回调和间隔
     *
     * @function startListen
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.enableHighAccuracy] 高精度
     * @param {int} [options.maximumAge] 
     * @param {int} [options.timeout] 
     * 
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(){
        installPlugin("device", function(device) {
            start_id = device.geolocation.watchPosition(function(){
                if ( typeof obj==='object' && typeof obj.latitude !='undefined' && typeof obj.longitude !='undefined' ){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.LOC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            }, function(error) {
               lightapp.error(ErrCode.LOC_GET_ERR,error,options);
            },options);
        });
    };
    
    /**
     * 终止获取回调
     *
     * @function stopListen
     * @memberof clouda.device.geolocation
     * @instance
     *
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function(){
        clearWatch(start_id);
    };
    
    return module;
});define("device",function(module) {
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
     it.getPreferredLanguage = function (options) {
        toolKit.getPreferredLanguage(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.getLocaleName = function (options) {
        toolKit.getLocaleName(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.dateToString = function (date, options) {
        toolKit.dateToString(date,options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.stringToDate = function (dateString, options) {
        toolKit.stringToDate(dateString,options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.getDatePattern = function (options) {
        toolKit.getDatePattern(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.getDateNames = function (options) {
        toolKit.getDateNames(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.isDayLightSavingsTime = function (date, options) {
        toolKit.isDayLightSavingsTime(date,options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.getFirstDayOfWeek = function (options) {
        toolKit.getFirstDayOfWeek(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.numberToString = function (number, options) {
        toolKit.numberToString(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.stringToNumber = function (numberString, options) {
        toolKit.stringToNumber(numberString,options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.getNumberPattern = function (options) {
        toolKit.getNumberPattern(options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
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
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     */
    it.getCurrencyPattern = function (currencyCode, options) {
        toolKit.getCurrencyPattern(currencyCode,options.onsuccess,function(){
            if (options && typeof options.onfail == 'function'){
                options.onfail(ErrCode.GLO_ERR);
            }else{
                lightapp.error(ErrCode.GLO_ERR);
            }
        },options);
    };
    
    return module;
});define("device",function(module) {
    var lightapp = this;
    //定义 gyro 空间，clouda.device.gyro 
     /**
     * @object gyro
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.gyro
     */
    var it = module.gyro = {};
    
    //需要device的gyro模块
    
    var getCurrentAcceleration = new delegateClass("device","orientation","getCurrentDeviceOrientation");
    // var watchDeviceOrientation = new delegateClass("device","orientation","watchDeviceOrientation");
    var clearWatch = new delegateClass("device","orientation","clearWatch");
    
    
    /**
     * 获取当前角度，接收成功和失败的回调
     *
     * @function get
     * @memberof clouda.device.gyro
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.get = function(options){
        getCurrentAcceleration(function(obj){
            if ( typeof obj==='object' && typeof obj.alpha !='undefined' && typeof obj.beta !='undefined' && typeof obj.gamma !='undefined'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.ACC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.ACC_GET_ERR,nativeErr,options);
        },options);
    };
    
    /**
     * 已一定的频率，获取当前角度，接收成功，失败的回调和间隔
     *
     * @function startListen
     * @memberof clouda.device.gyro
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调 
     * @param {function} [options.onfail] 失败的回调
     * @param {number} [options.frequency] 检查的间隔，默认10000 ms
     * @returns null
     * 
     */
    var start_id;
    it.startListen = function(options){
        installPlugin("device", function(device) {
            start_id = device.orientation.watchDeviceOrientation(function(obj){
                if ( typeof obj==='object' && typeof obj.alpha !='undefined' && typeof obj.beta !='undefined' && typeof obj.gamma !='undefined'){
                    options.onsuccess.apply(this,arguments);
                }else{
                    lightapp.error(ErrCode.ACC_GET_ERR,ErrCode.UNKNOW_CALLBACK,options);
                }
            }, function(error) {
               lightapp.error(ErrCode.ACC_GET_ERR,error,options);
            },options);
        });
    };
    /**
     * 终止获取回调
     *
     * @function stopListen
     * @memberof clouda.device.gyro
     * @instance
     *
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.stopListen = function() {
        clearWatch(start_id);
    };
    return it;
});
define("device",function(module) {
    var lightapp = this;
    //定义 localStorage 空间，clouda.device.localStorage 支持退化
    var it = module.localStorage = {};
    
    /**
     * @object localStorage
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.localStorage
     */
    
    
    it.set = function(){
        window.localStorage.setItem.apply(this,arguments);
    };
    it.get = function(){
        window.localStorage.getItem.apply(this,arguments);
    };
    it.remove = function(){
        window.localStorage.removeItem.apply(this,arguments);
    };
    it.count = function(options){
        if (typeof options.onsuccess === 'function'){
            options.onsuccess(window.localStorage.length);
        }else{
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
        }
    };
    it.clean = function(){
        window.localStorage.clear();
    };
});define("device",function(module) {
    var lightapp = this;
    //定义 camera 空间，clouda.device.media 支持退化
    var it = module.media = {};
    /**
     * @object media
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.media
     */
    
    module.MEDIA_DESTINATION={};
    module.MEDIA_ENCODEING={};
    module.MEDIA_TYPE={};
    module.MEDIA_SOURCE={};
    module.MEDIA_DIRECTION={};
    
    //定义类型
    module.MEDIA_DESTINATION.DATA_URL = 0;
    module.MEDIA_DESTINATION.FILE_URI = 1;
    module.MEDIA_DESTINATION.NATIVE_URI = 2;
    
    module.MEDIA_ENCODEING.JPEG = 0;
    module.MEDIA_ENCODEING.PNG = 1;
    
    module.MEDIA_TYPE.PICTURE = 0;
    module.MEDIA_TYPE.VIDEO = 1;
    module.MEDIA_TYPE.ALLMEDIA = 2; //for function getPicture only
    module.MEDIA_TYPE.AUDIO = 3; //for function captureMedia only
    
    
    module.MEDIA_SOURCE.PHOTOLIBRARY = 0;
    module.MEDIA_SOURCE.CAMERA = 1;
    
    module.MEDIA_DIRECTION.BACK = 0;
    module.MEDIA_DIRECTION.FRONT = 1;
    
    module.MEDIA_STATUS = {
        NONE : 0,
        STARTING : 1,
        RUNNING : 2,
        PAUSED : 3,
        STOPPED : 4
    };
     
    var getPicture = new delegateClass("device","camera","getPicture");
    // var cleanup = new delegateClass("device","camera","cleanup");
    var captureAudio = new delegateClass("device","capture","captureAudio");
    var captureImage = new delegateClass("device","capture","captureImage");
    var captureVideo = new delegateClass("device","capture","captureVideo");
    
    
    /**
     * 启动canema，支持读取手机图库或者拍照
     *
     * @function getPicture
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options 可定义
     * @param {function} options.onsuccess 成功
     * @param {function} options.onfail 失败
     * @param {number} [options.quality] 
     * @param {number} [options.destinationType]
     * @param {number} [options.sourceType] 
     * @param {number} [options.mediaType]
     * @param {number} [options.mediaDirection]
     * @param {number} [options.encodingType]
     * @param {boolen} [options.saveToPhotoAlbum] 
     * @returns null
     * 
     */
    
    // it.getPicture = function(options){
        // getPicture(function(imageData){//success callback
            // if (typeof imageData=='string'){
                // options.onsuccess.apply(this,arguments);
            // }else{
                // lightapp.error(ErrCode.MEDIA_ERR,ErrCode.UNKNOW_CALLBACK,options);
            // }
//             
        // },function(nativeErr){
            // lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
        // },options);
    // };
    
    /**
     *
     * Launch audio recorder application for recording audio clip(s).
     *
     * @function captureMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {int} options.mediaType=clouda.device.MEDIA_TYPE.PICTURE
     * @param {int} [options.limit=1]
     * @param {int} [options.duration=0]
     * @returns null
     * 
     */
    
    it.captureMedia = function(options){
        var func;
        if (options.mediaType == clouda.device.MEDIA_TYPE.VIDEO){
            func=captureVideo;
        }else if (options.mediaType == clouda.device.MEDIA_TYPE.AUDIO){
            func=captureAudio;
        }else{//默认 MEDIA_TYPE.PICTURE
            func=captureImage;
        }
        func(function(mediaFile){
            if (mediaFile && typeof mediaFile=='object'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.MEDIA_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
        },options);
    };
    
     /**
     *
     * create mediafile by link
     *
     * @function createMedia
     * @memberof clouda.device.media
     * @instance
     *
     * @param {string} link
     * @param {string} operater
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onstatus
     * @param {float} sound 设置声音大小 最大1.0 仅限(setVolume)
     * @param {int} time 从开始到的毫秒数 仅限(getDuration)
     * @returns null
     * 
     */
    var media={};
    it.operateMedia = function(link,operater,options){
        installPlugin("device", function(device) {
            if (!media[link]){
                media[link] = new device.Media(link,function(id){
                    //options.onsuccess(media);
                },function(nativeErr){
                    delete media[link];
                    lightapp.error(ErrCode.MEDIA_ERR,nativeErr,options);
                },options.onstatus);
            }
            switch(operater){
                case "getCurrentPosition":
                    media[link][operater].call(media[link],options.onsuccess,options.onfail);
                    break;
                case "getDuration":
                    var duration = media[link][operater]();
                    if (duration > -1) {
                        options.onsuccess(duration);
                    }else{
                        options.onfail(duration);
                    }
                    break;
                case "seekTo":
                    media[link][operater](options.time);
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                case "setVolume":
                    media[link][operater](options.sound);
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                case "play":
                case "pause":
                case "release":
                case "startRecord":
                case "stopRecord":
                case "stop":
                    media[link][operater]();
                    options.onsuccess(clouda.STATUS.SUCCESS);
                    break;
                
            }
            
            
        });
    };
    /*
        media.getCurrentPosition: Returns the current position within an audio file.

        media.getDuration: Returns the duration of an audio file.
        
        media.play: Start or resume playing an audio file.
        
        media.pause: Pause playback of an audio file.
        
        media.release: Releases the underlying operating system's audio resources.
        
        media.seekTo: Moves the position within the audio file.
        
        media.setVolume: Set the volume for audio playback.
        
        media.startRecord: Start recording an audio file.
        
        media.stopRecord: Stop recording an audio file.
        
        media.stop: 
     * 
     * 
     * */
    return module;
});define("device",function(module) {
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
    it.progress = function(title,msg,options){
        progressStart(title,msg);
    };
    
    return module;
});
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
     * @memberof clouda.device.qr
     * @instance
     *
     * @param {string} 要生成的文字
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {int} [options.animate] 
     * @param {string} [options.backgroundUrl] 
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
});define("device",function(module) {
    var lightapp = this;
    var it = module.screen = {};
    
    /**
     * @object screen
     * @memberof clouda.device
     * @instance
     * @namespace clouda.device.screen
     */
    
    var takeScreenshot = new delegateClass("device","sharescreenshot","takeScreenshot");
    var sharePicture = new delegateClass("device","sharescreenshot","sharePicture");
    var shareScreenshot = new delegateClass("device","sharescreenshot","shareScreenshot");
    
    /**
     * 截屏
     *
     * @function captureScreen
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.captureScreen = function(options) {
        takeScreenshot(function(base64jpeg){
            options.onsuccess(base64jpeg);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
    /**
     * 分享
     *
     * @function shareImage
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {imgData} base64imgData 图片
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.shareImage = function(imgData,options) {
        sharePicture(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        },imgData);
    };
    
    /**
     * 截屏+分享
     *
     * @function shareScreen
     * @memberof clouda.device.screen
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.shareScreen = function(options) {
        shareScreenshot(function(){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(error) {
            lightapp.error(ErrCode.SCREEN_ERROR,error,options);
        });
    };
    
});define("touch",function(module, clouda) {
    
    var touch = touch || {};
    
    (function(doc, exports) {
        'use strict';
        var os = (function() {
            var navigator = window.navigator,
            userAgent = navigator.userAgent,
            android = userAgent.match(/(Android)[\s\/]+([\d\.]+)/),
            ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
            wp = userAgent.match(/(Windows\s+Phone)\s([\d\.]+)/),
            isWebkit = /WebKit\/[\d.]+/i.test(userAgent),
            isSafari = ios ? (navigator.standalone ? isWebkit: (/Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/MQQBrowser/i.test(userAgent))) : false,
            os = {};

            if (android) {
                os.android = true;
                os.version = android[2];
            }
            if (ios) {
                os.ios = true;
                os.version = ios[2].replace(/_/g, '.');
                os.ios7 = /^7/.test(os.version);
                if (ios[1] === 'iPad') {
                    os.ipad = true;
                } else if (ios[1] === 'iPhone') {
                    os.iphone = true;
                    os.iphone5 = screen.height == 568;
                } else if (ios[1] === 'iPod') {
                    os.ipod = true;
                }
            }
            if (wp) {
                os.wp = true;
                os.version = wp[2];
                os.wp8 = /^8/.test(os.version);
            }
            if (isWebkit) {
                os.webkit = true;
            }
            if (isSafari) {
                os.safari = true;
            }

            return os;
        })();

        var PCevts = {
            'touchstart': 'mousedown',
            'touchmove': 'mousemove',
            'touchend': 'mouseup',
            'touchcancel': 'mouseout'
        };

        var utils = {
            getType: function(obj) {
                return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
            },
            getSelector: function(el) {
                if (el.id) {
                    return "#" + el.id;
                }
                if (el.className) {
                    var cns = el.className.split(/\s+/);
                    return "." + cns.join(".");
                } else {
                    return el.tagName.toLowerCase();
                }
            },
            matchSelector: function(target, selector) {
                return target.webkitMatchesSelector(selector);
            },
            getEventListeners: function(el) {
                return el.listeners;
            },
            getPCevts: function(evt) {
                return PCevts[evt] || evt;
            },
            forceReflow: function() {
                var domTreeOpDiv = document.getElementById("domTreeOp");
                if (!domTreeOpDiv) {
                    domTreeOpDiv = document.createElement("div");
                    domTreeOpDiv.id = "domTreeOp";
                    document.body.appendChild(domTreeOpDiv);
                }
                var parentNode = domTreeOpDiv.parentNode;
                var nextSibling = domTreeOpDiv.nextSibling;
                parentNode.removeChild(domTreeOpDiv);
                parentNode.insertBefore(domTreeOpDiv, nextSibling);
            }
        };

        /** 底层事件绑定/代理支持  */
        var proxyid = 0;
        var proxies = [];
        var _trigger = function(el, evt, detail) {

            detail = detail || {};
            var e,
                opt = {
                bubbles: true,
                cancelable: true,
                detail: detail
            };

            if (typeof CustomEvent !== 'undefined') {
                e = new CustomEvent(evt, opt);
                if (el) {
                    el.dispatchEvent(e);
                }
            } else {
                e = document.createEvent("CustomEvent");
                e.initCustomEvent(evt, true, true, detail);
                if (el) {
                    el.dispatchEvent(e);
                }
            }

        };

        /**
             * {DOM} element
             * {String} eventName
             * {Function} handler
             */
        var _bind = function(el, evt, handler) {
            el.listeners = el.listeners || {};

            if (!el.listeners[evt]) {
                el.listeners[evt] = [handler];
            } else {
                el.listeners[evt].push(handler);
            }
            var proxy = function(e) {
                if (os.ios7) {
                    utils.forceReflow();
                }
                e.originEvent = e;
                e.startRotate = function() {
                    __rotation_single_finger = true;
                };
                for (var p in e.detail) {
                    e[p] = e.detail[p];
                }
                handler.call(e.target, e);
            };

            handler.proxy = handler.proxy || {};
            if (!handler.proxy[evt]) {
                handler.proxy[evt] = [proxyid++];
            } else {
                handler.proxy[evt].push(proxyid++);
            }
            proxies.push(proxy);

            if( el.addEventListener){ el.addEventListener(evt, proxy, false); }
        };

        /**
             * {DOM} element
             * {String} eventName
             * {Function} the same handler of _bind
             */
        var _unbind = function(el, evt, handler) {
            if (!handler) {
                var handlers = el.listeners[evt];
                if (handlers && handlers.length) {
                    handlers.forEach(function(handler) {
                        el.removeEventListener(evt, handler, false);
                    });
                }
            } else {
                var proxyids = handler.proxy[evt];
                if (proxyids && proxyids.length) {
                    proxyids.forEach(function(proxyid) {
                        if (el.removeEventListener) {
                            el.removeEventListener(evt, proxies[proxyid], false);
                        }
                    });
                }
            }
        };

        /**
             * {DOM} delegate element
             * {String} eventName
             * {String} selector of sub elements
             * {Function} handler
             */
        var _delegate = function(el, evt, sel, handler) {
            var proxy = function(e) {
                var target;
                e.originEvent = e;
                e.startRotate = function() {
                    __rotation_single_finger = true;
                };
                for (var p in e.detail) {
                    e[p] = e.detail[p];
                }
                var integrateSelector = utils.getSelector(el) + " " + sel;
                var match = utils.matchSelector(e.target, integrateSelector);
                var ischild = utils.matchSelector(e.target, integrateSelector + " " + e.target.nodeName);
                if (!match && ischild) {
                    if (os.ios7) {
                        utils.forceReflow();
                    }
                    target = e.target;
                    while (!utils.matchSelector(target, integrateSelector)) {
                        target = target.parentNode;
                    }
                    handler.call(target, e);
                } else {
                    if (os.ios7) {
                        utils.forceReflow();
                    }
                    if (match || ischild) {
                        handler.call(e.target, e);
                    }
                }
            };

            handler.proxy = handler.proxy || {};
            if (!handler.proxy[evt]) {
                handler.proxy[evt] = [proxyid++];
            } else {
                handler.proxy[evt].push(proxyid++);
            }
            proxies.push(proxy);

            el.listeners = el.listeners || {};
            if (!el.listeners[evt]) {
                el.listeners[evt] = [proxy];
            } else {
                el.listeners[evt].push(proxy);
            }
            if(el.addEventListener){el.addEventListener(evt, proxy, false);}
        };

        /**
             * {DOM} delegate element
             * {String} eventName
             * {String} selector of sub elements
             * {Function} the same handler of _on
             */
        var _undelegate = function(el, evt, sel, handler) {
            if (!handler) {
                var listeners = el.listeners[evt];
                listeners.forEach(function(proxy) {
                    el.removeEventListener(evt, proxy, false);
                });
            } else {
                var proxyids = handler.proxy[evt];
                if (proxyids.length) {
                    proxyids.forEach(function(proxyid) {
                        if (el.removeEventListener) {
                            el.removeEventListener(evt, proxies[proxyid], false);
                        }
                    });
                }
            }
        };

        /** 手势识别 */
        var config = {
            tap: true,
            doubleTap: true,
            tapMaxDistance: 10,
            hold: true,
            holdTime: 650,
            //ms
            maxDoubleTapInterval: 300,

            //swipe
            swipe: true,
            swipeTime: 300,
            swipeMinDistance: 18,
            swipeFactor: 5,

            drag: true,
            //pinch config, minScaleRate与minRotationAngle先指定为0
            pinch: true,
            minScaleRate: 0,
            minRotationAngle: 0
        };

        var _hasTouch = ('ontouchstart' in window);
        var smrEventList = {
            TOUCH_START: 'touchstart',
            TOUCH_MOVE: 'touchmove',
            TOUCH_END: 'touchend',
            TOUCH_CANCEL: 'touchcancel',

            MOUSE_DOWN: 'mousedown',
            MOUSE_MOVE: 'mousemove',
            MOUSE_UP: 'mouseup',

            CLICK: 'click',

            //PINCH TYPE EVENT NAMES
            PINCH_START: 'pinchstart',
            PINCH_END: 'pinchend',
            PINCH: 'pinch',
            PINCH_IN: 'pinchin',
            PINCH_OUT: 'pinchout',

            ROTATION_LEFT: 'rotateleft',
            ROTATION_RIGHT: 'rotateright',
            ROTATION: 'rotate',

            SWIPE_START: 'swipestart',
            SWIPING: 'swiping',
            SWIPE_END: 'swipeend',
            SWIPE_LEFT: 'swipeleft',
            SWIPE_RIGHT: 'swiperight',
            SWIPE_UP: 'swipeup',
            SWIPE_DOWN: 'swipedown',
            SWIPE: 'swipe',

            DRAG: 'drag',

            //HOLD AND TAP  
            HOLD: 'hold',
            TAP: 'tap',
            DOUBLE_TAP: 'doubletap'
        };

        /**
             * 获取事件的位置信息
             * @param  ev, 原生事件对象
             * @return array  [{ x: int, y: int }]
             */
        function getPosOfEvent(ev) {
            //多指触摸， 返回多个手势位置信息
            if (_hasTouch) {
                var posi = [];
                var src = null;

                for (var t = 0, len = ev.touches.length; t < len; t++) {
                    src = ev.touches[t];
                    posi.push({
                        x: src.pageX,
                        y: src.pageY
                    });
                }
                return posi;
            } //处理PC浏览器的情况
            else {
                return [{
                    x: ev.pageX,
                    y: ev.pageY
                }];
            }
        }
        /**
             *获取两点之间的距离
             */
        function getDistance(pos1, pos2) {
            var x = pos2.x - pos1.x,
            y = pos2.y - pos1.y;
            return Math.sqrt((x * x) + (y * y));
        }

        /**
             *计算事件的手势个数
             *@param ev {Event}
             */
        function getFingers(ev) {
            return ev.touches ? ev.touches.length: 1;
        }
        //计算收缩的比例
        function calScale(pstart, pmove) {
            if (pstart.length >= 2 && pmove.length >= 2) {
                var disStart = getDistance(pstart[1], pstart[0]);
                var disEnd = getDistance(pmove[1], pmove[0]);

                return disEnd / disStart;
            }
            return 1;
        }

        //return 角度，范围为{-180-0，0-180}， 用来识别swipe方向。
        function getAngle(p1, p2) {
            return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        }
        //return 角度， 范围在{0-180}， 用来识别旋转角度
        function _getAngle180(p1, p2) {
            var agl = Math.atan((p2.y - p1.y) * -1 / (p2.x - p1.x)) * (180 / Math.PI);
            return (agl < 0 ? (agl + 180) : agl);
        }

        //根据角度计算方位 
        //@para agl {int} 是调用getAngle获取的。
        function getDirectionFromAngle(agl) {
            var directions = {
                up: agl < -45 && agl > -135,
                down: agl >= 45 && agl < 135,
                left: agl >= 135 || agl <= -135,
                right: agl >= -45 && agl <= 45
            };
            for (var key in directions) {
                if (directions[key]) return key;
            }
            return null;
        }

        //取消事件的默认行为和冒泡
        function preventDefault(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        function getXYByElement(el) {
            var left = 0,
            top = 0;

            while (el.offsetParent) {
                left += el.offsetLeft;
                top += el.offsetTop;
                el = el.offsetParent;
            }
            return {
                left: left,
                top: top
            };
        }

        function reset() {
            startEvent = moveEvent = endEvent = null;
            __tapped = __touchStart = startSwiping = startPinch = false;
            startDrag = false;
            pos = {};
            __rotation_single_finger = false;
        }

        function isTouchStart(ev) {
            return (ev.type === 'touchstart' || ev.type === 'mousedown');
        }
        function isTouchMove(ev) {
            return (ev.type === 'touchmove' || ev.type === 'mousemove');
        }
        function isTouchEnd(ev) {
            return (ev.type === 'touchend' || ev.type === 'mouseup' || ev.type === 'touchcancel');
        }

        var pos = {
            start: null,
            move: null,
            end: null
        };
        var startTime = 0;
        var fingers = 0;
        var startEvent = null;
        var moveEvent = null;
        var endEvent = null;
        var startSwiping = false;
        var startPinch = false;
        var startDrag = false;

        var __offset = {};
        var __touchStart = false;
        var __holdTimer = null;
        var __tapped = false;
        var __lastTapEndTime = null;

        var __scale_last_rate = 1;
        var __rotation_single_finger = false;
        var __rotation_single_start = []; //元素坐标中心位置
        var __initial_angle = 0;
        var __rotation = 0;

        var __prev_tapped_end_time = 0;
        var __prev_tapped_pos = null;

        var gestures = {
            _getAngleDiff: function(currentPos) {
                var diff = parseInt(__initial_angle - _getAngle180(currentPos[0], currentPos[1]), 10);
                var count = 0;

                while (Math.abs(diff - __rotation) > 90 && count++<50) {
                    if (__rotation < 0) {
                        diff -= 180;
                    } else {
                        diff += 180;
                    }
                }
                __rotation = parseInt(diff, 10);
                return __rotation;
            },
            pinch: function(ev) {
                var el = ev.target;
                if (config.pinch) {
                    //touchend进入此时的getFinger(ev) < 2
                    if (!__touchStart) return;
                    if (getFingers(ev) < 2) {
                        if (!isTouchEnd(ev)) return;
                    }
                    var scale = calScale(pos.start, pos.move);
                    var rotation = this._getAngleDiff(pos.move);
                    var eventObj = {
                        type: '',
                        originEvent: ev,
                        scale: scale,
                        rotation: rotation,
                        direction: (rotation > 0 ? 'right': 'left'),
                        fingersCount: getFingers(ev)
                    };
                    if (!startPinch) {
                        startPinch = true;
                        eventObj.fingerStatus = "start";
                        _trigger(el, smrEventList.PINCH_START, eventObj);
                    } else if (isTouchMove(ev)) {
                        eventObj.fingerStatus = "move";
                    } else if (isTouchEnd(ev)) {
                        eventObj.fingerStatus = "end";
                        _trigger(el, smrEventList.PINCH_END, eventObj);
                        reset();
                    }

                    _trigger(el, smrEventList.PINCH, eventObj);

                    if (Math.abs(1 - scale) > config.minScaleRate) {
                        var scaleEv = _utils.deepCopy(eventObj);

                        //手势放大, 触发pinchout事件
                        var scale_diff = 0.00000000001; //防止touchend的scale与__scale_last_rate相等，不触发事件的情况。
                        if (scale > __scale_last_rate) {
                            __scale_last_rate = scale - scale_diff;
                            _trigger(el, smrEventList.PINCH_OUT, scaleEv, false);
                        } //手势缩小,触发pinchin事件
                        else if (scale < __scale_last_rate) {
                            __scale_last_rate = scale + scale_diff;
                            _trigger(el, smrEventList.PINCH_IN, scaleEv, false);
                        }

                        if (isTouchEnd(ev)) {
                            __scale_last_rate = 1;
                        }
                    }

                    if (Math.abs(rotation) > config.minRotationAngle) {
                        var rotationEv = _utils.deepCopy(eventObj), eventType;

                        eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT: smrEventList.ROTATION_LEFT;
                        _trigger(el, eventType, rotationEv, false);
                        _trigger(el, smrEventList.ROTATION, eventObj);
                    }

                }
            },
            rotateSingleFinger: function(ev) {
                var el = ev.target;
                if (__rotation_single_finger && getFingers(ev) < 2) {
                    if (!pos.move) return;
                    if (__rotation_single_start.length < 2) {
                        var docOff = getXYByElement(el);

                        __rotation_single_start = [{
                            x: docOff.left + el.offsetWidth / 2,
                            y: docOff.top + el.offsetHeight / 2
                        },
                        pos.move[0]];
                        __initial_angle = parseInt(_getAngle180(__rotation_single_start[0], __rotation_single_start[1]), 10);
                    }
                    var move = [__rotation_single_start[0], pos.move[0]];
                    var rotation = this._getAngleDiff(move);
                    var eventObj = {
                        type: '',
                        originEvent: ev,
                        rotation: rotation,
                        direction: (rotation > 0 ? 'right': 'left'),
                        fingersCount: getFingers(ev)
                    };

                    if (isTouchMove(ev)) {
                        eventObj.fingerStatus = "move";
                    } else if (isTouchEnd(ev) || ev.type === 'mouseout') {
                        eventObj.fingerStatus = "end";
                        _trigger(el, smrEventList.PINCH_END, eventObj);
                        reset();
                    }

                    var eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT: smrEventList.ROTATION_LEFT;
                    _trigger(el, eventType, eventObj);
                    _trigger(el, smrEventList.ROTATION, eventObj);
                }
            },
            swipe: function(ev) {
                //目前swipe只存在一个手势上
                var el = ev.target;
                if (!__touchStart || !pos.move || getFingers(ev) > 1) {
                    return;
                }

                var now = Date.now();
                var touchTime = now - startTime;
                var distance = getDistance(pos.start[0], pos.move[0]);
                var position = {
                    x: pos.move[0].x - __offset.left,
                    y: pos.move[0].y - __offset.top
                };
                var angle = getAngle(pos.start[0], pos.move[0]);
                var direction = getDirectionFromAngle(angle);
                var touchSecond = touchTime / 1000;
                var factor = ((10 - config.swipeFactor) * 10 * touchSecond * touchSecond);
                var eventObj = {
                    type: smrEventList.SWIPE,
                    //DEFAULT: smrEventList.SWIPE event.
                    originEvent: ev,
                    position: position,
                    direction: direction,
                    distance: distance,
                    distanceX: pos.move[0].x - pos.start[0].x,
                    distanceY: pos.move[0].y - pos.start[0].y,
                    angle: angle,
                    duration: touchTime,
                    fingersCount: getFingers(ev),
                    factor: factor
                };
                if (config.swipe) {
                    var swipeTo = function() {
                        var elt = smrEventList;
                        switch (direction) {
                        case 'up':
                            _trigger(el, elt.SWIPE_UP, eventObj);
                            break;
                        case 'down':
                            _trigger(el, elt.SWIPE_DOWN, eventObj);
                            break;
                        case 'left':
                            _trigger(el, elt.SWIPE_LEFT, eventObj);
                            break;
                        case 'right':
                            _trigger(el, elt.SWIPE_RIGHT, eventObj);
                            break;
                        }
                    };

                    if (!startSwiping) {
                        eventObj.fingerStatus = eventObj.swipe = 'start';
                        startSwiping = true;
                        _trigger(el, smrEventList.SWIPE_START, eventObj);
                    } else if (isTouchMove(ev)) {
                        eventObj.fingerStatus = eventObj.swipe = 'move';
                        _trigger(el, smrEventList.SWIPING, eventObj);

                        if (touchTime > config.swipeTime && touchTime < config.swipeTime + 50 && distance > config.swipeMinDistance) {
                            swipeTo();
                            _trigger(el, smrEventList.SWIPE, eventObj, false);
                        }
                    } else if (isTouchEnd(ev) || ev.type === 'mouseout') {
                        eventObj.fingerStatus = eventObj.swipe = 'end';
                        _trigger(el, smrEventList.SWIPE_END, eventObj);

                        if (config.swipeTime > touchTime && distance > config.swipeMinDistance) {
                            swipeTo();
                            _trigger(el, smrEventList.SWIPE, eventObj, false);
                        }
                    }
                }

                if (config.drag) {
                    if (!startDrag) {
                        eventObj.fingerStatus = eventObj.swipe = 'start';
                        startDrag = true;
                    } else if (isTouchMove(ev)) {
                        eventObj.fingerStatus = eventObj.swipe = 'move';
                    } else if (isTouchEnd(ev)) {
                        eventObj.fingerStatus = eventObj.swipe = 'end';
                    }
                    _trigger(el, smrEventList.DRAG, eventObj);
                }
            },
            tap: function(ev) {
                var el = ev.target;
                if (config.tap) {
                    var now = Date.now();
                    var touchTime = now - startTime;
                    var distance = getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);

                    clearTimeout(__holdTimer); //去除hold事件
                    var isDoubleTap = (function() {
                        if (__prev_tapped_pos && config.doubleTap && (startTime - __prev_tapped_end_time) < config.maxDoubleTapInterval) {
                            var doubleDis = getDistance(__prev_tapped_pos, pos.start[0]);
                            if (doubleDis < 16) return true;
                        }
                        return false;
                    })();

                    if (isDoubleTap) {
                        _trigger(el, smrEventList.DOUBLE_TAP, {
                            type: smrEventList.DOUBLE_TAP,
                            originEvent: ev,
                            position: pos.start[0]
                        });
                        return;
                    }

                    if (config.tapMaxDistance < distance) return;

                    if (config.holdTime > touchTime && getFingers(ev) <= 1) {
                        //clearTimeout在ios上有时不work（alert引起的）， 先用__tapped顶一下
                        __tapped = true;
                        __prev_tapped_end_time = now;
                        __prev_tapped_pos = pos.start[0];
                        
                        _trigger(el, smrEventList.TAP, {
                            type: smrEventList.TAP,
                            originEvent: ev,
                            fingersCount: getFingers(ev),
                            position: pos.start[0]
                        });

                    }
                }
            },
            hold: function(ev) {
                var el = ev.target;
                if (config.hold) {
                    clearTimeout(__holdTimer);

                    __holdTimer = setTimeout(function() {
                        if (!pos.start) return;
                        var distance = getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);
                        if (config.tapMaxDistance < distance) return;

                        if (!__tapped) {
                            _trigger(el, "hold", {
                                type: 'hold',
                                originEvent: ev,
                                fingersCount: getFingers(ev),
                                position: pos.start[0]
                            });
                        }
                    },
                    config.holdTime);
                }
            }
        };

        var handlerOriginEvent = function(ev) {

            var el = ev.target;
            switch (ev.type) {
            case 'touchstart':
            case 'mousedown':
                //__rotation_single_finger = false;
                __rotation_single_start = [];
                __touchStart = true;
                if (!pos.start || pos.start.length < 2) {
                    pos.start = getPosOfEvent(ev);
                }
                if (getFingers(ev) >= 2) {
                    __initial_angle = parseInt(_getAngle180(pos.start[0], pos.start[1]), 10);
                }

                startTime = Date.now();
                startEvent = ev;
                __offset = {};

                //来自jquery offset的写法: https://github.com/jquery/jquery/blob/master/src/offset.js
                var box = el.getBoundingClientRect();
                var docEl = document.documentElement;
                __offset = {
                    top: box.top + (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0),
                    left: box.left + (window.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0)
                };

                gestures.hold(ev);
                break;
            case 'touchmove':
            case 'mousemove':
                if (!__touchStart || !pos.start) return;
                pos.move = getPosOfEvent(ev);
                if (getFingers(ev) >= 2) {
                    gestures.pinch(ev);
                } else if (__rotation_single_finger) {
                    gestures.rotateSingleFinger(ev);
                } else {
                    gestures.swipe(ev);
                }
                break;
            case 'touchend':
            case 'touchcancel':
            case 'mouseup':
            case 'mouseout':
                if (!__touchStart) return;
                endEvent = ev;

                if (startPinch) {
                    gestures.pinch(ev);
                } else if (__rotation_single_finger) {
                    gestures.rotateSingleFinger(ev);
                } else if (startSwiping) {
                    gestures.swipe(ev);
                } else {
                    gestures.tap(ev);
                }

                reset();
                __initial_angle = 0;
                __rotation = 0;
                if (ev.touches && ev.touches.length === 1) {
                    __touchStart = true;
                    __rotation_single_finger = true;
                }
                break;
            }
        };

        /**
            开发者接口
            usage:
                touch.on("#test", "tap swipeleft swiperight", handler);
                touch.trigger("#test", "tap");
                touch.off("#test", "tap swipeleft swiperight", handler);
             */
        var _on = function() {

            var evts, handler, evtMap, sel, args = arguments;
            if (args.length < 2 || args > 4) {
                return console.error("unexpected arguments!");
            }
            var els = utils.getType(args[0]) === 'string' ? doc.querySelectorAll(args[0]) : args[0];
            els = els.length ? Array.prototype.slice.call(els) : [els];
            //事件绑定
            if (args.length === 3 && utils.getType(args[1]) === 'string') {
                evts = args[1].split(" ");
                handler = args[2];
                evts.forEach(function(evt) {
                    if (!_hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    els.forEach(function(el) {
                        _bind(el, evt, handler);
                    });
                });
                return;
            }
            
            function evtMapDelegate( evt ){
                 if (!_hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                els.forEach(function(el) {
                    _delegate(el, evt, sel, evtMap[evt]);
                });
            }
            //mapEvent delegate
            if (args.length === 3 && utils.getType(args[1]) === 'object') {
                evtMap = args[1];
                sel = args[2];
                for (var evt1 in evtMap) {
                   evtMapDelegate(evt1);
                }
                return;
            }
            
            function evtMapBind(evt){
                if (!_hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                els.forEach(function(el) {
                    _bind(el, evt, evtMap[evt]);
                });
            }
            
            //mapEvent bind
            if (args.length === 2 && utils.getType(args[1]) === 'object') {
                evtMap = args[1];
                for (var evt2 in evtMap) {
                    evtMapBind(evt2);
                }
                return;
            }

            //兼容factor config
            if (args.length === 4 && utils.getType(args[2]) === "object") {
                evts = args[1].split(" ");
                handler = args[3];
                evts.forEach(function(evt) {
                    if (!_hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    els.forEach(function(el) {
                        _bind(el, evt, handler);
                    });
                });
                return;
            }

            //事件代理
            if (args.length === 4) {
                var el = els[0];
                evts = args[1].split(" ");
                sel = args[2];
                handler = args[3];
                evts.forEach(function(evt) {
                    if (!_hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    _delegate(el, evt, sel, handler);
                });
                return;
            }
        };

        var _off = function() {
            var evts, handler;
            var args = arguments;
            if (args.length < 1 || args.length > 4) {
                return console.error("unexpected arguments!");
            }
            var els = utils.getType(args[0]) === 'string' ? doc.querySelectorAll(args[0]) : args[0];
            els = els.length ? Array.prototype.slice.call(els) : [els];

            if (args.length === 1 || args.length === 2) {
                els.forEach(function(el) {
                    evts = args[1] ? args[1].split(" ") : Object.keys(el.listeners);
                    if (evts.length) {
                        evts.forEach(function(evt) {
                            if (!_hasTouch) {
                                evt = utils.getPCevts(evt);
                            }
                            _unbind(el, evt);
                            _undelegate(el, evt);
                        });
                    }
                });
                return;
            }

            if (args.length === 3 && utils.getType(args[2]) === 'function') {
                handler = args[2];
                els.forEach(function(el) {
                    evts = args[1].split(" ");
                    evts.forEach(function(evt) {
                        if (!_hasTouch) {
                            evt = utils.getPCevts(evt);
                        }
                        _unbind(el, evt, handler);
                    });
                });
                return;
            }

            if (args.length === 3 && utils.getType(args[2]) === 'string') {
                var sel = args[2];
                els.forEach(function(el) {
                    evts = args[1].split(" ");
                    evts.forEach(function(evt) {
                        if (!_hasTouch) {
                            evt = utils.getPCevts(evt);
                        }
                        _undelegate(el, evt, sel);
                    });
                });
                return;
            }

            if (args.length === 4) {
                handler = args[3];
                els.forEach(function(el) {
                    evts = args[1].split(" ");
                    evts.forEach(function(evt) {
                        if (!_hasTouch) {
                            evt = utils.getPCevts(evt);
                        }
                        _undelegate(el, evt, sel, handler);
                    });
                });
                return;
            }
        };

        var _dispatch = function(el, evt, detail) {
            var args = arguments;
            if (!_hasTouch) {
                evt = utils.getPCevts(evt);
            }
            var els = utils.getType(args[0]) === 'string' ? doc.querySelectorAll(args[0]) : args[0];
            els = els.length ? Array.prototype.call(els) : [els];

            els.forEach(function(el) {
                _trigger(el, evt, detail);
            });
        };

        //init gesture
        function init() {
            var eventNames = _hasTouch ? 'touchstart touchmove touchend touchcancel': 'mouseup mousedown mousemove mouseout';
            _on(doc, 'DOMContentLoaded',
            function() {
                var env = doc.body;
                _on(env, eventNames, handlerOriginEvent);
            });
        }

        init();

        exports.on = _on;
        exports.off = _off;
        exports.bind = _on;
        exports.unbind = _off;
        exports.live = _on;
        exports.die = _off;
        exports.config = config;
        exports.trigger = _dispatch;

    })(document, touch);
    
    //定义 touch 空间，clouda.touch
    clouda.touch = touch;
});
define("mbaas",function(module) {
    var lightapp = this;
    var it = module.face = {};
    
    /**
     * @object facerecognition
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.facerecognition
     * 
     */
    module.FR_ERROR={
        NETWORK_ERR : 1, 
        TIMEOUT_ERR : 2,
        CANCEL_ERR : 3,
        REGISTER_ERR : 4,
        VERIFY_ERR : 5,
        DETECT_FACE_ERR : 6,
        AUTHORIZE_DEVICE_ERR : 7,
        GET_DEVICE_LIST_ERR : 8,
        CLECK_BLINK_ERR : 9,
        SERVER_ERR : 99,
        UNKNOWN_ERR : 100
    };
     
     /**
     * 注册人脸识别
     *
     * @function register
     * @memberof clouda.mbaas.facerecognition
     * @instance
     *
     * @param {string} uid 用户唯一标识符
     * @param {{}} options 可定义
     * @param {function} [options.onsuccess] 
     * @param {function} [options.onfail] 
     * @returns null
     * 
     */
    it.register = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.register(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //uid
    it.verify = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            face.verify(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //检查眨眼
    it.checkBlink = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.check_blink(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //绑定设备
    it.authorizeDevice = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.authorize_device(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    //获取设备列表
    it.listDevice = function(uid,options){
        installPlugin("facerecognition", function(plg) {
            var face = new plg.FaceRecognition(uid);
            
            face.get_device_list(function(){
                options.onsuccess.apply(this.arguments);
            }, function(error) {
               lightapp.error(ErrCode.FR_ERROR,error,options);
            });
        });
    };
    
});define("mbaas",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.map = {};
    
    /**
     * @object map
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.map
     */
    
    
});define("mbaas",function( module ) {
    
    //deal with clouda.mbaas
    module.share = {};
    
    return module;
    
});define("mbaas",function(module) {
    var lightapp = this;
    var it = module.mediaplayer = {};
    
    /**
     * @object player
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.mediaplayer
     */
    
    /**
     * 播放
     *
     * @function play
     * @memberof clouda.mbaas.mediaplayer
     * @instance
     *
     * @param {string} link 播放的链接,全路径
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    
    it.play = function(link,options){
        installPlugin("videoplayer", function(plg) {
            var opt = new plg.VideoPlayerOptions(link);
            plg.play(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.CPS_ERROR,error,options);
            },opt);
        });
    };
    
});define("mbaas",function(module) {
    var lightapp = this;
    var it = module.push = {};
    
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
     * onReceive
     *
     * @function onreceive
     * @memberof clouda.mbaas.push
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    it.onreceive = function(options){
        lightapp.error(ErrCode.NOT_FINISH,ErrCode.NOT_FINISH,options);
    };
});define("mbaas",function(module) {
    var lightapp = this;
    var vtt = module.vtt = {};
    var tts = module.tts = {};
    
    /**
     * @object vtt
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.vtt clouda.mbaas.vtt
     */
    
    
    var voiceRecognition = new delegateClass("voice","voiceRecognition");
    var say = new delegateClass("voice","tts","say");
    
    module.VTT_STATUS={};
    module.VTT_STATUS.START_RECORDING = 0;
    module.VTT_STATUS.NONE = 1;
    module.VTT_STATUS.SPEECH_START = 2;
    module.VTT_STATUS.SPEECH_END = 4;
    module.VTT_STATUS.FINISH = 5;
    module.VTT_STATUS.PLAY_BEGINE_TONE_START = 6;
    module.VTT_STATUS.PLAY_BEGINE_TONE_END = 7;
    module.VTT_STATUS.PLAY_END_TONE_START = 8;
    module.VTT_STATUS.PLAY_END_TONE_END = 9;
    module.VTT_STATUS.UPDATE_RESULTS = 10;
    module.VTT_STATUS.AUDIO_DATA = 11;
    module.VTT_STATUS.USER_CANCELED = 61440;
    module.VTT_STATUS.ERROR = 65535;
    
    // for(var name in module.VTT_STATUS){
        // module.VTT_STATUS
    // }
    /**
     * 启动识别
     *
     * @function scanQrcode
     * @memberof clouda.mbaas.vtt
     * @instance
     *
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {boolen} [options.voicePower] 
     * @param {int} [options.speechMode] 
     * @param {function} [options.onfail] 
     * @returns null
     * 
     */
     vtt.startCapture = function(options){
        if (options.voicePower){
             voiceRecognition.enableVoicePower(successCallback, errorCallback, options.voicePower);
        }
        if (options.speechMode){
             voiceRecognition.setSpeechMode(successCallback, errorCallback, options.speechMode);
        }
        voiceRecognition.startVoiceRecognition(function(string){//success callback
                // options.onsuccess.apply(this,arguments);
                plg.voiceRecognition.setStatusChangeListener(
                  function(result) {
                    if (result.status === module.VTT_STATUS.FINISH ){
                        options.onsuccess.apply(this,arguments);
                    }else if (result.status === module.VTT_STATUS.USER_CANCELED) {
                        options.onfail.call(this,clouda.STATUS.USER_CANCELED);
                    }else if (result.status === module.VTT_STATUS.ERROR) {
                        options.onfail.call(this,result.status);
                    }
                  },
                  function(error) {
                    lightapp.error(ErrCode.vtt_ERR,error.code,options);
                  }
                );
            
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
        },options);
     };
     
     vtt.speakFinish = function(options){
        voiceRecognition.speakFinish(function(string){//success callback
            options.onsuccess.call(this,"OK");
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
        },options);
     };
     
     vtt.terminateCapture = function(options){
        voiceRecognition.stopVoiceRecognition(function(string){//success callback
            if (typeof string=='string'){
                options.onfail.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.vtt_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
        },options);
     };
     
     /**
     * @object tts
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.vtt clouda.mbaas.tts
     */
    module.TTS_TYPE = {
      TYPE_DICT_US: 'dict_en',
      TYPE_DICT_UK: 'dict_uk',
      // TRANS_EN: 'trans_en',
      TYPE_DICT_ZH: 'trans_zh',
    };
   
   /**
     * 语音外放
     *
     * @function say
     * @memberof clouda.mbaas.tts
     * @instance
     *
     * @param {string} say word
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @param {string} [options.type] 类型
     * @returns null
     * 
     */
     tts.say = function(word,options){
         //say: function(successCallback, errorCallback, text, type) {
        say(function(string){//success callback
            if (typeof string=='string'){
                options.onsuccess.apply(this,arguments);
            }else{
                lightapp.error(ErrCode.vtt_ERR,ErrCode.UNKNOW_CALLBACK,options);
            }
            
        },function(nativeErr){
            lightapp.error(ErrCode.BTY_ERROR,nativeErr,options);
        },word,options.type);
     };
});

   // return clouda;
})(window);