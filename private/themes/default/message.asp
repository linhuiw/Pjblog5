<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/reset.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/common.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/default.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/notice.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/appjs/assets/blog.loading.css"/>
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/fontawesome/css/font-awesome.min.css"/>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/tron.js"></script>
<script type="text/javascript" src="<%=blog.web%>/private/configs/assets.js"></script>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/jquery.js"></script>
<title><%=data.global.blog_name%> - 留言本插件</title>
</head>
<body>
<%sups.include("navigation.asp");%>
<div class="articles clearfix wrap">
	<div class="side fright">
    	<%sups.include("side-login.asp");%>
        <%plugin("topcomments", { genre: 0, dis: "评论" });%>
        <%plugin("topcomments", { genre: 1, dis: "留言" });%>
    </div>
	<div class="list">
    	<div class="detail">
        	<%plugin("comments", { user: data.user, id: 0, page: data.page, global: data.global, url: blog.web + "/plugin.asp?id=" + data.id });%>
        </div>
    </div>
</div>
<%sups.include("footer.asp");%>
<script type="text/javascript" language="javascript">
require('private/themes/<%=data.global.blog_theme%>/js/comment', function( book ){ typeof book === 'function' && new book(); });
</script>
</body>
</html>