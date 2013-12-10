(function(doc){
	function showcase(name){
	
		var href = name + "/" + name + ".html";
		if(!name){return ;}
		setTimeout(function(){
			location.href = href;
		}, 0);
		
	}
	
	var demoHash = {
		"地图" : 'lbs',
		"指南针" : 'compass',
		"陀螺仪" : 'balance',
		"相机" : 'camera',
		"语音备忘" : 'speaker',
		"播放器" : 'player',
		"电池" : 'battery',
		"通讯录" : 'contact',
		"网络" : 'network'
	}
	
	var COL = 3,
		itemHeight = 87;
	
	var positioning = function(demoList, lis, rect, uw){
		
		for(var i = 0; i < 12; i++){
			lis[i].style.height = uw + "px";
			lis[i].style.width = uw + "px";
			lis[i].style.left = (i % COL) * uw + "px";
			lis[i].style.top = Math.floor(i/COL) * uw + "px";
			var img = lis[i].querySelector(".img");
			if(img){ img.style.marginTop = (uw - itemHeight)/2 + "px"; }
			
			var nameEl = lis[i].querySelector(".name");
			if(nameEl){
				lis[i].demoTarget = demoHash[nameEl.innerText];
				nameEl.style.display = "block";
			}
		}
		
	}
	
	clouda.touch.on(window, 'load', function(e){
		
		var demoList = doc.getElementById("demoList");
		var lis = demoList.querySelectorAll("li");
		var rect = demoList.getBoundingClientRect();
		var uw = rect.width / COL;
		setTimeout(function(){
			positioning(demoList, lis, rect, uw);
		}, 0);
		
		clouda.touch.on(demoList, 'tap', 'li', function(e){
			var name = this.demoTarget;
			if(name){
				var href = name + "/" + name + ".html";
				location.href = href;
			}
		});
		
	});
})(document);