<div id="cloud-themes"></div>
<%
;(function(marks){
	fs.dirList(contrast("private/themes"), function(name){
		var config = "private/themes/" + name + "/config.js";
		if ( fs.exist(resolve(config)) ){
			var x = require(config);
			if ( x.mark && x.mark.length > 0 ){
				marks.push({mark: x.mark, version: x.version || 1});
			}
		}
	});
	
	LoadJscript(function(marks){
		window.installeds = marks;
	}, marks);
})([]);
%>