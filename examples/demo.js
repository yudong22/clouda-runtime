(function(){
	
	var bd = document.getElementById("bd"),
		hd = document.getElementById("hd");

	function autoResize(){
		bd.style.height = window.innerHeight - hd.offsetHeight - bd.offsetHeight + "px";
		bd.style.width = window.innerWidth + "px";
	}

	clouda.touch.on(document,'DOMContentLoaded', function(e){
		autoResize();
	});

	clouda.touch.on(window, 'resize', function(e){
		autoResize();
	});
})();

