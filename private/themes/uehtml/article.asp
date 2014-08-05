﻿<%var date = require("date");%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%include("private/themes/" + data.global.blog_theme + "/head.asp", { global: data.global });%>
<title><%=data.article.art_title%></title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/header.asp", { categorys: data.categorys, gets: data.gets, global: data.global, user: data.user })%>
<div class="banner">
	<div id="bannerbody"><p><%=data.article.art_title%></p><p></p><p><a href="<%=data.article.art_categoryHref%>"><%=data.article.art_categoryName%></a></p></div>
</div>
<div id="content" class="common">
	<div class="wrap">
    	<div class="art-content">
        	<div class="art-zones">
        		<div class="time"><i class="fa fa-calendar"></i> 博主发表于 <%=date.format(new Date(data.article.art_postdate), "y-m-d h:i:s")%></div>
                <%if ( data.article.art_tags.length ){%>
                <div class="tag"><i class="fa fa-tags"></i>标签：
				<%
					for ( var i = 0 ; i < data.article.art_tags.length; i++ ){
				%>
					<a href="<%=data.article.art_tags[i].href%>"><%=data.article.art_tags[i].tag_name%>(<%=data.article.art_tags[i].tag_count%>)</a>
				<%		
					};
				%>
                </div>
                <%
				}
				if ( data.PrevArticle ){
				%>
                <div class="prev"><i class="fa fa-angle-right"></i> 上一篇：<a href="<%=data.PrevArticle.href%>"><%=data.PrevArticle.title%></a></div>
                <%
				}
				if ( data.NextArticle ){
				%>
                <div class="prev"><i class="fa fa-angle-right"></i> 下一篇：<a href="<%=data.NextArticle.href%>"><%=data.NextArticle.title%></a></div>
                <%
				}
				%>
            </div>
            <div class="art-detail"><%=data.article.art_content%></div>
        </div>
        <div class="art-comments" id="comment"><%include("private/themes/" + data.global.blog_theme + "/comment.asp", { user: data.user, id: data.gets.id, page: data.gets.page, global: data.global, dbo: dbo, conn: conn, comments: data.comments, pages: data.pages })%></div>
    </div>
</div>
<script type="text/javascript">
require('<%="private/themes/" + data.global.blog_theme + "/js/article"%>', function(common){new common();});
</script>
</body>
</html>