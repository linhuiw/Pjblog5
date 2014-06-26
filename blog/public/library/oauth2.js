// JavaScript Document
function randoms(l){
	var x = "123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
 	var tmp="";
 	for( var i = 0 ; i < l; i++ ) {
 		tmp += x.charAt(Math.ceil(Math.random()*100000000) % x.length);
 	}
 	return tmp;
};

var oauth = new Class({
	initialize: function( appid, appkey ){
		var http = require("http");
		
			this.ajax = new http.ajax();
			this.http = http.http;
			this.fns = require('fns');
		
		this.appid = appid;
		this.appkey = appkey;
		
		this.error = 0;
	}
});

oauth.extend('GetToken', function( code ){
	var ret = this.ajax.getJSON(blog.AppPlatForm + "/oauth/token.asp", {
		grant_type: "authorization_code",
		client_id: this.appid,
		client_secret: this.appkey,
		code: code,
		redirect_uri: blog.web + '/oauth.asp',
		format: 'json'
	});
	
	if ( ret.error && ret.error > 0 ){
		this.error = ret.error;
	}
	
	return ret;
});

oauth.extend('GetUserOpenID', function( token ){
	var ret = this.fns.jsonp(this.ajax.get(blog.AppPlatForm + "/oauth/me.asp", { access_token: token }), "callback");
	
	if ( ret.error && ret.error > 0 ){
		this.error = ret.error;
	};
	
	return ret;
});

oauth.extend('GetUserInfo', function( token, openid ){
	var ret = this.ajax.getJSON(blog.AppPlatForm + "/oauth/get_user_info.asp", {
		access_token: token,
		oauth_consumer_key: this.appid,
		openid: openid
	});
	
	if ( ret.error && ret.error > 0 ){
		this.error = ret.error;
	};
	
	return ret;
});

oauth.extend('doLogin', function(params){
	var Member = require("../services/user"),
		member = new Member();
	
	return member.OauthLogin(params);
});

exports.GetAuthorizeURL = function( appid, isadmin ){
	var callbackURL = escape(blog.web + '/oauth.asp?from=' + (isadmin ? 'control.asp' : 'default.asp'));
	return blog.AppPlatForm + "/oauth/login.asp?response_type=code&client_id=" + appid + "&redirect_url=" + callbackURL + "&state=" + randoms(10);
};

exports.oauth = oauth;