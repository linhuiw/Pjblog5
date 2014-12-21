

<%if ( data.pages.arrays.length > 1 ){%>
<ul class="pagination" role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">
<%
		data.pages.arrays.forEach(function( o ){
			if ( data.pages.value.index === o ){
%>
		<li itemprop="name"><span class='page-numbers current'><%=o%></span></li>
<%		
			}else{
%>
		<li itemprop="name"><a class='page-numbers' href='<%=iPress.setURL.apply(iPress, data.contains.page(o))%>'><%=o%></a></li>
<%			
			}
		});
%>
<!--<li itemprop="name"><a class="next page-numbers" href="page=2">下一页 &raquo;</a></li>-->
</ul>
<%};%>