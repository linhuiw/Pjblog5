<%sups.contain("header.asp")%>
<article>
    <h2 class="about_h">您现在的位置是：<a href="<%=iPress.setURL("page", "home")%>">首页</a>&gt;<a href="javascript:;"><%=crumb.value.name%></a>&gt;<a href="<%=crumb.value.src%>"><%=crumb.value.title%></a></h2>
    <div class="index_about">
      <h2 class="c_titile"><%=data.article.art_title%></h2>
      <p class="box_c">
      	<span class="d_time">发布时间：<%=date.format(new Date(data.article.art_postdate), "y-m-d h:i:s")%></span>
        <span>编辑：<%=data.theme.setting.author%></span>
        <span>分类：<a href="<%=data.article.art_category.src%>"><%=data.article.art_category.cate_name%></a></span>
      </p>
      <ul class="infos"><%=data.article.art_content%></ul>
      <div class="keybq">
        <p><span>关键字词</span>：<%for ( var i = 0 ; i < data.article.art_tags.length; i++ ){%>
        <a href="<%=data.article.art_tags[i].src%>"><%=data.article.art_tags[i].tag_name%>(<%=data.article.art_tags[i].tag_count%>)</a>
        <%};%></p>
      </div>
      <div class="nextinfo">
      	<% if ( data.PrevArticle ){%>
        <p>上一篇：<a href="<%=data.PrevArticle.src%>"><%=data.PrevArticle.art_title%></a></p>
        <%};if ( data.NextArticle ){%>
        <p>下一篇：<a href="<%=data.NextArticle.src%>"><%=data.NextArticle.art_title%></a></p>
        <%};%>
      </div>
    </div>
  </article>
  <aside>
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