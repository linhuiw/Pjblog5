<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;
	var fns = require("fns"),
		http = require("http").http,
		global = require("private/chips/" + blog.cache + "blog.global"),
		from = http.query("from") || "default.asp",
		rand = fns.randoms(10);
		
	Session(blog.cookie + "_oauth_jump") = rand;
		
	var callbackURL = blog.web + '/oauth.asp';
	if ( from && from.length > 0 ){
		callbackURL += '?from=' + from;
	};
	
	callbackURL = escape(callbackURL);
	callbackURL = blog.AppPlatForm + "/oauth/login?response_type=code&client_id=" + global.blog_appid + "&redirect_url=" + callbackURL + "&state=" + rand;
	
	Response.Redirect(callbackURL);
%>