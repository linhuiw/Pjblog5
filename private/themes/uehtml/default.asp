<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%include("private/themes/" + data.global.blog_theme + "/head.asp", { global: data.global });%>
<title><%=data.global.blog_name%></title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/header.asp", { categorys: data.categorys, gets: data.gets, global: data.global, user: data.user })%>
<div class="banner">
	<div id="bannerbody"><p><%=data.global.blog_title%></p><p><%=data.global.blog_des%></p><p><a href="http://www.uemo.net" target="_blank">什么是UEMO</a></p></div>
</div>
<div id="sooptions">
	<div class="wrap">
    	<div id="socontent">
        文本区域
        </div>
    </div>
</div>
<div id="content">
	<div class="wrap">
    	<div class="citem" id="citemslide"></div>


    	<div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
        <div class="citem"></div>
    </div>
</div>
<script type="text/javascript">
require('<%="private/themes/" + data.global.blog_theme + "/js/default"%>', function(common){new common();});
</script>
</body>
</html>