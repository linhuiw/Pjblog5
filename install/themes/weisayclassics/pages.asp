<%
if ( data.pages.to > 1 ){
%>
<div class="pages navigation pagination">
	<%
		for ( var i = data.pages.from ; i <= data.pages.to ; i++ ){
			if ( Number(i) == Number(data.pages.current) ){
	%>
    <span class="current"><%=i%></span>
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