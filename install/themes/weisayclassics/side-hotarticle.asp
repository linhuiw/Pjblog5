<%
var gets = package.getSideValue();
if ( gets.length > 0 ){
for ( var i = 0 ; i < gets.length ; i++ ){
%>
<li><a href="article.asp?id=<%=gets[i].id%>" target="_blank" title="<%=gets[i].title%>"><%=gets[i].title%></a></li>
<%	
}
}else{
%>
<li>暂未找到任何日志。</li>
<%	
}
%>
    