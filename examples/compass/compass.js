(function(doc){
	
	var d = 386;
	
	var $ = function(id){
		return doc.getElementById(id);
	}
	
	var compass = $("compass"),
		compassbox = $("compassbox"),
		anglebox = $("anglebox"),
		angle = $("angle"),
		value = $("value"),
		desc = $("desc");
		
	
	var positioning = function(){
		compass.style.left = (compassbox.offsetWidth - d) / 2 + "px";
		compass.style.display = "block";
	}
	
	var rotate = function(angle){
		compass.style.webkitTransform = "rotate(" + angle + "deg)";
		angle = parseInt(angle);
		value.innerText = angle;
		var direct;
		if(angle >= 0 && angle <= 90){
			direct = "北";
		}else if(angle > 90 && angle <= 180){
			direct = "西"; 
		}else if(angle > 180 && angle <= 270){
			direct = "南";
		}else {
			direct = "东";
		}
		desc.innerText = direct;
	}
	
	clouda.touch.on(document,'DOMContentLoaded', function(e){
		
		setTimeout(positioning, 200);
		
		clouda.touch.on($("back"), 'tap', function(e){
			location.href = "../index.html";
		});
		
		clouda.device.compass.startListen({
			onsuccess : function(data){
				var angle = data.magneticHeading;
				rotate(360 - angle);
			},
			onfail : function(err){
				console.log(err);
			}
		});
		
	});
	
})(document);