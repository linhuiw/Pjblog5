<!--#include file="public/config.asp" -->
<%
(function( caches ){
	require("public/library/connect");
	var users = require("public/library/user");
	var user = new users();
	var info = user.status();
	
	// 检查权限
    blog.user = info || {}; // 用户信息全局参数
    blog.admin = info.status === 2; // 是否为管理员
    blog.login = info.status >= 1; //  是否已登陆
	
	var cache = new caches();
	cache.all();
	var themes = require(":public/library/theme");
	var theme = new themes();
	theme.install("default");
	blog.conn.Close();
	Response.Redirect("install/?m=oauth");
})( require(":public/library/cache") );
%>