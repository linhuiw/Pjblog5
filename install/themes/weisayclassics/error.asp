<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/style.css" />
<title>错误页面信息 - <%=error%></title>
</head>
<body>
<div id="page">
<div id="head">
<div id="header">
<div class="logo">
	<div id="blogname"><a href="<%=blog.web%>"><%=data.global.blog_name%></a>
    <div id="blogtitle"><%=data.global.blog_title%></div></div> 
</div>
<div class="clear"></div>
</div>
</div>
<div class="mainmenus">
<div class="mainmenu">
<div class="topnav">
<%sups.include("navigation.asp");%>
</div>
<div class="clear"></div>
</div>
</div>



<div id="content" style="margin:50px 0 50px 0;text-align:center">
<h3>错误页面信息：<%=error || "未找到错误信息"%></h3> 
</div>

</div>
<div class="clear"></div>
<%sups.include("footer.asp");%>
</body>
</html>