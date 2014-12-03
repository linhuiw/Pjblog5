<!--#include file="tron.min.asp" -->
<%;
var iPress;
var blog = (function( base ){
	var i = 0, j = 10;
	var getBase = function(path){
		if ( i > j ){ return base; }
		i++;
		var geted = false;
		fs(contrast(path)).exist().then(function(){
			geted = true;
		});
		if ( geted ){ return path; }else{ return getBase("../" + path); };
	};
	base = getBase(base);
	return require(base);
})("private/config.json");
blog.conn = null;
modules.setBase(blog.base);
%>