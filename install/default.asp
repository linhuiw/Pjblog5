<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="../public/map.asp" -->
<%;(function( install ){%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="setup.css"/>
<title>PJBlog5 安装程序</title>
</head>
<body>
<%;var that = new install();%>
<!--<div class="wrap header">
	<div class="controler">
    	<div class="order">1</div>
        <div class="info">协议</div>
    </div>
</div>-->
<%
	if ( that.error && that.error.length > 0 ){
%>
    <div class="wrap">
        <div class="content copyright shadow">
            <p><%=that.error%></p>
        </div>
        <div class="step"><a href="?step=1" class="btn">重新安装</a></div>
    </div>
<%		
	}else{
		that.render();
	}
%>
</body>
</html>
<%})( require("./install") );%>