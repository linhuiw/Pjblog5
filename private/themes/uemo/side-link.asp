<%
	var gets = package.getSideValue();
	if ( gets.length > 0 ){
%>
<div id="links" class="clearfix"><span>友情链接</span>
<%
		for ( var i = 0 ; i < gets.length ; i++ ){
%><a href="<%=gets[i].link_src%>"><%=gets[i].link_name%></a><%					
		}
%>
</div>
<%
	}
%>