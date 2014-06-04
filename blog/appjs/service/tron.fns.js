// JavaScript Document
exports.extend = function(source, target){
	for ( var items in target ){
		source[items] = target[items];
	}
	return source;
}

exports.randoms = function(l){
	var x = "123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
 	var tmp="";
 	for( var i = 0 ; i < l; i++ ) {
 		tmp += x.charAt(Math.ceil(Math.random()*100000000) % x.length);
 	}
 	return tmp;
}

exports.getIP = function(){
	var userip = String(Request.ServerVariables("HTTP_X_FORWARDED_FOR")).toLowerCase();
	if ( userip == "undefined" || userip === undefined ) userip = String(Request.ServerVariables("REMOTE_ADDR")).toLowerCase();
	return userip;
}

exports.type = function(obj){
	return Object.prototype.toString.call(obj).split(" ")[1].toLowerCase().replace("]", "");
}