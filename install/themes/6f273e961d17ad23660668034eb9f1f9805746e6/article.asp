<%
	var date = require("date");
%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
<title><%=data.article.art_title%></title>
</head>

<body>

<%sups.include("navigation.asp");%>
<div class="articles clearfix wrap">
	<div class="side fright">
    	<%sups.include("side-login.asp");%>
    </div>
	<div class="list">
    	<div class="detail">
        	<h1><%=data.article.art_title%></h1>
            <div class="info">
            	<div class="fleft"><a href="<%=data.article.art_categoryHref%>"><i class="fa fa-tree"></i> <%=data.article.art_categoryName%></a> <i class="fa fa-calendar"></i> <%=date.format(new Date(data.article.art_postdate), "y-m-d h:i:s")%></div>
                <div class="fright"></div>
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
            <div class="prev">
			<%
            if ( data.PrevArticle ){
            %>
              <div>
                <i class="fa fa-angle-right"></i> 上一篇：<a href="<%=data.PrevArticle.href%>"><%=data.PrevArticle.title%></a>
              </div>
			<%
            }
            if ( data.NextArticle ){
            %>
              <div>
                <i class="fa fa-angle-right"></i> 下一篇：<a href="<%=data.NextArticle.href%>"><%=data.NextArticle.title%></a>
              </div>
			<%
            }
            %>
            </div>
        </div>
    </div>
</div>
<%sups.include("footer.asp");%>
</body>
</html>