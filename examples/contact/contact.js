(function(doc){
	
	function getContact(c){
		var tmpl = ['<li>',
						'<div class="avatar"></div>',
						'<div class="info">',
							'<div class="username">', c.name, '</div>',
							'<div class="mobile">', c.mobile, '</div>',
						'</div>',
					'</li>'];
		return tmpl.join("");
	}
	
	var $ = function(id){
		return document.getElementById(id);
	}
	
	var contactbox = $("contactbox");
	
	clouda.touch.on( doc, "DOMContentLoaded", function(){
		
		clouda.touch.on("#back", "tap", function(){
			location.href = "../index.html";
		});
		
		//clouda.device.contact.find();
		
		/* var contacts = "";
		data.forEach(function(obj){
			contacts += getContact(obj);
		});
		contactbox.innerHTML = contacts; */
		
	});
	
})(document);

	
	