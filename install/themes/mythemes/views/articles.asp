<%
var fns = require(':tron_modules/ifns/ifns');
//var date = require('date');
//console.log(typeof date.format)
%>
<%sups.contain("header.asp")%>
<div id="main" class="container">
	<div class="row">
		<div id="content" class="col-lg-8 col-md-8 archive" role="main" itemscope itemprop="mainContentOfPage" itemtype="http://schema.org/Blog">
			<div class="panel panel-default panel-archive">
				<div class="panel-body">
<!--
				<h1 class="h3 page-header panel-archive-title">分类 : <span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="http://www.dmeng.net/category/wordpress-theme-development/" title="WordPress主题开发" itemprop="url"><span itemprop="title">WordPress主题开发</span></a></span> › 					<small> <span class="glyphicon glyphicon-list-alt"></span> <span itemprop="interactionCount">28</span>个相关结果 <span class="glyphicon glyphicon-signal"></span> 3334次浏览</small>
				</h1>
--><%
data.articles.forEach(function(o){

%>

					<article id="post-<%=o.id%>" class="panel panel-default archive" data-post-id="<%=o.id%>" role="article" itemscope itemtype="http://schema.org/Article">
						<div class="panel-body<%if (o.art_cover){%> has_post_thumbnail<%}%>"><%
if (o.art_cover){
%>
							<div class="entry-thumbnail"><a title="<%=o.art_title%>" href="<%=o.src%>"><img alt="<%=o.art_title%>" data-original="<%=o.art_cover%>" src="<%=o.art_cover%>" style="display: inline;"></a></div><%
}
%>
							<div class="entry-header page-header">
								<h3 class="entry-title h4">
									<a href="<%=o.src%>" rel="bookmark" itemprop="url"><span itemprop="name"><%=o.art_title%></a></span>
								</h3>
								<div class="entry-meta">
	<span class="glyphicon glyphicon-user"></span><a href="javascript:void(0);" itemprop="author"><%=data.theme.setting.author%></a>
	<span class="glyphicon glyphicon-calendar"></span><time class="entry-date" title="发布于 <%=date.format(new Date(o.art_modifydate), "y-m-d h:i:s")%> 最后编辑于 <%=date.format(new Date(o.art_modifydate), "y-m-d h:i:s")%> " datetime="2014-12-14T04:39:35+00:00"  itemprop="datePublished"><%=date.format(new Date(o.art_postdate), "y年m月d日")%></time>
	<span class="glyphicon glyphicon-comment"></span><a href="<%=o.src%>#comments" itemprop="discussionUrl" itemscope itemtype="http://schema.org/Comment"><span itemprop="interactionCount"><%=Math.ceil(Math.random()*20)%></span></a>
	<span class="glyphicon glyphicon-eye-open"></span><%=Math.ceil(Math.random()*100)%> 次浏览<span class="glyphicon glyphicon-folder-open"></span><a href="<%=o.art_category.src%>" rel="category" itemprop="articleSection"><%=o.art_category.cate_name%></a>
								</div>
							</div>
							<div class="entry-content" itemprop="description" data-no-instant>
								<p><%=fns.HTMLStr(o.art_des)%></p><%
if ( o.art_tags.length > 0 ){
%>
<p>标签：
	<%o.art_tags.forEach(function(z){%>
	<a href="<%=z.src%>"><%=z.tag_name%></a>
	<%});%>
</p><%
};
%>
							</div>
						</div>
					</article><!-- #content -->
<%
});
sups.contain("pages.asp", {
	page: function(page){
		return ["page", "articles", { id: reqs.query.id, page: page }];
	}
});
%>
				</div>
			</div>
		</div><!-- #content -->
<%sups.contain("sidebar.asp")%>
	</div>
</div><!-- #main -->
<%sups.contain("footer.asp")%>
</body>
</html>
