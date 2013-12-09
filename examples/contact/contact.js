(function(doc){
	
	function getContact(name, mobile){
		var tmpl = ['<li>',
						'<div class="avatar"></div>',
						'<div class="info">',
							'<div class="username">', name, '</div>',
							'<div class="mobile">', mobile, '</div>',
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
		
		clouda.device.contact.find(["*"], {
			onsuccess : function(data){
				var contacts = "";
				console.log(data.length);
				data.forEach(function(item){
					var username = item.displayName;
					var mobile = item[clouda.device.CONTACT_COLUMN.PHONE];
					if(username && mobile && mobile[0]){
						var c = getContact(username, mobile[0].value);
						contacts += c;
					}
				});
				contactbox.innerHTML = contacts;
			},
			onfail : function(err){
				console.log(err);
			}
		});
	});
	
})(document);

	
	