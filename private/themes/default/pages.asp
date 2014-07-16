<%
if ( pages.to > 1 ){
%>
<div class="pages clearfix">
	<%
		for ( var i = pages.from ; i <= pages.to ; i++ ){
			if ( i === pages.current ){
	%>
    <span><%=i%></span>
    <%			
			}else{
	%>
    <a href="<%=url + "&page=" + i%>"><%=i%></a>
    <%			
			};		
		};
	%>
</div>
<%
}
%>