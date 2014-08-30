<%var date = require("date"), url, fns = require("fns");%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%include("private/themes/" + data.global.blog_theme + "/head.asp", { global: data.global });%>
<link rel="stylesheet" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/scroller/css/jquery.slideBox.css">
<title><%=data.global.blog_name%></title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/header.asp", { categorys: data.categorys, gets: data.gets, global: data.global, user: data.user, themes: data.themes })%>
<div class="banner">
	<div id="bannerbody"><p><%=data.global.blog_title%></p><p><%=data.global.blog_des%></p><p><a href="<%=data.themes.indexbannerurl%>" target="_blank"><%=data.themes.indexbannertext%></a></p></div>
</div>
<div id="sooptions">
	<div class="wrap">
    	<div id="socontent">
        	<div class="homenav fleft">
            	<%
					if ( data.gets.tag ){
						url = blog.web + "/?tag=" + data.gets.tag.id;
				%>
                	<i class="fa fa-tags"></i> <%=data.gets.tag.tag_name%>
                <%
					}
					else if ( data.gets.categorys ){
						url = blog.web + "/?cate=" + data.gets.categorys;
				%>
                	<img src="private/icons/<%=data.globalCategory.cate_icon%>" /> <%=data.globalCategory.cate_name%>
                <%
					}
					else{
						url = blog.web + "/default.asp";
					}
				%>
            </div>
            <div class="search fright">
            	<i class="fa fa-bug"></i><%=data.themes.word%>
            </div>
        </div>
    </div>
</div>
<div id="content">
	<div class="wrap clearfix">
    	<div class="citem" id="citemslide"><%=fns.unSQLStr(fns.unHTMLStr(data.themes.indexImages))%></div>

		<%
			(function( articles ){
				for ( var i = 0 ; i < articles.length ; i++ ){
		%>
        <div class="citem">
        	<div class="citemtop">
                <a href="<%=blog.web%>/article.asp?id=<%=articles[i].id%>" class="cover" target="_blank">
                    <img src="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/imgs/loading.jpg" data-original="<%=articles[i].cover%>" class="lazy" />
                </a>
                <div class="citemtxt">
                    <a href="<%=blog.web%>/article.asp?id=<%=articles[i].id%>" class="citemtitle" target="_blank"><%=articles[i].title%></a>
                    <div class="citemtc">
                        <span class="yy-icon yy-time"></span><%=date.format(new Date(articles[i].posttime), "y / m-d &lt;h:i&gt;")%>
                    </div>
                </div>
            </div>
            
            <div class="tags">
            	<i class="fa fa-tags"></i>
            	<%
					if ( articles[i].tags.length > 0 ){
						for( var o = 0 ; o < articles[i].tags.length ; o++ ){
				%>
                <a href="<%=articles[i].tags[o].href%>"><%=articles[i].tags[o].tag_name%></a>
                <%	
						}
					}else{ Library.log("该文章暂无标签！"); };
				%>
            </div>
            
            <div class="categorys clearfix">
            	<a href="<%=articles[i].catehref%>" class="fleft"><img src="private/icons/<%=articles[i].categoryicon%>"><%=articles[i].category%></a>
                <a href="<%=blog.web%>/article.asp?id=<%=articles[i].id%>#comment" class="fright" target="_blank"><i class="fa fa-comment"></i><%=articles[i].comments%></a>
            </div>
        </div>
        <%
				};
			})( data.articles );
		%>
    </div>
    <div class="wrap clearfix">
    <%include("private/themes/" + data.global.blog_theme + "/pages.asp", { pages: data.pages, url: url });%>
    </div>
    <div class="wrap clearfix">
        <%plugin("toparticle");%>
        <%plugin("topcomment");%>
        <%plugin("guestbook");%>
    </div>
    <div class="wrap clearfix"><%plugin("link");%></div>
</div>
<script type="text/javascript">
require('<%="private/themes/" + data.global.blog_theme + "/js/default"%>', function(common){new common();});
</script>
<%include("private/themes/" + data.global.blog_theme + "/footer.asp", { global: data.global });%>
</body>
</html>