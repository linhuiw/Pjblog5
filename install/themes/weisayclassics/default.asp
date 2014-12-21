<%
	var date = require("date");
	var url;
%><%sups.include("header.asp");%>
<div id="roll"><div title="回到顶部" id="roll_top"></div><div title="转到底部" id="fall"></div></div>
<div id="content">
<div class="main">
<%if ( sups.position("tag") ) {%>
        <div id="map"><div class="site">标签： <%=data.actives.tag.tag_name%></div></div>
<%};%>
<%if ( sups.position("category") ) {%>
		<div id="map"><div class="site">分类： <%=data.actives.category.cate_name%></div></div>
<%};%>
<%
	for ( var i = 0 ; i < data.articles.length ; i++ ){
%>
<ul class="post">
<li>
<div class="article">
<h1 class="entry-title"><a href="<%=blog.web%>/article.asp?id=<%=data.articles[i].id%>"><%=data.articles[i].title%></a></h1>
<div class="thumbnail">
<%
	if ( data.articles[i].cover.length > 0 ){
					%>
                    <a href="<%=blog.web%>/article.asp?id=<%=data.articles[i].id%>"><img src="<%=data.articles[i].cover%>" alt="<%=data.articles[i].title%>" title="<%=data.articles[i].title%>" width="140" height="100" /></a>
					<%
			}
			else{
		%>
		<a href="<%=blog.web%>/article.asp?id=<%=data.articles[i].id%>"><img src="<%=blog.web%>/private/themes/<%=data.global.blog_theme%>/images/random/tb<%= Math.round(Math.random() * 19) + 1 %>.jpg" alt="<%=data.articles[i].title%>" title="<%=data.articles[i].title%>" width="140" height="100" /></a>
		<%	
			}
		%>
        </div>
<div class="entry-content"><p><%=data.articles[i].des%></p>
</div>
<div class="clear"></div>
<div class="info"><span class="author"><%=data.theme.setting.author%></span><span class="updated"><%=date.format(new Date(data.articles[i].posttime), "y-m-d h:i:s")%></span><span class="category"><a href="<%=data.articles[i].catehref%>"><%=data.articles[i].category%></a></span><span class="comments"><a href="<%=blog.web%>/article.asp?id=<%=data.articles[i].id%>#comment"><%=data.articles[i].comments%>条评论</a></span>
<%
	if ( data.articles[i].tags.length > 0 ){
%>
<span class="tags" itemprop="keywords">
<%	
		var t = [];
		for( var o = 0 ; o < data.articles[i].tags.length ; o++ ){
			t.push('<a href="' + data.articles[i].tags[o].href + '">' + data.articles[i].tags[o].tag_name + '</a>');	
		}
		Library.log(t.join(", "));
	}
%>
</span></div>
</div>
</li>
</ul>
<div class="clear"></div>
 <%	
	};
			sups.include("pages.asp");
		%>

</div>

<%sups.include("sidebar.asp");%>

</div>
</div>
<div class="clear"></div>
<%sups.include("footer.asp");%>
</body>
</html>