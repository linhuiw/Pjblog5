<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>留言-<%=data.global.blog_name%></title>
<meta name="description" content="<%=data.global.blog_name%>的留言页面，欢迎留言。" />
<meta name="keywords" content="留言,message" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/style.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/notice.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/fontawesome/css/font-awesome.min.css"/>
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/appjs/assets/blog.loading.css"/>
<script type="text/javascript" src="http://libs.useso.com/js/jquery/1.8.3/jquery.min.js"></script>
<script type="text/javascript" src="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/js/weisay.js"></script>
<script type="text/javascript" src="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/js/lazyload.js"></script>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/tron.js"></script>
<script type="text/javascript" src="<%=blog.web%>/private/configs/assets.js"></script>
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
</div><div id="roll"><div title="回到顶部" id="roll_top"></div><div title="查看评论" id="ct"></div><div title="转到底部" id="fall"></div></div>
<div id="content">
<div class="main vcard">
<div id="map">
<div class="site">当前位置： <a title="返回首页" href="<%=blog.web%>">首页</a> &gt; 留言</div>
</div>
<div class="article article_c">
			<%sups.plugin("comments", { sups: sups, user: data.user, data: data, id: 0, page: reqs.query.page || 1, url: blog.web + "/plugin.asp?id=" + data.plugin.id });%>
    </div>
	</div>
	
<%sups.include("sidebar.asp");%>

</div>
</div>
<div class="clear"></div>
<%sups.include("footer.asp");%>
<script type="text/javascript" language="javascript">
require('private/themes/<%=data.global.blog_theme%>/js/comment', function( book ){ typeof book === 'function' && new book(); });
</script>
</body>
</html>