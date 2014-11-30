<div class="plu-content" id="cloud-plugins"></div>
<%
;(function(marks){
	fs.dirList(contrast("private/plugins"), function(name){
		var config = "private/plugins/" + name + "/config.js";
		if ( fs.exist(resolve(config)) ){
			var x = require(config);
			if ( x.mark && x.mark.length > 0 ){
				marks.push(x.mark);
			}
		}
	});
	
	LoadJscript(function(marks){
		window.installeds = marks;
	}, marks);
})([]);
%>