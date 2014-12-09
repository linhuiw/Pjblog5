<!--#include file="public/config.asp" -->
<%
	// 连接数据库
	require('public/library/connect');
		
	// 测试代码写在这
	modules.debug = true;
	var cfg = require("setting");
	var data = {};
	for (var i in cfg) {
		data[i] = cfg[i]
	}
	fs(contrast("config.json")).create(JSON.stringify(data)).stop();
	
	// 关闭数据库
	try{
		blog.conn.Close();
	}catch(e){};	
%>