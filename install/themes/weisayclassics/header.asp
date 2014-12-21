<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<%sups.include("seo.asp");%>
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/style.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/notice.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/fontawesome/css/font-awesome.min.css"/>
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/appjs/assets/blog.loading.css"/>
<script type="text/javascript" src="http://libs.useso.com/js/jquery/1.8.3/jquery.min.js"></script>
<script type="text/javascript" src="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/js/weisay.js"></script>
<script type="text/javascript" src="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/js/lazyload.js"></script>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/tron.js"></script>
<script type="text/javascript" src="<%=blog.web%>/private/configs/assets.js"></script>
<%if ( sups.position("article") ) {%>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/ueditor/third-party/SyntaxHighlighter/shCore.js"></script>
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/appjs/assets/ueditor/third-party/SyntaxHighlighter/shCoreDefault.css"/>
<script class="javascript">
SyntaxHighlighter.all();
</script> 
<%};%>
<script type="text/javascript">
	jQuery(function() {
    	jQuery(".article img, .articles img").not("#respond_box img").lazyload({
        	placeholder:"<%=blog.web + "/private/themes/" + data.global.blog_theme%>/images/image-pending.gif",
            effect:"fadeIn"
          });
    	});
</script>
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