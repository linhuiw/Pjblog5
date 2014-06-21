<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
	var http = require("http");
	var ajax = new http.ajax();
	http = http.http;
	var code = http.query("code");
	var fns = require("fns");
	var r = fns.randoms(6);
	
	var tokens = fns.unParams(ajax.get("http://cloud.cn/oauth/token.asp", {
		grant_type: "authorization_code",
		client_id: "10001",
		client_secret: "BB92lcY9nGsjEJWeTSHmIIIHBm1clDVH6zgjZk3w",
		code: code,
		state: r
	}));
	
	if ( tokens.access_token ){
		var openidcallback = fns.jsonp(ajax.get("http://cloud.cn/oauth/me.asp", {
			access_token: tokens.access_token
		}), "callback");
		Library.log("openid:" + openidcallback.openid + "<br />");
		Library.log("client_id:" + openidcallback.client_id + "<br />");
	}
%>
