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
			location.href = "http://demoofruntime.duapp.com/demo/";
		});
		
		clouda.device.contact.getCursor(["*"], 0, 20, {
			onsuccess : function(data){
				var contacts = "";
				var i = 0, l = data.length;
				for(var i = 0; i < l; i++){
					var username = data[i].displayName;
					var mobile = data[i].phoneNumbers;
					if(username && mobile && mobile[0]){
						var c = getContact(username, mobile[0].value);
						contacts += c;
					}
				}
				contactbox.innerHTML = contacts;
			},
			onfail : function(err){
				console.log(err);
			}
		});
	});
	
})(document);

	
	