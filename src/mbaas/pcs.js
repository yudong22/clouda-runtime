define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.pcs = {};
    
    // var login = new delegateClass("device","login","login");
    // var logout = new delegateClass("device","login","logout");
    
    
    /**
     * initPCS
     *
     * @function initPCS
     * @memberof clouda.mbaas.pcs
     * @instance
     * @param {string} token 使用从登录获得的token初始化pcs
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调，返回pcs
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    var currentPcs;
    var defaultPCSPath = "/apps/FrontiaDevDemo/";
    
    it.initPCS = function(token,options){
        if (!token){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        installPlugin("pcs", function(pcs) {
            pcs.initPCS(token,function(){
                options.onsuccess(pcs);
                currentPcs = pcs;
            },function(nativeErr){
                lightapp.error(ErrCode.LOGIN_ERROR,nativeErr,options);
            });
        });
        
    };
    /**
     * makeDir
     *
     * @function makeDir
     * @memberof clouda.mbaas.pcs
     * @instance
     * @param {string} pcs pcs实例
     * @param {string} dirName 创建路径
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调，返回pcs
     * @param {function} [options.onfail] 失败的回调
     * @param {function} [options.pcs] 默认使用初始化过的pcs
     * @returns null
     * 
     */
    it.makeDir = function(dirName,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.makeDir(defaultPCSPath + dirName, 
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.quota = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.quota.makeDir(
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    // FIXME what's status mean?
    it.uploadFile = function(localpath,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        // serverpath =;
        currentPcs.uploadFile.makeDir({"source":localpath, "target":(defaultPCSPath + serverpath)},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          },
          function(status) {
             options.onprogress(status);
          }
        );
        // pcs.uploadFile({"source":sourcePath, "target":targetPath},
          // function(result) {
            // document.getElementById('success').innerText = 'uploadFile: ' + JSON.stringify(result);
          // },
          // function (error) {
            // document.getElementById('fail').innerText = 'uploadFile: ' + JSON.stringify(error);
          // },
          // function (status) {
            // document.getElementById('status').innerText = 'uploadFile: ' + JSON.stringify(status);
          // }
     // );
    // }
    };
    it.deleteFiles = function(patharr,options){
        if (!currentPcs || !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.deleteFiles(patharr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.meta = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.meta(path,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //by order
    it.list = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var params = {path:path};
        params.by = options.by?options.by:"time";
        params.order = options.order?options.order:"asc";
        
        currentPcs.list(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //"source":sourcePath, "type":"MP4_360P"
    //TODO all types
    it.getStreamingURL = function(serverpath,codeType,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var params = {"source":defaultPCSPath + serverpath, "type":codeType};
        currentPcs.getStreamingURL(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //recursive
    it.search = function(serverpath,key,recursive,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var params = {"path":defaultPCSPath + serverpath, "key":key, "recursive":recursive};
        currentPcs.search(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //"quality":80, "width": 30,"height":
    it.thumbnail = function(serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        //{"path":testPath + '/file.png', "quality":80, "width": 30,"height": 30}
        var params = {"path":defaultPCSPath + serverpath, "quality":options.quality, "width":options.width,"height":options.height};
        currentPcs.thumbnail(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //{"from":sourcePath1,"to":targetPath1}
    it.move = function(patharr,options){
        if (!currentPcs || !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        for (var i=0,len=patharr.length;i<len;i++){
            patharr[i].from =defaultPCSPath + patharr[i].from;
            patharr[i].to =defaultPCSPath + patharr[i].to;
        }
        currentPcs.move(patharr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //{"oldName":sourcePath1,"newName":targetPath1
    it.rename = function(patharr,options){
        if (!currentPcs|| !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        for (var i=0,len=patharr.length;i<len;i++){
            patharr[i].oldName =defaultPCSPath + patharr[i].oldName;
            patharr[i].newName =defaultPCSPath + patharr[i].newName;
        }
        currentPcs.rename(patharr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //{"from":sourcePath1,"to":targetPath1}
    it.copy = function(patharr,options){
        if (!currentPcs|| !Array.isArray(patharr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        for (var i=0,len=patharr.length;i<len;i++){
            patharr[i].from =defaultPCSPath + patharr[i].from;
            patharr[i].to =defaultPCSPath + patharr[i].to;
        }
        currentPcs.copy(patharr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.streamWithSpecificMediaType = function(mediaType,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.streamWithSpecificMediaType({"type":mediaType},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.createFileLink = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.createFileLink(defaultPCSPath + path,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.deleteFileLink = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.deleteFileLink(defaultPCSPath + path,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.cloudMatch = function(localpath,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cloudMatch({"localPath": localpath, "serverPath": serverpath},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.cloudMatchAndUploadFile = function(localpath,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cloudMatchAndUploadFile({"localPath": localpath, "serverPath": serverpath},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    
    it.listRecycle = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.listRecycle({},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //["1874002074"] 
    it.restoreRecycle = function(filesukarr,options){
        if (!currentPcs || !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.restoreRecycle(filesukarr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.cleanRecycle = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cleanRecycle(
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.downloadFile = function(serverpath,localpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var func;
        var params = {"source":serverpath, "target":localpath};
        if (Array.isArray(serverpath)){
            func = currentPcs.batchDownloadFiles;
        }else if (options.codeType){
            func = currentPcs.downloadFileAsSpecificCodecType;
            params.type = options.codeType;
        }else if (options.asStream){
            func = currentPcs.downloadFileFromStream;
        }else{
            func = currentPcs.downloadFile;
        }
        func(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          },
          function(status) {
             options.onprogress(status);
          }
        );
    };
    
    it.cloudDownload = function(url,serverpath,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        var params = {"sourceUrl":url, "serverPath":serverpath, "rateLimit":options.rateLimit?options.rateLimit:0, "timeOut":options.timeout?options.timeout:0};
        currentPcs.cloudDownload(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.cloudDownloadTaskList = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        //TODO params
        var params = {"start":options.start?options.start:0, "limit":options.limit?options.limit:0, "asc":options.order?options.order:0,"status":options.status?options.status:-1, "needTaskInfo":options.needTaskInfo?options.needTaskInfo:true};
        currentPcs.cloudDownloadTaskList(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.queryCloudDownloadTaskStatus = function(filesukarr,options){
        if (!currentPcs || !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.queryCloudDownloadTaskStatus(filesukarr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.queryCloudDownloadTaskProgress = function(filesukarr,options){
        if (!currentPcs || !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.queryCloudDownloadTaskProgress(filesukarr,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    it.cancelCloudDownload = function(path,options){
        if (!currentPcs|| !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cancelCloudDownload(path,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    //FIXME 
    it.diff = function(cursor,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.diff(cursor,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.LOGIN_ERROR,error,options);
          }
        );
    };
    return module;
    
});