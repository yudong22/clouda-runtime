(function(){
	
	var unit = 354 / 100;
	var bwidth = 242;
	var $ = function(id){ return document.getElementById(id); };
	var batterybox =  $("batterybox"),
		battery = $("battery"),
		level = $("level"),
		bd = $("bd"),
		hd = $("hd"),
		qualitybox = $("qualitybox"),
		quality = $("quality"),
		desc = $("desc"),
		value = $("value");
	
	var positioning = function(){
		batterybox.style.left = (bd.offsetWidth - bwidth) / 2 + "px";
	}
	
	var showLevel = function(val){
		val = parseInt(val);
		if(val < 0 || val > 100){ return }
		if(val <= 20){
			level.style.backgroundImage = 'url(reddot.png)';
			value.classList.add("low");
		}else if( val > 20){
			level.style.backgroundImage = 'url(greendot.png)';
			value.classList.remove("low");
		}
		level.style.height = unit * val + "px";
		value.innerText = val;
	}
	
	window.showLevel = showLevel;
	
	clouda.touch.on(document,'DOMContentLoaded', function(e){
		
		setTimeout(positioning, 0);
		
		clouda.touch.on($("back"), 'tap', function(e){
			location.href = "http://demoofruntime.duapp.com/demo/";
		});
		
		clouda.device.battery.startListen({
			onsuccess:function(data){
				var val = data.level;
				if(val >=0 && val <= 100){ showLevel(val);}
			},onfail:function(errno){
				console.log(errno);
			}
		});
		
	});

	/* clouda.touch.on(window, 'beforeunload', function(e){
		
		clouda.device.battery.stopListen({
			onsuccess : function(){
				console.log("stop success", arguments);
			},
			onfail : function(){
				console.log("stop fail", arguments);
			}
		});
		
	}); */
	
})();

