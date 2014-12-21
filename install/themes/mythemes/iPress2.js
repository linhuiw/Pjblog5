(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define([], mod);
    }
    else {
        window.iPress = mod();
    }
})(function () {
	var iPress = new Class(function(){
	});
	iPress.add('PressURL', function(token){
		var outTokens = {
			controler: 'page',
			searchers: {},
			views: 'home'
		};
		var is_outTokens=false;
		var tokens = token.split(':');
		if ( tokens.length > 1 ){
			outTokens.controler = tokens[0];
			tokens = tokens[1].split('.');
			if ( tokens.length > 1 ){
				tokens = tokens[0].split('-');
				tokens.forEach(function(value){
					if ( /^\@/.test(value) ){
						outTokens.views = value.replace(/^\@/, '');
						is_outTokens=true;
					}
					else if ( /(\w+)(\(([^\)]+)\))?/.test(value) ){
						var params = /(\w+)(\(([^\)]+)\))?/.exec(value);
						if ( params && params[1] ){
							outTokens.searchers[params[1]] = params[3] || '';
							is_outTokens=true;
						}
					}
				});
			}
		}
		if (is_outTokens==false&&token!=""){
			Response.Status = "404 Not Found";
			console.log('<\!DOCTYPE html><html lang="zh-CN"><head><title>404 Not Found</title></head><body><h2>404 Not Found</h2></body></html>');
			Response.end();
		}
		return outTokens;
	});
	return iPress;
	
});