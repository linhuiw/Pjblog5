// JavaScript Document
var oAuth = new Class({ version: '2.31' });
var error = require('./error');
var stop = false;
var value = null;
var http = require("http");
var ajax = new http.ajax();
var fns = require('fns');
http = http.http;

function FilterCallback(str){ 
	return fns.HTMLStr(fns.SQLStr(str)); 
};

oAuth.add('initialize', function( appid, appkey ){
	this.error = 0;
	this.appid = appid;
	this.appkey = appkey;
});

oAuth.add('then', function( callback ){
	if ( stop ){ return this; };
	
	if ( this.error === 0 ){
		if ( typeof callback === 'function' ){
			value = callback.call(this, value) || null;
		}
	}else{
		if ( this.ErrorCallback && typeof this.ErrorCallback === 'function' ){
			this.ErrorCallback.call(this, error[this.error + ''] || '未找到错误信息', this.error);
			stop = true;
		}
	}
	
	return this;
});

oAuth.add('reject', function( callback ){
	if ( typeof callback === 'function' ){
		this.ErrorCallback = callback;
	}
	
	return this;
});

oAuth.add('createServer', function( callback ){
	var that = this;
	http.createServer(function(reqs){
		typeof callback === 'function' && callback.call(that, reqs);
	}, FilterCallback);
});

oAuth.add('getToken', function( code ){
	var msg = ajax.getJSON(blog.AppPlatForm + "/oauth/token", {
		grant_type: "authorization_code",
		client_id: this.appid,
		client_secret: this.appkey,
		code: code,
		redirect_uri: blog.web + '/oauth.asp'
	});
	
	if ( msg.error && msg.error > 0 ){
		this.error = msg.error;
	}
	
	return msg.data;
});

oAuth.add('getOpenid', function(token){
	var msg = ajax.getJSON(blog.AppPlatForm + "/oauth/openid", { access_token: token });
	if ( msg.error && msg.error > 0 ){
		this.error = msg.error;
	}else{
		if ( msg.data.client_id == this.appid ){
			return msg.data;
		}else{
			this.error = 10017;
			delete msg.data;
		}
	}
});

oAuth.add('getUserInfo', function(token, openid){
	var msg = ajax.getJSON(blog.AppPlatForm + "/oauth/me", {
		access_token: token,
		oauth_consumer_key: this.appid,
		openid: openid
	});
	
	if ( msg.error && msg.error > 0 ){
		this.error = msg.error;
	}
	
	return msg.data;
});

oAuth.add('downloadApplications', function(mark, token, openid, folder){
	try{
		ajax.SaveFile(blog.AppPlatForm + "/oauth/appdownload", {
			access_token: token,
			oauth_consumer_key: this.appid,
			openid: openid,
			oauth_customer_mark: mark
		}, contrast('private/' + folder + '/' + mark + '.pbd'));
		
		var fso = require('fso'),
			fs = new fso();
		
		if ( fs.exist(contrast('private/' + folder + '/' + mark + '.pbd')) ){
			return { success: true, message: '下载资源成功' };	
		}else{
			return { success: false, message: '下载资源失败' };
		}
	}catch(e){
		return { success: false, message: e.message };
	}
});

return oAuth;
