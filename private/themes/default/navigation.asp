<div class="top">
	<div class="wrap clearfix">
    	<div class="logo fleft">
        	<%=data.global.blog_title%>
        	<div class="logo-title"><%=data.global.blog_des%></div>
        </div>
    </div>
</div>
<div class="nav">
	<div class="wrap clearfix">
    	<ul>
        	<% for ( var i = 0 ; i < data.categories.queens.length ; i++ ){
					var href;
					if ( data.categories.queens[i].cate_outlink ){
						href = data.categories.queens[i].cate_src;
					}else{
						href = "default.asp?cate=" + data.categories.queens[i].id;	
					};
			%>
            <li class="one"><a href="<%=href%>"><%=data.categories.queens[i].cate_name%></a>
            	<%
					if ( data.categories.queens[i].items && data.categories.queens[i].items.length > 0 ){
				%>
                <ul>
                	<%
						for ( var j = 0 ; j < data.categories.queens[i].items.length ; j++ ){
							var _href;
							if ( data.categories.queens[i].cate_outlink ){
								_href = data.categories.queens[i].items[j].cate_src;
							}else{
								_href = "default.asp?cate=" + data.categories.queens[i].items[j].id;	
							};
					%>
                    <li class="two"><a href="<%=_href%>"><%=data.categories.queens[i].items[j].cate_name%></a></li>
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