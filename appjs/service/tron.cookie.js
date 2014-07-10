// JavaScript Document
exports.set = function(key, param, value){
	if ( value === undefined ){
		Response.Cookies(key) = param;
	}
	else{
		Response.Cookies(key)(param) = value;
	}
};

exports.get = function(key, param){
	if ( param === undefined ){
		return Request.Cookies(key);
	}
	else{
		return Request.Cookies(key)(param);
	}
};

exports.expire = function(key, timer){
	var date = require("date"),
		nowStamp = new Date().getTime() + timer;
	
	Response.Cookies(key).Expires = date.format(new Date(nowStamp), "y-m-d h:i:s");
};

exports.clear = function(key){
	Response.Cookies(key).Expires = "1980-1-1 0:0:0";
};