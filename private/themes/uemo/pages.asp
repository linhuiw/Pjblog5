<%
if ( pages.to > 1 ){
%>
<div id="pages" class="clearfix">
	<%
		for ( var i = pages.from ; i <= pages.to ; i++ ){
			if ( i === pages.current ){
	%>
    <span><%=i%></span>
    <%			
			}else{
				if ( url.indexOf("?") > -1 ){
	%>
    <a href="<%=url + "&page=" + i%>"><%=i%></a>
    <%	
				}else{
	%>
    <a href="<%=url + "?page=" + i%>"><%=i%></a>
    <%				
				}
			};		
		};
	%>
</div>
<%
}
%>