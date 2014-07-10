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

exports.unParams = function( str ){
	var s = str.split("&"),
		j = {};
	for ( var i = 0 ; i < s.length ; i++ ){
		var k = s[i].split("=");
		j[k[0]] = k[1];
	}
	
	return j;
}

exports.params = function( keyCode ){
	if ( !keyCode || keyCode === null || keyCode === false || keyCode === undefined ){
		return null;
	};
	
	if ( typeof keyCode === "object" ){
		var ret = [], i;

		for ( i in keyCode ){
			ret.push(i + "=" + keyCode[i]);
		}

		return ret.join("&");
	}else{
		return keyCode;
	}
}

exports.jsonp = function( str , callback ){
	var c = {};
	c[callback] = function( jsons ){ return jsons; };
	var a = new Function("return this." + str);
	return a.call(c);
}

exports.SQLStr = function( str ){
	if ( !str ){
		return "";
	}
	try{
		str = str + "";
	}catch(e){
		return "";
	}
	var reglist = [
		[/(w)(here)/ig, "$1h&#101;re"],
		[/(s)(elect)/ig, "$1el&#101;ct"],
		[/(i)(nsert)/ig, "$1ns&#101;rt"],
		[/(c)(reate)/ig, "$1r&#101;ate"],
		[/(d)(rop)/ig, "$1ro&#112;"],
		[/(a)(lter)/ig, "$1lt&#101;r"],
		[/(d)(elete)/ig, "$1el&#101;te"],
		[/(u)(pdate)/ig, "$1p&#100;ate"],
		[/(\s)(or)/ig, "$1o&#114;"],
		[/(java)(script)/ig, "$1scri&#112;t"],
		[/(j)(script)/ig, "$1scri&#112;t"],
		[/(vb)(script)/ig, "$1scri&#112;t"],
		[/(expression)/ig, "e&#173;pression"],
		[/(c)(ookie)/ig, "&#99;ookie"],
		[/(Object)/ig, "&#79;bject"],
		[/(script)/ig, "scri&#112;t"]
	];

	for ( var i = 0 ; i < reglist.length ; i++ ){
		str = str.replace( reglist[i][0], reglist[i][1] );
	}

	return str;
}

exports.unSQLStr = function( str ){
	if ( !str ){
		return "";
	}
	try{
		str = str + "";
	}catch(e){
		return "";
	}
	var reglist = [
		[/(w)(h&#101;re)/ig, "$1here"],
		[/(s)(el&#101;ct)/ig, "$1elect"],
		[/(i)(ns&#101;rt)/ig, "$1nsert"],
		[/(c)(r&#101;ate)/ig, "$1reate"],
		[/(d)(ro&#112;)/ig, "$1rop"],
		[/(a)(lt&#101;r)/ig, "$1lter"],
		[/(d)(el&#101;te)/ig, "$1elete"],
		[/(u)(p&#100;ate)/ig, "$1pdate"],
		[/(\s)(o&#114;)/ig, "$1or"],
		[/(java)(scri&#112;t)/ig, "$1script"],
		[/(j)(scri&#112;t)/ig, "$1script"],
		[/(vb)(scri&#112;t)/ig, "$1script"],
		[/(e&#173;pression)/ig, "expression"],
		[/&#99;(ookie)/ig, "c$1"],
		[/&#79;(bject)/ig, "O$1"],
		[/(scri)&#112;(t)/ig, "$1p$2"]
	];

	for ( var i = 0 ; i < reglist.length ; i++ ){
		str = str.replace( reglist[i][0], reglist[i][1] );
	}

	return str;
}

exports.HTMLStr = function( str ){
	if ( !str ){
		return "";
	}
	try{
		str = str + "";
	}catch(e){
		return "";
	}
	var reglist = [
		[/\</g, "&#60;"],
		[/\>/g, "&#62;"],
		[/\'/g, "&#39;"],
		[/\"/g, "&#34;"]
	];
	
	for ( var i = 0 ; i < reglist.length ; i++ ){
		str = str.replace( reglist[i][0], reglist[i][1] );
	}
	
	return str;
}

exports.removeHTML = function(html){
	return html.replace(/\<[^>]+\>/g, '');
}

exports.unHTMLStr = function( str ){
	if ( !str ){
		return "";
	}
	try{
		str = str + "";
	}catch(e){
		return "";
	}
	var reglist = [
		[/\&\#60\;/g, "<"],
		[/\&\#62\;/g, ">"],
		[/\&\#39\;/g, "'"],
		[/\&\#34\;/g, '"']
	];

	for ( var i = 0 ; i < reglist.length ; i++ ){
		str = str.replace( reglist[i][0], reglist[i][1] );
	}

	return str;
}

exports.textareaStr = function( str ){
	if ( !str ){
		return "";
	}
	try{
		str = str + "";
	}catch(e){
		return "";
	}
	var reglist = [
		[/textarea/ig, "t&#101;xtarea"]
	];

	for ( var i = 0 ; i < reglist.length ; i++ ){
		str = str.replace( reglist[i][0], reglist[i][1] );
	}

	return str;
}

exports.unTextareaStr = function( str ){
	if ( !str ){
		return "";
	}
	try{
		str = str + "";
	}catch(e){
		return "";
	}
	var reglist = [
		[/t&#101;xtarea/ig, "textarea"]
	];

	for ( var i = 0 ; i < reglist.length ; i++ ){
		str = str.replace( reglist[i][0], reglist[i][1] );
	}

	return str;
}

/*
 * s: 字符串
 * n: 切割字数
 * c: 是否使用中文编排
 * r: 省略的符号
 */
exports.cutStr = function( s, n, c, r ){
	if ( !s ){
		return "";
	}
	try{
		s = s + "";
	}catch(e){
		return "";
	}
	var _s = "", j = 0;
	for ( var i = 0 ; i < s.length ; i++ ){
		var t = s.charAt(i);
			if ( c ){
				var g = /[^\u4E00-\u9FA5]/g.test(t);
					if ( g && ( j + 1 <= n ) ){
						j++;
						_s += t;
					}else{
						if ( j + 2 <= n ){ 
							j = j + 2; 
							_s += t;
						}else{ break; }
					}
			}else{
				if ( j + 1 <= n ){ 
					j++; 
					_s += t; 
				}else{ break; }
			}
	}
	if ( _s != s ){ _s += (r || "...") };
	return _s;
}