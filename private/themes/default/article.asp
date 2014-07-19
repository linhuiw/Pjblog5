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
<title><%=data.article.art_title%></title>
</head>

<body>

<%include("private/themes/" + data.global.blog_theme + "/navigation.asp", { categorys: data.categorys, gets: data.gets, global: data.global });%>
<div class="articles clearfix wrap">
	<div class="side fright">
    	<%include("private/themes/" + data.global.blog_theme + "/side-login.asp", { user: data.user });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-toparticle.asp", { load: load, dbo: dbo, conn: conn });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-guestbook.asp", { load: load, dbo: dbo, conn: conn });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-link.asp", { load: load, dbo: dbo, conn: conn });%>
    </div>
	<div class="list">
    	<div class="detail">
        	<h1><%=data.article.art_title%></h1>
            <div class="info clearfix">
            	<div class="fleft"><a href="<%=data.article.art_categoryHref%>"><i class="fa fa-tree"></i> <%=data.article.art_categoryName%></a> <i class="fa fa-calendar"></i> <%=date.format(new Date(data.article.art_postdate), "y-m-d h:i:s")%></div>
                <div class="fright"><i class="fa fa-comment"></i> <%=data.article.art_comment_count%></div>
            </div>
            <div class="detail-content"><%=data.article.art_content%></div>
            <%if ( data.article.art_modifydate > 0 ){%>
            <div class="modify">
            最后编辑时间：<%=date.format(new Date(data.article.art_modifydate), "y-m-d h:i:s")%>
            </div>
            <%}%>
            <%if ( data.article.art_tags && data.article.art_tags.length > 0 ){%>
            <div class="tags">
            标签： <%
				for ( var i = 0 ; i < data.article.art_tags.length; i++ ){
			%>
            	<a href="<%=data.article.art_tags[i].href%>"><%=data.article.art_tags[i].tag_name%>(<%=data.article.art_tags[i].tag_count%>)</a>
            <%		
				};
			%>
            </div>
            <%}%>
        </div>
    </div>
</div>
<%include("private/themes/" + data.global.blog_theme + "/footer.asp", { global: data.global });%>
</body>
</html>