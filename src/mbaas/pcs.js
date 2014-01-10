define("mbaas",function( module ) {
    var lightapp = this;
    //deal with clouda.mbaas
    var it = module.pcs = {};
    
    // var login = new delegateClass("device","login","login");
    // var logout = new delegateClass("device","login","logout");
    module.VIDEO_STREAM = {
        "P360":"MP4_360P",
        "P480":"MP4_480P",
    };
    module.MEDIA_TYPE = {
        "IMG":"image",
        "AUD":"audio",
        "VID":"video",
        "DOC":"doc",
    };
    //M3U8_320_240、M3U8_480_224、M3U8_480_360、M3U8_640_480 和 M3U8_854_480

    module.CODEC_TYPE = {
        "M320":"M3U8_320_240",
        "M480224":"M3U8_480_224",
        "M480360":"M3U8_480_360",
        "M640":"M3U8_640_480",
        "M854":"M3U8_854_480"
    };
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
    var defaultPCSPath = "";
    
    it.init = function(token,options){
        if (!token){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        installPlugin("pcs", function(pcs) {
            pcs.initPCS(token,function(){
                options.onsuccess(pcs);
                currentPcs = pcs;
            },function(nativeErr){
                lightapp.error(ErrCode.PCS_ERROR,nativeErr,options);
            });
        });
        
    };
    /**
     * mkdir
     *
     * @function mkdir
     * @memberof clouda.mbaas.pcs
     * @instance
     * @param {string} pcs pcs实例
     * @param {string} path 创建路径
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调，返回pcs
     * @param {function} [options.onfail] 失败的回调
     * @param {function} [options.pcs] 默认使用初始化过的pcs
     * @returns null
     * 
     */
    it.mkdir = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.makeDir(defaultPCSPath + path, 
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.getQuota = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.quota(
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
        currentPcs.uploadFile({"source":localpath, "target":(defaultPCSPath + serverpath)},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.getMeta = function(path,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.meta(path,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    //by order FIXME ORDERBY
    it.getList = function(path,options){
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
        if (typeof codeType !== 'string'){
            codeType = module.VIDEO_STREAM.P360;
        }
        var params = {"source":defaultPCSPath + serverpath, "type":codeType};
        currentPcs.getStreamingURL(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.getListByCategory = function(mediaType,options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.streamWithSpecificMediaType({"type":mediaType},
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          },
          function (status) {
             options.onprogress(status);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
            delete params.source;
            params.sourceList = serverpath;
        }else if (options.codecType){
            func = currentPcs.downloadFileAsSpecificCodecType;
            params.type = options.codecType;
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.cloudDownloadTaskList = function(options){
        if (!currentPcs){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        //TODO params
        options.asc = (options.order === 'desc')?0:1;
        
        var params = {"start":options.start?options.start:0, "limit":options.limit?options.limit:0, "asc":options.asc,"status":options.status?options.status:-1, "needTaskInfo":options.needTaskInfo?options.needTaskInfo:true};
        currentPcs.cloudDownloadTaskList(params,
          function(result) {
             options.onsuccess(result);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    it.cancelCloudDownload = function(serverpath,options){
        if (!currentPcs|| !Array.isArray(filesukarr)){
            lightapp.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,options);
            return;
        }
        currentPcs.cancelCloudDownload(serverpath,
          function(result) {
             options.onsuccess(clouda.STATUS.SUCCESS);
          },
          function (error) {
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
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
             lightapp.error(ErrCode.PCS_ERROR,error,options);
          }
        );
    };
    return module;
    
});