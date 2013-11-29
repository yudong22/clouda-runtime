

clouda.touch.on(document,'DOMContentLoaded', function(e){
	
	clouda.device.battery.listen({
		onSuccess : function(){
			console.log("listen success", arguments);
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

