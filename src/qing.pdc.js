
void function(winElement, docElement) {
    
    //获取url中名为str的参数值
    function getQueryStr(str){
        var LocString=String(window.document.location.href);
        var rs = new RegExp("(^|)"+str+"=([^\&]*)(\&|$)","gi").exec(LocString), tmp;    
        if(tmp=rs){
            return tmp[2];
        }  
        return 0;
    }

    //设置cookie的方法，默认15s过期
    function setCookie(name, value, max_age) {
        max_age = max_age || 15;
        var exp = new Date();
        exp.setTime(new Date().getTime() + max_age * 1000);
        try{
           docElement.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString(); 
        }catch(e){};      
    }

    //获取cookie
    function getCookie(name) {
        var arr = docElement.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null)
            return unescape(arr[2]);
        return null;
    }

    //向上遍历寻找需要的标签，如超链接a标签内包含其他标签，向上最多查找5个层级
    function findParent(tagname,el){
        var flag = 0;
        if ((el.nodeName || el.tagName).toLowerCase()===tagname.toLowerCase()){
            return el;
        }
        while (el = el.parentNode){
            flag++;                                     
            if ( (el.nodeName || el.tagName).toLowerCase()===tagname.toLowerCase()){
                return el;
            }
            if(flag>=4){
                return null;
            }
        }
        return null;
    }
    
       
    //获取统计起点，同时排除已经使用过此起点的情况(前进后退刷新)
    //由于刷新的时候refer不变，故用refer+cookie判断时间戳是否已使用
    function getAppStart(){
        var hash_ts = getQueryStr("bd_ts"), // 获取移动搜索传递过来的ts时间戳
            start = 0,
            refer = docElement.referrer,
            now   = +new Date,
            hash_cookie  = getCookie("bd_hash"), // 记录大搜索传过来的时间戳是否已经统计
            st = getCookie("bd_st"); //cookie，保存上个页面点击超链接的时间戳及url后50个字符串
        //如果是站内跳转，判断cookie时间戳及
        if(st){        
            try{
                setCookie("bd_st", "", -1); //使用后清除cookie,不清除cookie也只有10s生存期   
                st = eval(st);
            }catch(e){
                st = {};
            }
            //如果cookie中的url跟当前url相匹配，则将cookie中的时间戳作为统计起点
            if(!st.r || refer.replace(/#.*/, '').slice(-50) == st.r) {                          
                start = st.s;                                                   
            }
        //如果是大搜索跳转过来的数据，判断时间戳是否已使用
        }else if( refer.indexOf("baidu.com")>-1 &&  hash_ts >0 
            && String(hash_ts).length == 7 && hash_cookie!= hash_ts){
            setCookie("bd_hash",hash_ts,30);//保存30s
            start = parseInt((now+"").slice(0,6) + hash_ts);  //大搜索hash为后七位
        }
        //只有20内从起点到头部资源加载完毕才统计
        if( now - start >= 20000){
            start = 0;
        }
        return start;
    }
    
    function extend(source, destination) {
        for (p in source) {
            if(p){
                destination[p] = source[p];
            }        
        }
        return destination;
    }

    /*==================================================================*
    *
    * 轻应用性能数据采集器，统计白屏、首屏、可操作、总下载四个关键指标
    *
    * ===================================================================*/
    //绑定在轻应用统一全局变量bd下
    if(!window.bd){
        window.bd = {};
    }
    window.bd._qdc = {
        _v : 1,
        _timing : {},
        _random : Math.random(),
        _st  : getAppStart(),
        _is_send : false,
        _opt: {
            sample: 0.5,
            log_path : 'http://static.tieba.baidu.com/tb/opms/img/st.gif', //轻应用专用日志模块地址
            items : ['fs','lt'] //此数组内的指标统计完毕才发送
        },  
        //检测是否统计完毕，默认检测lt
        _check : function(){
            var items = this._opt['items'], timing = this._timing,ready = true;
            for (var i = items.length - 1; i >= 0; i--) {
                if(!timing.hasOwnProperty(items[i])){
                    ready = false;
                }
            };
            if(ready){
                this.send();
            }
        },
        init: function(opt) {
            extend(opt, this._opt);
        },
        //每次标记的时候检查指标是否统计完毕，默认为fs和lt
        mark: function(item, value) {
            if(this._st >0) {
                this._timing[item] = value || (+new Date-this._st);
                this._check();
            }           
        },
        /**
         *首屏时间接口，判断首屏内图片加载
         */
        first_screen: function() {
            var imgs = document.getElementsByTagName("img"),
                fs = +new Date;
            var fsItems = [],
                that = this;
            this._setFS = function() {
                var sh = that['_opt']['fsHeight'] || document.documentElement.clientHeight;
                for (var i = 0; i < fsItems.length; i++) {
                    var item = fsItems[i],
                        img = item['img'],
                        time = item['time'],
                        top = img.offsetTop || 0;
                    if (top > 0 && top < sh) {
                        fs = time > fs ? time : fs;
                    }
                }
                //如果有图片就是图片最慢的加载时间，没有则为当前执行时间(相当于文字出现时间)
                that._timing["fs"] = fs - that._st;
                           
            }
            var loadEvent = function() {
                //gif避免
                if (this.removeEventListener) {
                    this.removeEventListener("load", loadEvent, false);
                }
                fsItems.push({
                    img: this,
                    time: +new Date
                });
            }
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                if (img.addEventListener) {
                    !img.complete && img.addEventListener("load", loadEvent, false);
                }
            }
        },
        //发送统计数据
        send: function(){
            //采样命中、获取到起始时间且已设置app_id才发送
            if(this._random < this._opt['sample'] && this._st>0  && !this._is_send){
                this._is_send = true;
                var timing = this._timing,params = [];
                for(var key in timing){
                    params.push(key + '=' + timing[key]);
                }
                params.push('_t=' + new Date()*1); //防止被缓存
                var img = document.createElement("img");
                img.src = this._opt['log_path'] + '?' + 'type=bdapp&v='+this._v+"&app_id="+this._opt['app_id']+"&"+ params.join('&');
            }
        }
    }
   
    //统计domready时间
    docElement.addEventListener('DOMContentLoaded', function(){
        bd._qdc.mark("drt");
    }, false);

    //默认onload之后发送数据
    winElement.addEventListener('load', function() {
        bd._qdc._setFS && bd._qdc._setFS();//统计同步首屏时间，如果用户没有调用则不会有数据
        bd._qdc.mark('lt');   
    });

    //绑定click操作，判断是否点击链接，标记浏览器发起请求的时间戳
    docElement.addEventListener("click", function(){
        var e = e || window.event;
        var target = e.target || e.srcElement;
        var from = findParent('a',target);
        if (from) {
            var url = from.getAttribute("href");
            if (!/^#|javascript:/.test(url)) {               
               setCookie("bd_st", '({"s":' + (+new Date) + ',"r":"' + docElement.URL.replace(/#.*/, "").slice(-50) + '"})');                        
            }
        }
    }, false);

    bd._qdc.mark("ht");//标记白屏时间,此函数在head底部执行
}(window, document);
