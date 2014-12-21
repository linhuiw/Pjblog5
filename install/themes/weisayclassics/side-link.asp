<h3>友情链接</h3>
<div class="v-links"><ul>
<%
	var gets = package.getSideValue();
	if ( gets.length > 0 ){
		for ( var i = 0 ; i < gets.length ; i++ ){
%>
		<li><a href="<%=gets[i].link_src%>" class="list-group-item" title="<%=gets[i].link_des%>" target="_blank"><%=gets[i].link_name%></a></li>
<%					
		}
	}else{
%>
		<li><a href="#" class="list-group-item">暂未找到友情链接。</a><li>
<%				
	}
%>
</ul></div><div class="clear"></div>