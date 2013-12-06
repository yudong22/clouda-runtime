define("mbaas",function(module) {
    var lightapp = this;
    //定义 battery 空间，clouda.device.battery 支持退化
    var it = module.player = {};
    
    /**
     * @object player
     * @memberof clouda.mbaas
     * @instance
     * @namespace clouda.mbaas.player
     */
    
    /**
     * 播放
     *
     * @function play
     * @memberof clouda.mbaas.player
     * @instance
     *
     * @param {string} link 播放的链接
     * @param {{}} options 由onsuccess 和 onfail组成
     * @param {function} options.onsuccess 成功的回调
     * @param {function} [options.onfail] 失败的回调
     * @returns null
     * 
     */
    
    it.play = function(link,options){
        installPlugin("videoplayer", function(plg) {
            var opt = new plg.VideoPlayerOptions(link);
            plg.play(function(){
                options.onsuccess(clouda.STATUS.SUCCESS);
            }, function(error) {
               lightapp.error(ErrCode.CPS_ERROR,error,options);
            },opt);
        });
    };
    
});