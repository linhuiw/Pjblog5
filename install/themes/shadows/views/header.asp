<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title><%=data.global.blog_name%></title>
<meta name="keywords" content="<%=data.global.blog_keywords%>" />
<meta name="description" content="<%=data.global.blog_description%>" />
<link href="<%=data.theme.dir%>/css/base.css" rel="stylesheet">
<link href="<%=data.theme.dir%>/css/index.css" rel="stylesheet">
<link href="<%=data.theme.dir%>/css/media.css" rel="stylesheet">
<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0">
<!--[if lt IE 9]>
<script src="<%=data.theme.dir%>/js/modernizr.js"></script>
<![endif]-->
</head>
<body>
<div class="ibody">
  <header>
    <h1><%=data.global.blog_title%></h1>
    <h2><%=data.global.blog_des%></h2>
    <div class="logo"><a href="<%=iPress.setURL("page", "home")%>"></a></div>
    <nav id="topnav">
    	<ul>
    	<%data.categories.queens.forEach(function(o){%>
    		<li><a href="<%=o.src%>" id="<%=sups.isActiveNaved.apply(sups, o.mark) ? "topnav_current" : ""%>"><%=o.cate_name%></a>
            <%if ( o.items && o.items.length > 0 ){%>
            	<ul>
                <%o.items.forEach(function(z){%>
                	<li><a href="<%=z.src%>" id="<%=sups.isActiveNaved.apply(sups, z.mark) ? "topnav_current" : ""%>"><%=z.cate_name%></a></li>
                <%});%>	
                </ul>
            <%};%>
            </li>
    	<%});%>
    	</ul>
    </nav>
  </header>