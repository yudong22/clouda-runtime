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
    
    var localDir = function(){
        return "/sdcard/Baidu/"+lightapp.ak;
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
     * @param {string} options.fileKey
     * @param {string} options.savedName
     */
    var fileTransfer=null;
    it.postFile = function(link,target,options) {
        installPlugin("filetransfer", function(ft) {
            ft = ft.fileTransfer;
            if (fileTransfer === null) {
                fileTransfer = new ft.FileTransfer();
                if (options.onprogress){
                    fileTransfer.onprogress = options.onprogress;
                }
            }
            
            var opt = new ft.FileUploadOptions();
            opt.fileKey = options.fileKey;
            opt.fileName = options.savedName;
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
                    fileTransfer.onprogress = options.onprogress;
                }
            }
            //可能需要加下载路径
            fileTransfer.download(link, localDir() +"/" + name, function(result) {
                options.onsuccess.apply(this, arguments);
            }, function(err) {
                lightapp.error(ErrCode.FS_ERR, err, options);
            },options);
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
    
    it.abort = function(options) {
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
            var ld = localDir();
            var directEntry = new device.fs.DirectoryEntry(getFileNameFromPath(ld), ld);
            directEntry.removeRecursively(function(){
                options.onsuccess.apply(this,arguments);
            }, function(error){
                lightapp.error(ErrCode.FS_ERR,error,options);
            },options);
        });
    };
    
    it.getCount = function(options){
        installPlugin("device", function(device) {
            var ld = localDir();
            var directEntry = new device.fs.DirectoryEntry(getFileNameFromPath(ld), ld);
            var directReader = directEntry.createReader();
            
            directReader.readEntries(function(){
                options.onsuccess.apply(this,arguments);
            }, function(error){
                lightapp.error(ErrCode.FS_ERR,error,options);
            },options);
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
     * @param {Function} options.onprogress
     */
    
    it.getInfo = function(link,options){
        installPlugin("device", function(device) {
            var fileEntry = new device.fs.fileEntry(getFileNameFromPath(link), link);
            
            fileEntry.getMetadata(function(metadata) {
               options.onsuccess.apply(this,arguments);
            }, function(error) {
               lightapp.error(ErrCode.FS_ERR,error,options);
            });
        },options);
    };
    return module;
});