<!--#include file="public/config.asp" -->
<!--#include file="public/vb.support.asp" -->
<%
/*
 * # Project Name  iPress Animal Run On PJBlog5 
 * # Date: 2014/12/10 lastest version.
 * # Author: evio 
 * # Email: evio@vip.qq.com
 * # Site: http://webkits.cn
 * # Project base on github address: 
 *          url: https://github.com/linhuiwu/Pjblog5
 *          ssh: git@github.com:linhuiwu/Pjblog5.git
 * @ Join Us:
 *          mail to: evio@vip.qq.com
 * ? fork us on github.
 */
 
;(function( iPressModule ){

	var GlobalCache = require(":private/caches/global.json");
	var themeFolder = GlobalCache.blog_theme;
	
	// 调用主题自定义iPress的URL规范
	if ( themeFolder && themeFolder.length > 0 ){
		fs(resolve(":private/themes/" + themeFolder + "/iPress.js")).exist().then(function(){
			iPressModule.extend(require(":private/themes/" + themeFolder + "/iPress.js"));
		});
	};

	// 初始化iPress全局运行机制框架模块
	iPress = new iPressModule();
	
	// 为iPress添加新的路由
	iPress.iControler.set(contrast("public/router.json"));
	// 连接数据库
	require("public/library/connect");
	
	var users = require("public/library/user");
	var user = new users();
	var info = user.status();
	
	// 检查权限
    blog.user = info || {}; // 用户信息全局参数
    blog.admin = info.status === 2; // 是否为管理员
    blog.login = info.status >= 1; //  是否已登陆
	
	// 设置control进入事件
	iPress.iEvent.set("control", function(){ return blog.admin; }); // 后台页面模式
	iPress.iEvent.set("async", function(){ return blog.admin; }); // 后台请求模式
	iPress.iEvent.set("msync", function(){ return blog.login; }); // 通用登陆请求模式
	
	// 渲染页面或者请求
	iPress.render();

	// 关闭数据库
	try{ blog.conn.Close(); }catch(e){};	
	
	// 出错提示
	if ( iPress.error > 0 ){ Response.Redirect(iPress.setURL("page", "error", { id: iPress.error })); };
	
})( require("iPress") );
%>