define("device",function(module) {
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
            device.fs.requestFileSystem(device.fs.LocalFileSystem.PERSISTENT, 100000000, function(fileSystem){
                fileSystem.root.getDirectory(lightapp.ak, {create : true,exclusive : false}, function(fs){
                    callback(fs);
                }, function(){
                    callback(null);
                });
                
            }, function(){
                callback(null);
            });
        });
    };
    var getFileNameFromPath = function(str){
        return str.substring(str.lastIndexOf("/")+1);
    };
    /**
     * 上传文件
     *
     * @function post
     * @memberof clouda.device.fs
     * @instance
     * @param {string} filelink
     * @param {string} target 要POST到的目标,如http://some.host/foo
     * @param {{}} options
     * @param {Function} options.onsuccess
     * @param {Function} options.onfail
     * @param {Function} options.onprogress
     * @param {string} options.uploadKey
     * @param {string} options.param
     * 
     */
    var FileTransfer=null;
    it.post = function(link,target,options) {
        if ( clouda.RUNTIME === clouda.RUNTIMES.KUANG ) {
            var params = {};
            params.param = [];
            if (options.param){
                for(var nn in options.param){
                    params.param.push({key:nn,value:options.param[nn]});
                }
            }
            params.file = [];
            params.file.push({key:options.uploadKey,value:link});
            
            BLightApp.postFile(target,JSON.stringify(params),"("+options.onsuccess.toString()+")",
                            "("+options.onfail.toString()+")");
           
             return false;
         }
        installPlugin("filetransfer", function(ft) {
            if (FileTransfer === null) {
                FileTransfer = new ft.FileTransfer();
            }
            if (options.onprogress){
                FileTransfer.onprogress = function(data){
                    options.onprogress(data);
                };
            }
            var opt = new ft.FileUploadOptions();
            opt.fileKey = options.uploadKey;
            opt.fileName = getFileNameFromPath(link);
            if (options.param){
                opt.params = options.param;
            }
            // opt.mimeType = "text/html";
            FileTransfer.upload(link, target, function(result) {
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
    
 
    it.download = function(link, name, options) {
        installPlugin("filetransfer", function(ft) {
            if (FileTransfer === null) {
                FileTransfer = new ft.FileTransfer();
            }
            if (options.onprogress){
                FileTransfer.onprogress = function(data){
                    options.onprogress(data);
                };
            }
            //可能需要加下载路径
            localDir(function(direntry){
                if (!direntry) {
                    lightapp.error(ErrCode.FS_ERR, err, options);
                    return ;
                }
                FileTransfer.download(link, direntry.fullPath +"/" + name, function(result) {
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
        if(FileTransfer === null){
            lightapp.error(ErrCode.FS_ERR, err, options);
        }else{
            FileTransfer.abort();
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

            var fileEntry = new device.fs.FileEntry(getFileNameFromPath(link), link);
            
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
    
    it.count = function(options){
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
            var fileEntry = new device.fs.FileEntry(getFileNameFromPath(link), link);
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
});