(function(window){
    // for client js only
    if (typeof window !== 'object')return ;
    
    if (typeof window.clouda === 'undefined') {
        window.clouda = {};
    }
    var clouda = window.clouda;
    
    clouda.lightapp = function(ak){
        clouda.lightapp.ak = ak;
    };
    clouda.lightapp.error = function(){
        try{
            throw new Error();
        }catch(e){
            var stackStr = (e.stack.split('\n'));
            console.log("Call lightapp api Error! " + stackStr[2].replace(/\s*/,""));
        }
    };
    //定义错误格式
    // clouda.__noSuchMethod__ = function(){
        // alert('no such method');
        // console.log(arguments);
    // };
    //__defineGetter__
    
    /**
     * 定义执行类型，所有子文件均通过此函数进行预处理，过滤错误，支持退化
     *
     * @function define
     * @memberof 
     * @instance
     *
     * @param {string} name
     * @param {Function} bindFunction
     *
     */
    var define= function(name,bindFunction){
        var module = clouda[name];
        //执行空间在clouda.lightapp下，防止污染其他空间
        bindFunction.call(clouda.lightapp,module);
        // bindFunction.call(undefined,module);
    };
    clouda.device = {};
    clouda.mbaas = {};
    // clouda.ui={};
