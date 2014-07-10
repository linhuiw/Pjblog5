<div class="nav">
	<div class="wrap clearfix">
    	<ul>
        	<% for ( var i = 0 ; i < categorys.length ; i++ ){
					var href;
					if ( categorys[i].cate_outlink ){
						href = categorys[i].cate_src;
					}else{
						href = "default.asp?cate=" + categorys[i].id;	
					};
			%>
            <li class="one"><a href="<%=href%>"><%=categorys[i].cate_name%></a>
            	<%
					if ( categorys[i].items && categorys[i].items.length > 0 ){
				%>
                <ul>
                	<%
						for ( var j = 0 ; j < categorys[i].items.length ; j++ ){
							var _href;
							if ( categorys[i].cate_outlink ){
								_href = categorys[i].items[j].cate_src;
							}else{
								_href = "default.asp?cate=" + categorys[i].items[j].id;	
							};
					%>
                    <li class="two"><a href="<%=_href%>"><%=categorys[i].items[j].cate_name%></a></li>
                    <%	
						};
					%>
                </ul>
                <%	
					}
				%>
            </li>
            <% }; %>
        </ul>
    </div>
</div>