define("lib",function( module ) {
    var baseurl = "http://127.0.0.1:6259/";
    var mcmdf = "inapp_lightapp_searchbox";
    var apis = {
        'getpackageinfo':{
            packagename:'com.baidu.searchbox',
            // mcmdf:""
        },
        'sendintent':{
            intent:'#Intent;action=com.baidu.searchbox.action.aloader.VIEW;category=android.intent.category.DEFAULT;launchFlags=0x18000000;component=com.baidu.searchbox/.aloaderhost.ALoaderActivity;S.packageName=com.baidu.searchbox.plugins.xsearch;B.showMenu=true;S.pageId=%pageId;S.src=h5_export;end'
        }
    };
    function loadScript(url, callback) {
        var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement, script, options, s;
        if ( typeof url === 'object') {
            options = url;
            url = undefined;
        }
        s = options || {};
        url = url || s.url;
        callback = callback || s.success;
        script = document.createElement("script");
        script.async = s.async || false;
        script.type = "text/javascript";
        if (s.charset) {
            script.charset = s.charset;
        }
        script.src = url;
        head.insertBefore(script, head.firstChild);
        if (callback) {
            if (document.addEventListener){
                script.addEventListener("load", callback, false);
                // script.addEventListener("abort", function(e){alert('abort')}, false);
            }else{ 
                script.onreadystatechange = function() {
                    if (/loaded|complete/.test(script.readyState)) {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            }
        }
    }
    var moplus = {};
    moplus.getinfo = function(pageId){
        
        //{"appid":"2264015","url":"http://touch.qunar.com/?bd_source=baidu_lightapp"}
    };
    moplus.openApp = function(pageId){
        pageId = JSON.stringify(pageId);
        var intent = encodeURIComponent(apis.sendintent.intent.replace("%pageId",pageId));
        var url = "http://127.0.0.1:6259/sendintent?intent=" + intent + "&mcmdf=" + mcmdf + "&t=" + (new Date()).getTime();
    
        loadScript(url,function(data){
            alert('sendintent success:'+data);
        });
        //{"appid":"2264015","url":"http://touch.qunar.com/?bd_source=baidu_lightapp"}
    };
    //'#Intent;action=com.baidu.searchbox.action.aloader.VIEW;category=android.intent.category.DEFAULT;launchFlags=0x18000000;component=com.baidu.searchbox/.aloaderhost.ALoaderActivity;S.packageName=com.baidu.searchbox.plugins.xsearch;B.showMenu=true;S.pageId={"appid":"2264015","url":"http://touch.qunar.com/?bd_source=baidu_lightapp"};S.src=h5_export;end'
    //http://127.0.0.1:6259/sendintent?callback=send&intent=#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10000020;component=com.baidu.appsearch/.LauncherActivity;end&mcmdf=aliding
    
    module.moplus = moplus;
});
