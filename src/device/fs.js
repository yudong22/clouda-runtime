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
});