<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%include("private/themes/" + data.global.blog_theme + "/head.asp", { global: data.global });%>
<title>错误页面信息 - <%=data.error%></title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/header.asp", { categorys: data.categorys, gets: data.gets, global: data.global, user: data.user, themes: data.themes })%>
<div class="banner">
	<div id="bannerbody"><p>错误页面信息</p><p></p><p></p></div>
</div>
<div id="content" class="common">
	<div class="wrap">
    <div class="art-comments">
        <div class="comment" id="comment">
			<h6>错误信息:</h6>
            <div class="des"><%=data.errors[data.error] || "未找到错误信息"%></div>
        </div>
    </div>
    </div>
</div>
<%include("private/themes/" + data.global.blog_theme + "/footer.asp", { global: data.global });%>
</body>
</html>