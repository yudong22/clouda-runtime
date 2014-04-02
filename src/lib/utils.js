define("lib",function( module ) {
    
    'use strict';

    var defaultLogger = console;

    var emptyfunc = function() {
        
    };

    var callbackProxy = {
        successProxy : {},
        failProxy : {}
    };

    //kuang调用的proxy函数,会在全局执行, 运行时的作用域非当前静态作用域
    var cloudaOnsuccessProxy = function (result) {
        
        var randomId = result.randomId;
        
        var sproxy = clouda.lib.callbackProxy.successProxy[randomId];

        delete result.randomId;

        if(sproxy){
            
            sproxy(result);

        }else{
            
            lightapp.error(ErrCode.UNKNOW_CALLBACK,randomId,result);

        }
        
    };

    //kuang调用的proxy函数,会在全局执行, 运行时的作用域非当前静态作用域
    var cloudaOnfailProxy = function (result) {

        var randomId = result.randomId;

        var fproxy = clouda.lib.callbackProxy.failProxy[randomId];

        delete result.randomId;

        if(fproxy){

            fproxy(result);    

        }else{

            lightapp.error(ErrCode.UNKNOW_CALLBACK,randomId,result);

        }
    };

    var slientLogger = {
        log : emptyfunc,
        error : emptyfunc,
        warn : emptyfunc,
        info : emptyfunc,
        debug : emptyfunc,
        trace : emptyfunc
    };

    if (Function.prototype.bind) {
        //keep the warn and error evan in slient mode
        [ 'error', 'warn' ].forEach(function(funcName) {

            slientLogger[funcName] = defaultLogger[funcName].bind(defaultLogger);
        });
    }

    function setLogger(logger) {

        if (!logger.debug)
            logger.debug = logger.info;

        utils.log = logger;
    }

    var isNodeEnv = !!(typeof module != 'undefined' && module.exports), isBrowserEnv = !!(typeof document != 'undefined' && document.getElementById);

    var utils = {
        slientLogger : slientLogger,
        setLogger : setLogger,

        /**
         * turn on/off debug mode
         * 
         * @param on|boolean
         */
        setDebugMode : function(on) {

            setLogger(on ? defaultLogger : slientLogger);
        },

        domReady : function(callback) {

            if (/complete|loaded|interactive/.test(document.readyState)) {
                callback();
                return;
            } else {
                document.addEventListener('DOMContentLoaded', function() {

                    callback();
                }, false);
                return;
            }
        },

        /**
         * extend(target, src1, src2.....)
         * 
         * @param dst,
         *            the target object to be extended
         * @returns Object
         */
        extend : function(dst) {

            if (!dst)
                dst = {};

            Array.prototype.slice.call(arguments, 1).forEach(function(source) {

                if (!source)
                    return;

                for ( var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        dst[prop] = source[prop];
                    }
                }
            });

            return dst;
        },

        isArray : function(obj) {

            return Array.isArray ? Array.isArray(obj) : Object.prototype.call(obj) == '[object Array]';
        },

        isObject : function(obj) {

            return Object.prototype.toString.call(obj) == '[object Object]';
        },

        isFunction : function(obj) {

            return Object.prototype.toString.call(obj) == '[object Function]';
        },

        isNumber : function(obj) {

            return Object.prototype.toString.call(obj) == '[object Number]';
        },

        isString : function(obj) {

            return Object.prototype.toString.call(obj) == '[object String]';
        },
        isDefined : function(v) {

            return typeof (v) != 'undefined';
        },
        isSimpleValue : function(v) {

            return !(this.isObject(v) || this.isArray(v) || this.isFunction(v));
            
        },
        random : function(length) {

            var str = '', chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz', clen = chars.length;

            if (!length)
                length = 6;

            for ( var i = 0; i < length; i++) {
                str += chars.charAt(this.randomInt(0, clen - 1));
            }
            return str;
        },
        randomInt : function(min, max) {

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        inherit : function(child, parent) {

            for ( var key in parent) {
                if (parent.hasOwnProperty(key))
                    child[key] = parent[key];
            }

            function Ctor() {

                this.constructor = child;
            }
            Ctor.prototype = parent.prototype;

            child.prototype = new Ctor();
            child.__super__ = parent.prototype;

            return child;
        },

        ajaxGet : function(options) {

            var xhr = new window.XMLHttpRequest();

            if (options.async !== false)
                options.async = true;

            if (options.async) {
                xhr.onreadystatechange = function() {

                    if (xhr.readyState == 4) {
                        var result;
                        if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && location.protocol == 'file:')) {
                            result = xhr.responseText;
                            options.callback(result);
                        } else {
                            options.callback(xhr.responseText);
                        }
                    }
                };
            }

            xhr.open('GET', options.url, options.async);
            xhr.send(options.query || '');

            if (!options.async) {
                return xhr.status === 200 ? xhr.responseText : false;
            }
        },

        trim : function(s) {

            if (!s)
                return '';

            if (s.trim)
                return s.trim();

            return s.replace(/^\s+|\s+$/gm, '');
        },

        trigger : function(el, evt, detail) {

            if (!el) {
                this.log.error('emply element passed in');
                return;
            }

            detail = detail || {};
            var e, opt = {
                bubbles : true,
                cancelable : true,
                detail : detail
            };

            if (typeof CustomEvent !== 'undefined') {
                e = new CustomEvent(evt, opt);
                el.dispatchEvent(e);
            } else {
                try {
                    e = document.createEvent("CustomEvent");
                    e.initCustomEvent(evt, true, true, detail);
                    el.dispatchEvent(e);
                } catch (exp) {
                    this.log.error(exp);
                }
            }
            return true;
        },
        copy : function(obj) {

            var out;

            if (this.isArray(obj)) {

                out = [];
                for ( var i = 0, len = obj.length; i < len; i++) {
                    out.push(this.copy(obj[i], 1));
                }
                return out;

            } else if (this.isObject(obj)) {

                out = {};
                for ( var k in obj) {
                    if (obj.hasOwnProperty(k) && !this.isSysOwnedFld(k))
                        out[k] = this.copy(obj[k], 1);
                }
                return out;
            }

            return obj;
        },
        isNodeEnv : function() {

            return isNodeEnv;
        },
        isBrowserEnv : function() {

            return isBrowserEnv;
        },
        isPlainObject : function(obj) {

            if (!obj || !this.isObject(obj) || obj.nodeType) {

                return false;
            }

            if (obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
                return false;
            }

            var key = void (0);
            for (key in obj) {
            }

            return key === undefined || obj.hasOwnProperty(key);
        },
        removeFromArray : function(arr, val) {

            var index = arr.indexOf(val);

            if (index > -1) {
                arr.splice(index, 1);
            }

            return index;
        },
        size : function(obj) {

            if (obj === null)
                return 0;

            if (obj.length === +obj.length)
                return obj.length;

            var len = 0;
            for ( var k in obj) {
                if (obj.hasOwnProperty(k))
                    len++;
            }
            return len;
        },
        regcallback :  function(successcb, failcb){
            
            if(!successcb || !failcb || typeof successcb !== "function" || typeof failcb !== "function") {
                lightapp.error(ErrCode.UNKNOW_INPUT,successcb, failcb);
                return false;
            }

            var randomId = this.random(6) + Date.now();
            callbackProxy.successProxy[randomId] = successcb;
            callbackProxy.failProxy[randomId] = failcb;
            var prefix  = "(function(result){ result = result || {}; result.randomid = '" + randomId + "';(";
            var sufix = ")(result)})";
            return {
                s : (prefix + cloudaOnsuccessProxy.toString() + sufix),
                f : (prefix + cloudaOnfailProxy.toString() + sufix)
            };
        }
    };

    //off by default
    utils.setDebugMode(false);
    module.utils = utils;
    module.callbackProxy = callbackProxy;
});