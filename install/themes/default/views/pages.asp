<%
	if ( data.pages.arrays.length > 1 ){
%>
<div class="pages">
  <%
		data.pages.arrays.forEach(function( o ){
			if ( data.pages.value.index === o ){
%>
		<span><%=o%></span>
<%		
			}else{
%>
		<a href="<%=iPress.setURL.apply(iPress, data.contains.page(o))%>"><%=o%></a>
<%			
			}
		});
%>
</div>
<%	
	}
%>