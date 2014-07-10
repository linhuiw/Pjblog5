<%
	var date = require("date");
%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/reset.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/common.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/default.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/fontawesome/css/font-awesome.min.css"/>
<title><%=data.global.blog_name%></title>
</head>

<body>
<div class="top">
	<div class="wrap clearfix">
    	<div class="logo fleft">
        	<%=data.global.blog_title%>
        	<div class="logo-title"><%=data.global.blog_des%></div>
        </div>
        <div class="tools fright">
        	<%
				if ( data.user.login ){
			%>
        	<p><i class="fa fa-info-circle"></i> 欢迎回来，<%=data.user.nick%>。 <a href="<%=data.user.href%>"><i class="fa fa-sign-out"></i> 退出登录</a> <%
				if ( data.user.group.indexOf("ControlSystem") > -1 ){
			%>
            <a href="control.asp"><i class="fa fa-sign-in"></i> 进入后台</a>
            <%	
				}
			%></p>
            <%
				}else{
			%>
            <a href="<%=data.user.href%>"><i class="fa fa-sign-in"></i> 登录</a>
            <%	
				}
			%>
        </div>
    </div>
</div>
<%include("private/themes/" + data.global.blog_theme + "/navigation.asp", { categorys: data.categorys, gets: data.gets });%>
<div class="articles clearfix wrap">
	<div class="side fright">1</div>
	<div class="list">
    	<%
			if ( data.gets.tag ){
		%>
        <h6><i class="fa fa-tag"></i> 标签： <%=data.gets.tag.tag_name%></h6>
        <%	
			};
			
			for ( var i = 0 ; i < data.articles.length ; i++ ){
		%>
        	<div class="article clearfix">
            	<div class="img"><img src="<%=data.articles[i].cover%>" onerror="this.src='<%=blog.web%>/private/themes/<%=data.global.blog_theme%>/a.png'" /></div>
                <div class="content">
            		<h1><a href="<%=blog.web%>/article.asp?id=<%=data.articles[i].id%>"><%=data.articles[i].title%></a></h1>
                    <div class="info">发表于 <%=date.format(new Date(data.articles[i].posttime), "y-m-d h:i:s")%></div>
                    <div class="des"><%=data.articles[i].des%></div>
                    <div class="cate"><i class="fa fa-star-o"></i> <a href="<%=data.articles[i].catehref%>"><%=data.articles[i].category%></a><%
						if ( data.articles[i].tags.length > 0 ){
					%>
                    <i class="fa fa-xing"></i> 
                    <%	
							for( var o = 0 ; o < data.articles[i].tags.length ; o++ ){
					%>
                    <a href="<%=data.articles[i].tags[o].href%>"><%=data.articles[i].tags[o].tag_name%></a>
                    <%		
							}
						}
					%></div>
                </div>
            </div>
        <%	
			};
		%>
    </div>
</div>
</body>
</html>