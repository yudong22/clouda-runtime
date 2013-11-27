touch.on(document, 'DOMContentLoaded', function(e){
	
	var on = touch.on;
	
	on("#demoList", 'tap', 'li', function(e){
		var href = this.getAttribute("data-href");
		if(href){ location.href = href; }
	});
	
});