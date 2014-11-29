<!--#include file="public/config.asp" -->
<%
;(function(iPressModule){
	// 初始化iPress全局运行机制框架模块
	iPress = new iPressModule();
	// 为iPress添加新的路由
	iPress.iControler.set(contrast('public/router.json'));
	// 连接数据库
	require('public/library/connect');
	
	iPress.errors['503'] = '抱歉，您没有权限进入';
	
	// 设置control进入事件
	iPress.iEvent.set('control', function(){
		var users = require('public/library/user');
		var user = new users();
		var info = user.status();
		if ( info.status !== 2 ){
			iPress.error = 503;
			return false;
		}else{
			blog.user = info;
		}
	});
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