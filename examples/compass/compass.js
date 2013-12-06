(function(doc){
	
	var d = 386;
	
	var $ = function(id){
		return doc.getElementById(id);
	}
	
	var compass = $("compass"),
		compassbox = $("compassbox"),
		anglebox = $("anglebox"),
		angle = $("angle"),
		value = $("angle"),
		desc = $("desc");
		
	
	var positioning = function(){
		compass.style.left = (compassbox.offsetWidth - d) / 2 + "px";
	}
	
	var rotate = function(angle){
		compass.style.webkitTransform = "rotate(" + angle + ")";
	}
	
	clouda.touch.on(document,'DOMContentLoaded', function(e){
		
		positioning();
		
		clouda.touch.on($("back"), 'tap', function(e){
			location.href = "../index.html";
		});
		
		clouda.device.compass.startListen({
			onsuccess : function(data){
				console.log(data);
				var angle = data.magneticHeading
				console.log("trueHeading", data.trueHeading);
				console.log("accuracy", data.accuracy);
				rotate(angle);
			},
			onfail : function(err){
				console.log(err);
			}
		});
		
	});
	
})(document);