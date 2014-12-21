<%
var fns = require(':tron_modules/ifns/ifns');
//var date = require('date');
//console.json(data)
//Response.end();
%>
<%sups.contain("header.asp")%>
<div id="main" class="container">
	<div class="row">








<div id="main" class="container" role="main" itemscope itemprop="mainContentOfPage" itemtype="http://schema.org/Blog">
	<div class="row">
		<article id="content" class="col-lg-8 col-md-8 single" data-post-id="<%=data.article.id%>" role="article" itemscope itemtype="http://schema.org/Article">
			<div class="panel panel-default">
				<div class="panel-body">
					<div class="entry-header page-header">
						<h1 class="entry-title h3" itemprop="name"><%=data.article.art_title%></h1>
						<div class="entry-meta">
							<div class="entry-set-font"><span id="set-font-small" class="disabled">A<sup>-</sup></span><span id="set-font-big">A<sup>+</sup></span></div>
							<span class="glyphicon glyphicon-user"></span><a href="javascript:void(0);" itemprop="author"><%=data.theme.setting.author%></a>
							<span class="glyphicon glyphicon-calendar"></span><time class="entry-date" title="发布于 <%=date.format(new Date(data.article.art_modifydate), "y-m-d h:i:s")%> 最后编辑于 <%=date.format(new Date(data.article.art_modifydate), "y-m-d h:i:s")%> " datetime="2014-12-14T04:39:35+00:00"  itemprop="datePublished"><%=date.format(new Date(data.article.art_postdate), "y年m月d日")%></time>
							<span class="glyphicon glyphicon-comment"></span><a href="<%=data.article.src%>#comments" itemprop="discussionUrl" itemscope itemtype="http://schema.org/Comment"><span itemprop="interactionCount"><%=Math.ceil(Math.random()*20)%></span></a>
							<span class="glyphicon glyphicon-eye-open"></span><%=Math.ceil(Math.random()*100)%> 次浏览<span class="glyphicon glyphicon-folder-open"></span><a href="<%=data.article.art_category.src%>" rel="category" itemprop="articleSection"><%=data.article.art_category.cate_name%></a>
						</div>
					</div>
					<div class="entry-content"  itemprop="articleBody" data-no-instant>
						<div class="article_index" style="display:none;">
							<h5>文章目录<span class="caret"></span></h5>
							<ul>
								<li><a href="#1">概述</a></li>
								<li><a href="#2">参考案例</a></li>
								<li><a href="#3">相关资料</a></li>
							</ul>
						</div>
						<%=(data.article.art_content||"").replace(/\r\n/g,'<br>')%>
					</div>
						<div class="entry-details" itemprop="copyrightHolder" itemtype="http://schema.org/Organization" itemscope>
							<details>
								<summary>原文链接：<a href="#" rel="author"><%=data.article.art_title%></a>，转发请注明来源！</summary>
							</details>
						</div>
					</div>
					<div class="entry-footer clearfix" role="toolbar">
						<div class="bd-share">
							<div class="bdsharebuttonbox"><a class="bds_qzone" data-cmd="qzone"></a><a class="bds_tsina" data-cmd="tsina"></a><a class="bds_weixin" data-cmd="weixin"></a><a class="bds_more" data-cmd="more"></a></div><script>var share_excerpt = '【is_apache】概述这个全局变量用来检测当前运行 WordPress 所使用的服务器是否 Apache HTTP Server ，返回布尔值，真或假。参考案例global $is_apache; if( $is_apache ) echo \'正在使用 Apache HTTP Server 运行 WordPress 网站\';相关资料判断 Apache HTTP Server 使用 $is_apache判断 IIS 使用 $i...';var share_pic = '';var share_url = 'http://www.dmeng.net/is_apache.html?fid=0';var wkey = '2713487958';var qkey = '101138431';window._bd_share_main = false;window._bd_share_config = { common : { bdText : share_excerpt,bdDesc : share_excerpt,bdUrl : share_url, bdPic : share_pic, bdSnsKey : {'tsina':wkey, 'tqq':qkey,'qzone':qkey} }, share : [{ 'bdStyle' : 1, 'bdSize' : 24 }] };</script>
						</div>
						<div class="btn-group vote-group" data-votes-up="0" data-votes-down="0" data-vote-id="<%=data.id%>" data-vote-type="post" itemscope itemtype="http://data-vocabulary.org/Review-aggregate">
<a href="javascript:;" class="btn btn-default up"><span class="glyphicon glyphicon-thumbs-up"></span> <span class="votes">0</span><div class="hide" itemprop="rating" itemscope itemtype="http://data-vocabulary.org/Rating"><span itemprop="average">1</span><span itemprop="votes">0</span><span itemprop="count">0</span></div></a>
<a href="javascript:;" class="btn btn-default down"><span class="glyphicon glyphicon-thumbs-down"></span></a>
</div><span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="http://www.dmeng.net/" title="多梦网络" itemprop="url"><span itemprop="title">多梦网络</span></a></span> › <span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="http://www.dmeng.net/category/wordpress-global-variables/" title="WordPress全局变量" itemprop="url"><span itemprop="title">WordPress全局变量</span></a></span> › <span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"><a href="http://www.dmeng.net/is_apache.html" title="is_apache" itemprop="url"><span itemprop="title">is_apache</span></a></span>
						</div>
						<div class="panel-footer profile clearfix" itemprop="publisher" itemscope itemtype="http://schema.org/Organization">
							<a class="author-avatar" href="#"><img src="http://app.webkits.cn/avatar/5D71E878AA66434CAA8ED0170550292F/32" data-original="" class="avatar" width="50" height="50" /></a>
							<div class="author-description">
								<div class="author-name"> 作者 : <span itemprop="name"><a href="javascript:void(0);" title="<%=data.theme.setting.author%>" rel="author external"><%=data.theme.setting.author%></a></span> </div>
								<div itemprop="description"><%=data.theme.setting.authordec||""%></div>
								</div>
							</div>
						</div>
						<nav class="pager" role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">
			<% if ( data.PrevArticle ){%><li class="previous"><a href="<%=data.PrevArticle.src%>" title="<%=data.PrevArticle.art_title%>" rel="prev"><span class="text-muted">上一篇：</span> <span itemprop="name"><%=data.PrevArticle.art_title%></span></a></li><%}%>
			<%if ( data.NextArticle ){%>
			<li class="next"><a href="<%=data.NextArticle.src%>" title="<%=data.NextArticle.art_title%>" rel="next"><span class="text-muted">下一篇：</span> <span itemprop="name"><%=data.NextArticle.art_title%></span></a></li><%
			}
			%>
			</nav><!-- .navigation -->						<div class="panel panel-default" id="comments" data-no-instant><div class="list-group"  id="respond">
	<h4 class="list-group-item">发表评论 <small id="cancel-comment-reply"><a rel="nofollow" id="cancel-comment-reply-link" href="#respond" style="display:none;">点击这里取消回复。</a></small></h4>
<p class="list-group-item">要发表评论，您必须先<a href="#">登录</a>。</p>
</div>

</div>
					 </article><!-- #content -->




















<%sups.contain("sidebar.asp")%>
	</div>
</div><!-- #main -->
<%sups.contain("footer.asp")%>
</body>
</html>
