define("mbaas",function(module) {
    var lightapp = this;
    //定义 map 空间，clouda.mbaas.map 
    var it = module.map = {};
    
    /**
     * @object map
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.map
     */
    var start = new delegateClass("map","start");
    var stop = new delegateClass("map","stop");
    var locationRequest = new delegateClass("map","locationRequest");
    var poiRequest = new delegateClass("map","poiRequest");
    
    var loadScript = function(xyUrl,callback){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;
        //借鉴了jQuery的script跨域方法
        script.onload = script.onreadystatechange = function() {
            if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                if (typeof callback === 'function') {
                    callback();
                }
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if (head && script.parentNode) {
                    head.removeChild(script);
                }
            }
        };
        head.insertBefore(script, head.firstChild);
    };
    
    it.Convertor = {};
    
    it.Convertor.translate = function(point, type, callback) {
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000); //随机函数名
        var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=clouda.mbaas.map.Convertor." + callbackName;
        //动态创建script标签
        loadScript(xyUrl);
        it.Convertor[callbackName] = function(xyResult) {
            delete it.Convertor[callbackName]; //调用完需要删除改函数
            var point = new BMap.Point(xyResult.x, xyResult.y);
            if (typeof callback === 'function') {
                callback(point);
            }
        };
    };
    
    it.start = function(options){
        
        start(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
    
    it.stop = function(options){
        stop(function(data){
            options.onsuccess(clouda.STATUS.SUCCESS);
        },function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
    it.locationRequest = function(options){
        locationRequest(options.onsuccess,function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
    it.poiRequest = function(options){
        //{poi:{p:[{x,y,dis,name}]}}
        poiRequest(function(data){
            options.onsuccess(data);
        },function(nativeErr){
            lightapp.error(ErrCode.MAP_ERROR,nativeErr,options);
        },options);
    };
    
});