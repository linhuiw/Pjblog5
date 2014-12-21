<%
	var date = require("date");
	var url;
%><%sups.include("header.asp");%>
<div id="roll"><div title="回到顶部" id="roll_top"></div><div title="查看评论" id="ct"></div><div title="转到底部" id="fall"></div></div>
<div id="content">
<div class="main vcard">
<div class="article article_c">
<div class="author_info">
<div class="post-info"><h1 class="entry-title"><%=data.article.art_title%></h1>
<div class="article_info">
	<span class="author"><%=data.theme.setting.author%></span><span class="updated"><%=date.format(new Date(data.article.art_postdate), "y-m-d h:i:s")%></span><span class="category fn"><a href="<%=data.article.art_categoryHref%>"><%=data.article.art_categoryName%></a></span><span class="comments"><a href="#comment"><%=data.article.art_comment_count%>条评论</a></span></div></div>
</div>
<div class="context entry-content" id="art_content">
<%=data.article.art_content%>
<div class="clear"></div>
<%if ( data.article.art_tags && data.article.art_tags.length > 0 ){%>
<div class="tag">标签：<span itemprop="keywords"> <%
				for ( var i = 0 ; i < data.article.art_tags.length; i++ ){
			%>
            	<a href="<%=data.article.art_tags[i].href%>"><%=data.article.art_tags[i].tag_name%>(<%=data.article.art_tags[i].tag_count%>)</a>
            <%		
				};
			%></span></div>
			<%}%>
<div class="clear"></div>
</div>
</div>

<div class="article article_c">
<ul class="pre_nex">
<%
            if ( data.PrevArticle ){
            %>
<li>【上一篇】<a href="<%=data.PrevArticle.href%>"><%=data.PrevArticle.title%></a></li>
<%
            }
            if ( data.NextArticle ){
            %>
<li>【下一篇】<a href="<%=data.NextArticle.href%>"><%=data.NextArticle.title%></a></li>
<%
            }
            %>
</ul>
</div>

<div class="article article_c">
<%sups.plugin("comments", { sups: sups, user: data.user, data: data, id: data.article.id, page: reqs.query.page || 1, url: blog.web + "/article.asp?id=" + data.article.id });%>
</div>
</div>

<%sups.include("sidebar.asp");%>

</div>
</div>
<div class="clear"></div>
<%sups.include("footer.asp");%>
<script type="text/javascript" language="javascript">
require('private/themes/<%=data.global.blog_theme%>/js/comment', function( book ){ typeof book === 'function' && new book(); });
</script>
<%sups.plugin("taghighlight", { tags: data.article.art_tags });%>
</body>
</html>