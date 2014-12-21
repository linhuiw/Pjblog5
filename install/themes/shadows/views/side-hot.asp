<div class="tj_news">
  <h2>
    <p class="tj_t1">最新文章</p>
  </h2>
  <ul>
  	<%
	source.forEach(function(o){
	%>
    <li><a href="<%=o.src%>"><%=o.art_title%></a></li>
	<%	
	});
	%>
  </ul>
</div>