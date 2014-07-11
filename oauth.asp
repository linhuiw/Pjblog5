<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( http, fns, global ){
	var code = fns.HTMLStr(fns.SQLStr(http.query("code"))),
		from = http.query("from"),
		OAUTH = require("public/library/oauth2"),
		oauth = new OAUTH.oauth(global.blog_appid, global.blog_appkey),
		UserMessage;
	
	var tokens = oauth.GetToken(code);
	if ( oauth.error === 0 ){
		var openids = oauth.GetUserOpenID(tokens.access_token);
		if ( oauth.error === 0 ){
			UserMessage = oauth.GetUserInfo(tokens.access_token, openids.openid);
		};
	};
	
	if ( oauth.error === 0 ){
		UserMessage.token = tokens.access_token;
		UserMessage.openid = openids.openid;
		UserMessage.hashkey = tokens.token_hashkey;
		UserMessage.expires_in = tokens.expires_in;
		var login = oauth.doLogin(UserMessage);

		if ( login.success ){
			Response.Redirect(from);
		}else{
			Library.log(login.message);
		}
	}else{
		var ErrorMessage = require("public/library/error");
		Library.log(ErrorMessage[oauth.error + ""]);
	}
		
})( require("http").http, require("fns"), require("private/chips/" + blog.cache + "blog.global") );
%>