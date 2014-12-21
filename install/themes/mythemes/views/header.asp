<%
var fns = require('ifns')
%>

































<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" /><meta http-equiv="Cache-Control" content="no-transform " /> 
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta property="qc:admins" content="11400643356455676654" />
<meta property="wb:webmaster" content="3cd4bed87509bfc5" />
<meta name="msvalidate.01" content="9B2969A9DB4DA29C915FE51B263D8FCF" />
<meta name="google-site-verification" content="LvuYw7bHLL8n46hEWCxPPYEx8-2R8zfCooemOLx1BSk" />
<meta name="chinaz-site-verification" content="081e7651-48c6-4c2f-a569-99321685eab1" />
<script></script><!--[if lte IE 8]><script></script><![endif]-->
<link rel="Bookmark" href="/favicon.ico" /><link rel="shortcut icon" href="/favicon.ico" />
<title><%=data.global.blog_name%></title>
<meta name="keywords" content="<%=fns.HTMLStr(data.global.blog_keywords)%>" />
<meta name="description" content="<%=fns.HTMLStr(data.global.blog_description)%>" />
<link href="<%=data.theme.dir%>/css/bootstrap.min.css" rel="stylesheet">
<link href="<%=data.theme.dir%>/css/dmeng-2.0.9.1.css" rel="stylesheet">
<script type='text/javascript' src='http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js?ver=1415419703'></script>
<script src="<%=data.theme.dir%>/js/bootstrap.min.js"></script>
<script src="<%=data.theme.dir%>/js/dmeng-2.0.9.1.js"></script>
</head>
<body class="archive category category-wordpress-theme-development category-2">
<header id="masthead" itemscope itemtype="http://schema.org/WPHeader">
	<div class="container header-content">
		<div class="row">
			<div class="col-lg-8 col-md-7 col-sm-6 col-xs-12">
				<div class="header-logo"><a href="<%=iPress.setURL("page", "home")%>" rel="home"><img src="<%=data.theme.dir%>/images/screenshot_64.png" width="64" height="64" alt="<%=data.global.blog_title%>" /></a></div>
				<div class="header-text">
					<div class="name"><a href="<%=iPress.setURL("page", "home")%>" rel="home" id="name"><%=data.global.blog_title%></a></div>
					<div class="description" id="desc"><%=data.global.blog_des%></div>
<!--

      <p><%=data.theme.setting.title_1%></p>
      <p><%=data.theme.setting.title_2%></p>
-->
				</div>
			</div>
			<div class="col-lg-4 col-md-5 col-sm-6 col-xs-12">
<%sups.contain("side-user.asp")%>
			</div>
		</div>
	</div>
	<div class="navbar navbar-default navbar-static-top" role="banner">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".header-navbar-collapse"><span class="sr-only">切换菜单</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
				<a class="navbar-brand" href="<%=iPress.setURL("page", "home")%>" rel="home" itemprop="headline"><%=data.global.blog_title%></a>
			</div>
			<nav id="navbar" class="collapse navbar-collapse header-navbar-collapse" role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">
				<ul class="nav navbar-nav">
<%
data.categories.queens.forEach(function(o){
%><li<%if (sups.isActiveNaved.apply(sups, o.mark)){%> class="dropdown active"<%}%>><a href="<%=o.src%>" itemprop="url"><!--<span class="glyphicon glyphicon-th-large"></span>--><%=o.cate_name%></a></li><!----><%
});
%>
<!--<li class="dropdown active"><a href="/" data-toggle="dropdown" class="dropdown-toggle" itemprop="url"><span class="glyphicon glyphicon-book"></span> url <span class="caret"></span></a></a><ul class="dropdown-menu" role="menu"><li><a href="/" itemprop="url">url</a></li><li role="presentation" class="dropdown-header">dropdown-header</li><li class="divider"></li></ul></li><li><a href="/" itemprop="url"><span class="glyphicon glyphicon-gift"></span>gift</a></li>-->

				</ul>
				<ul class="nav navbar-nav navbar-right"><li class="btn btn-default"><a href="/" itemprop="url"><span class="glyphicon glyphicon-indent-left"></span> 友情链接</a></li><li><a href="#about" itemprop="url">关于本站</a></li></ul>
				<!--<form class="navbar-form navbar-left" role="search" method="get" id="searchform" action="/">
					<div class="form-group">
						<input type="text" class="form-control" placeholder="搜索 &hellip;" name="s" id="s" required>
					</div>
					<button type="submit" class="btn btn-default" id="searchsubmit"><span class="glyphicon glyphicon-search"></span></button>
				</form>-->
			</nav><!-- #navbar -->
		</div>
	</div>
</header><!-- #masthead -->