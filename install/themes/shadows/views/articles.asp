<%sups.contain("header.asp")%>
<article>
  <div class="banner">
    <ul class="texts">
      <p><%=data.theme.setting.title_1%></p>
      <p><%=data.theme.setting.title_2%></p>
    </ul>
  </div>
  <div class="bloglist">
    <h2>
      <p><span><%=crumb.value.name%></span> <%=crumb.value.title%></p>
    </h2>
    <%data.articles.forEach(function(o){%>
    <div class="blogs">
      <h3><a href="<%=o.src%>"><%=o.art_title%></a></h3>
      <figure><img src="<%=o.art_cover%>" onerror="this.src='public/assets/bootstrap/img/article_preview.png'" ></figure>
      <ul>
        <p><%=o.art_des%></p>
        <a href="<%=o.src%>" target="_blank" class="readmore">阅读全文&gt;&gt;</a>
      </ul>
      <p class="autor"> <span>作者：<%=data.theme.setting.author%></span> <span>分类：【<a href="<%=o.art_category.src%>"><%=o.art_category.cate_name%></a>】</span>
        <%if ( o.art_tags.length > 0 ){%>
        <span>标签：
        <%o.art_tags.forEach(function(z){%>
        <a href="<%=z.src%>"><%=z.tag_name%></a>
        <%});%>
        </span>
        <%};%>
      </p>
      <div class="dateview"><%=date.format(new Date(o.art_postdate), "y-m-d")%></div>
    </div>
    <%});%>
  </div>
  <%sups.contain("pages.asp", {
			page: function(page){
				return ["page", "articles", { id: reqs.query.id, page: page }];
			}
		});%>
</article>
<aside>
  <div class="avatar"><a href="http://app.webkits.cn/me" target="_blank"><span>关于<%=data.theme.setting.author%></span></a></div>
  <div class="topspaceinfo">
    <h1><%=data.theme.setting.title_3%></h1>
    <p><%=data.theme.setting.title_4%></p>
  </div>
<%sups.contain("side-user.asp")%>
  <%sups.plugin("hot")%>
  <div class="copyright">
    <ul>
      <p> Design by <a href="/">DanceSmile</a></p>
      <p><%=data.global.blog_copyright%></p>
      </p>
    </ul>
  </div>
</aside>
<%sups.contain("footer.asp")%>
