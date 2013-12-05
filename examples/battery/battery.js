(function(){
	
	var unit = 354 / 100;
	var $ = function(id){ return document.getElementById(id); };
	var batterybox =  $("batterybox"),
		level = $("level"),
		bd = $("bd"),
		hd = $("hd"),
		qualitybox = $("qualitybox"),
		quality = $("quality"),
		desc = $("desc"),
		value = $("value");
	
	var positioning = function(){
		var batteryRect = batterybox.getBoundingClientRect();
		var offsetTop = (bd.offsetHeight - batteryRect.height) / 4;
		batterybox.style.top = offsetTop + "px";
		batterybox.style.left = (bd.offsetWidth - batteryRect.width) / 2 + "px";
		qualitybox.style.top = batteryRect.bottom + offsetTop + "px";
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
	
	window.showLevel showLevel;
	
	clouda.touch.on(document,'DOMContentLoaded', function(e){
		
		positioning();
		
		clouda.device.battery.listen({
			onSuccess : function(){
			
				console.log("listen success", arguments);
				var val = 80;
				if(val >=0 && val <= 100){
					showLevel(val);
				}
			},
			onFail : function(){
				console.log("listen fail", arguments);
			}
		});
		
	});

	clouda.touch.on(window, 'beforeunload', function(e){
		
		clouda.device.battery.stop({
			onSuccess : function(){
				console.log("stop success", arguments);
			},
			onFail : function(){
				console.log("stop fail", arguments);
			}
		});
		
	});
	
})();

