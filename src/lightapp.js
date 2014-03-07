(function() {
    // for client js only
    if ( typeof window !== 'object')
        return;
    if ( typeof window.clouda === 'undefined') {
        window.clouda = {};
    }

    
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
            document.addEventListener ? script.addEventListener("load", callback, false) : script.onreadystatechange = function() {
                if (/loaded|complete/.test(script.readyState)) {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        }
    }
    
    if ( typeof clouda.lightapp !== 'function') {//可能异步加载
        clouda.lightapp = function(ak,callback) {//异步加载
            clouda.lightapp.ak = ak;
            loadScript("http://cloudaapi.duapp.com/runtime.js",callback);
        };
    }
    
    try{
        if ( typeof window.bd === 'undefined') {
            window.bd = {};
        }
        if ( typeof window.bd._qdc === 'undefined'){
            window.bd._qdc={};
        }
        if ( typeof window.bd._qdc.init === 'undefined'){
            window.bd._qdc.init=function(){};
        }
    }catch(e){
        console.error(e.stack);
    }
    
})();
