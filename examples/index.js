function showcase(name){
	
	//var list = document.getElementById("demoList");
	//list.style.webkitTransition = "all 0.2s ease-out";
	//list.style.right = list.clientWidth + "px";
	
	var href = name + "/" + name + ".html";
	console.log(href);
	if(!name){return ;}
	setTimeout(function(){
		location.href = href;
	}, 250);
	
}

clouda.touch.on(document, 'DOMContentLoaded', function(e){
	
	var demoList = document.getElementById("demoList");
	demoList.classList.add("show");

	clouda.touch.on(demoList, 'tap', 'li', function(e){
		var name = this.getAttribute("data-name");
		name && showcase(name);
	});
	
});