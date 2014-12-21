<%
	// Ajax调用地址：public/sync.asp?m=pmark&p=getData&t=plugin
	var gets = package.getSideValue();
	var date = require('date');
%>
  	<h3>博客统计</h3>
  	<ul class="list-group">
		<li class="list-group-item">建站日期：<%=date.format(gets.start, 'y年m月d日')%></li>
        <li class="list-group-item">运行天数：<%=gets.days%>　文章总数：<%=gets.article%></li>
        <li class="list-group-item">评论总数：<%=gets.comment%>　用户总数：<%=gets.member%></li>
        <li class="list-group-item">留言总数：<%=gets.message%>　链接总数：<%=gets.link%></li>
	</ul>