<!--#include file="public/config.asp" -->
<%
;(function(iPressModule){
	// 初始化iPress全局运行机制框架模块
	iPress = new iPressModule();
	// 为iPress添加新的路由
	iPress.iControler.set(contrast('public/router.json'));
	// 连接数据库
	require('public/library/connect');
	// 渲染页面或者请求
	iPress.render();
	// 出错提示
	if ( iPress.error > 0 ){
		Response.clear();
		console.log(iPress.errors[iPress.error + '']);
	}
	// 关闭数据库
	try{
		blog.conn.Close();
	}catch(e){};	
})(require('iPress'));
%>