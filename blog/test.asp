<!--#include file="public/config.asp" -->
<%
	// 连接数据库
	require('public/library/connect');
		
	// 测试代码写在这
	modules.debug = true;
	var modlimit = require(":public/library/limits");
	var objlimit = new modlimit();
	var data  = {id: 8, code_name: "获取日志", code_mark: "GetArticles", code_des: "呢只啊测格", code_isystem: true};
	var msg = objlimit.remove(8);
	console.log(msg);
	
	// 关闭数据库
	try{
		blog.conn.Close();
	}catch(e){};	
%>