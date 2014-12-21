<%
if ( data.pages.arrays.length > 1 ){
%>
<div class="pages">
	<%
		for ( var i = data.pages.from ; i <= data.pages.to ; i++ ){
			if ( i === data.pages.current ){
	%>
    <span><%=i%></span>
    <%			
			}else{
	%>
    <a href="<%=data.actives.url + "&page=" + i%>"><%=i%></a>
    <%			
			};		
		};
	%>
</div>
<%
}
%>