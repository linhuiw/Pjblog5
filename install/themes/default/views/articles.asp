<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/reset.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/common.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/default.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/notice.css" />
<link rel="stylesheet" type="text/css" href="public/assets/bootstrap/css/font-awesome.min.css"/>
<title><%=data.global.blog_name%></title>
</head>
<body>
<%sups.contain("navs.asp")%>
<div class="articles clearfix wrap">
	<div class="side fright">
    	<%sups.contain("side-login.asp")%>
    </div>
	<div class="list">
    	<%
			for ( var i = 0 ; i < data.articles.length ; i++ ){
		%>
        	<div class="article">
                <div class="content">
            		<h1><a href="<%=data.articles[i].src%>"><%=data.articles[i].art_title%></a></h1>
                    <div class="info"><i class="fa fa-share-alt"></i> 博主发表于 <%=date.format(new Date(data.articles[i].art_postdate), "y-m-d h:i:s")%></div>
                    <div class="img"><a href="<%=data.articles[i].src%>"><img src="<%=data.articles[i].art_cover%>" onerror="this.src='public/assets/bootstrap/img/article_preview.png'" /></a></div>
                    <div class="des"><%=data.articles[i].art_des%></div>
                    <div class="cate"><i class="fa fa-star-o"></i> <a href="<%=data.articles[i].art_category.src%>"><%=data.articles[i].art_category.cate_name%></a><%
						if ( data.articles[i].art_tags.length > 0 ){
					%>
                    <i class="fa fa-xing"></i> 
                    <%	
							for( var o = 0 ; o < data.articles[i].art_tags.length ; o++ ){
					%>
                    <a href="<%=data.articles[i].art_tags[o].src%>"><%=data.articles[i].art_tags[o].tag_name%></a>
                    <%		
							}
						}
					%></div>
                </div>
            </div>
        <%	
			};
		%>
        <%sups.contain("pages.asp", {
			page: function(page){
				return ["page", "articles", { id: reqs.query.id, page: page }];
			}
		})%>
    </div>
</div>
<%sups.contain("footer.asp")%>
</body>
</html>