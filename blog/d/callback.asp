<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
	var http = require("http");
	var ajax = new http.ajax();
	http = http.http;
	var code = http.query("code");
	var fns = require("fns");
	var r = fns.randoms(6);
	var state = http.query("state");
	
	var tokens = fns.unParams(ajax.get("http://app.webkits.cn/oauth/token.asp", {
		grant_type: "authorization_code",
		client_id: "10001",
		client_secret: "3f711c6da132cedab8ac1a9d9ac867bb5280f939",
		code: code,
		redirect_uri: "http%3A//webkits.cn/callback.asp"
	}));

	if ( tokens.access_token ){
		var openidcallback = fns.jsonp(ajax.get("http://app.webkits.cn/oauth/me.asp", {
			access_token: tokens.access_token
		}), "callback");
		Library.log("openid:" + openidcallback.openid + "<br />");
		Library.log("token:" + tokens.access_token + "<br />");
		Library.log("client_id:" + openidcallback.client_id + "<br />");
		Library.log("验证成功，您可以记录下您的token和openid了");
		Library.log("<hr />");
		Library.log("开始获取用户信息<br />");
		Library.log("地址：http://app.webkits.cn/oauth/get_user_info.asp?" + fns.params({
			access_token: tokens.access_token,
			oauth_consumer_key: "10001",
			openid: openidcallback.openid
		}) + "<br />");
		var users = ajax.getJSON("http://app.webkits.cn/oauth/get_user_info.asp", {
			access_token: tokens.access_token,
			oauth_consumer_key: "10001",
			openid: openidcallback.openid
		});
		
		if ( !users.error ){
			for ( var i in users ){
				Library.log(i + ": " + users[i] + "<br />");
			}
		}else{
			Library.json(users.error);
		}
	}else{
		Library.log(tokens.error);
	}
%>
