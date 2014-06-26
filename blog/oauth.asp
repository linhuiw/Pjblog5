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
		/*Library.json(UserMessage);
		{"nick":"沈赟杰","mail":"evio2@vip.qq.com","birthday":531072000000,"address":"浙江省杭州市滨江区东信大道逸天广场","website":"webkits.cn","sex":1,"avatar":"http://cloud.cn/avatars/default.png"}*/
		UserMessage.token = tokens.access_token;
		UserMessage.openid = openids.openid;
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
		
})( require("http").http, require("fns"), require("private/chips/blog.global") );
%>