define("lib",function( module ) {
    
    'use strict';

    var defaultLogger = console;

    var emptyfunc = function() {
        
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
        /**
         * copy the attr keys in props
         * 
         * subset([prop1, prop2], src1, src2.....)
         * 
         * @param Array|props
         * @returns
         */
        subset : function(props) {

            var sobj = {};

            if (!props || !props.length)
                return sobj;

            if (!this.isArray(props))
                props = [ props ];

            Array.prototype.slice.call(arguments, 1).forEach(function(source) {

                if (!source)
                    return;

                for ( var i = 0, len = props.length; i < len; i++) {
                    if (source.hasOwnProperty(props[i])) {
                        sobj[props[i]] = source[props[i]];
                    }
                }
            });

            return sobj;
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
        isSetter : function(obj, k) {

            if (!Object.getOwnPropertyDescriptor)
                return false;

            var propd = Object.getOwnPropertyDescriptor(obj, k);

            return !!(propd && propd.set);
        },
        defineGetterAndSetter : function(obj, key, getFunc, setFunc) {

            var prop = {};

            if (getFunc)
                prop.get = getFunc;

            if (setFunc)
                prop.set = setFunc;

            if (Object.defineProperty) {
                Object.defineProperty(obj, key, prop);
                
            } else if (obj.__defineGetter__) {

                if (prop.get)
                    obj.__defineGetter__(key, prop.get);

                if (prop.set)
                    obj.__defineSetter__(key, prop.set);
            }
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

        /**
         * get the dir base of url, e.g.
         * 
         * http://www.zz.com/cc/zz.html -> http://www.zz.com/cc/
         * 
         * @param url
         * @returns
         */
        getUrlDir : function(url) {

            url = url.split('?')[0];

            url = this.qualifyUrl(url);

            //search begin with the host
            var startPos = url.indexOf('//') + 2;

            //find the last /
            var lastSlashPos = url.substr(startPos).lastIndexOf('/');

            if (lastSlashPos == -1)
                return url + '/';

            return url.substr(0, startPos + lastSlashPos + 1);
        },

        /**
         * make the url absolute
         * 
         * @param url
         * @returns
         */
        qualifyUrl : function(url, base) {

            if (!base) {
                var a = document.createElement('a');
                a.href = url;
                return a.href;
            }

            //well, we got a base, use the base tag's magic

            var doc = document, doc_head = doc.head || doc.getElementsByTagName('head')[0];

            var old_base = doc.getElementsByTagName('base')[0], old_href = old_base && old_base.href;

            var our_base = old_base || doc_head.appendChild(doc.createElement('base'));

            var resolver = doc.createElement('a'), resolved_url;

            our_base.href = base;
            resolver.href = url;

            resolved_url = resolver.href;

            if (old_base) {
                old_base.href = old_href;
            } else {
                doc_head.removeChild(our_base);
            }

            return resolved_url;
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

        /* jshint -W054 */
        runInGlobal : function(functionBody, argsMap) {

            var argNames = [], argValues = [];

            if (argsMap) {
                for ( var k in argsMap) {

                    argNames.push(k);
                    argValues.push(argsMap[k]);
                }
            }

            return new Function(argNames.join(','), functionBody).apply(window, argValues);
        },
        /**
         * Read obj attr value via path, e.g. a.b.c[0][1].d
         */
        pathValue : function(obj, path, defaultVal, setMode) {

            if (setMode && path.indexOf('[') >= 0) {
                throw new Error('pathValue setMode not support array for now!!1');
            }

            var subPs = path.split('.'), cur = obj;

            var arrKeyPtn = /^([^\[]+)((\[\d+\])+)$/;

            var arrIdxPtn = /\[(\d+)\]/g;

            var depth = 0, subPsLen = subPs.length;

            var gotBrokenPath = subPs.some(function(sp, idx) {

                depth++;

                if (cur === null || cur === void (0))
                    return true;

                if (setMode) {

                    if (!this.isDefined(cur[sp])) {
                        cur[sp] = {};
                    }

                    if (idx == subPsLen - 1) {
                        cur[sp] = defaultVal;
                    }
                }

                if (this.isDefined(cur[sp])) {
                    cur = cur[sp];

                } else {

                    if (sp.indexOf('[') > 0) {

                        var matches = arrKeyPtn.exec(sp);

                        if (matches && matches[1] && this.isDefined(cur[matches[1]])) {
                            cur = cur[matches[1]];

                            var idxMatches;

                            while ((idxMatches = arrIdxPtn.exec(matches[2])) !== null) {

                                var nIdx = parseInt(idxMatches[1], 10);

                                depth++;

                                if (Array.isArray(cur) && this.isDefined(cur[nIdx])) {

                                    cur = cur[nIdx];

                                } else {
                                    return true;
                                }
                            }

                            return;
                        }
                    }

                    return true;
                }

            }, this);

            if (setMode)
                return obj;

            if (!gotBrokenPath)
                return cur;

            return typeof (defaultVal) != 'undefined' ? defaultVal : ''; // (depth > 1 ? '' : path);

        },
        isSysOwnedFld : function(k) {

            return k.indexOf(consts.sysKeyPre) === 0;
        },
        isEqual : function(a, b) {

            if (a === b)
                return true;
            if (a === null || b === null)
                return false;
            if (a !== a && b !== b)
                return true;

            var hskey = consts.hashTagKey;

            var t1 = typeof a, t2 = typeof b, length, key = null, keySet;

            if (t1 == t2) {
                if (t1 == 'object') {
                    if (this.isArray(a)) {
                        if (a.length == b.length) {
                            length = a.length;
                            for (key = 0; key < length; key++) {
                                if (!this.isEqual(a[key], b[key]))
                                    return false;
                            }
                            return true;
                        }
                    } else {

                        //this is a little trick to improve performace
                        if ((a[hskey] && b[hskey])) {

                            if (a[hskey] === b[hskey])
                                return true;

                            //if not match, we can not sure equal or not, so go on..
                        }

                        keySet = {};
                        for (key in a) {
                            if (!a.hasOwnProperty(key) || this.isSysOwnedFld(key))
                                continue;
                            if (!this.isEqual(a[key], b[key]))
                                return false;
                            keySet[key] = true;
                        }
                        for (key in b) {
                            if (!b.hasOwnProperty(key) || this.isSysOwnedFld(key))
                                continue;
                            if (!keySet[key] && b[key] !== undefined && typeof b[key] !== 'function')
                                return false;
                        }

                        return true;
                    }
                }
            }

            return false;
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
        nextTick : function(f) {

            (typeof process === 'object' && process.nextTick ? process.nextTick : function(task) {

                setTimeout(task, 0);
            })(f);
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
    };

    //off by default
    utils.setDebugMode(false);

    module.utils = utils;
});