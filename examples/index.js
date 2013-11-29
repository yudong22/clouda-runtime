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

touch.on(document, 'DOMContentLoaded', function(e){
	
	var demoList = document.getElementById("demoList");
	demoList.classList.add("show");

	touch.on(demoList, 'tap', 'li', function(e){
		var name = this.getAttribute("data-name");
		name && showcase(name);
	});
	
});