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
        	<% for ( var i = 0 ; i < data.categories.queens.length ; i++ ){%>
            <li class="one"><a href="<%=data.categories.queens[i].src%>"><%=data.categories.queens[i].cate_name%></a>
            	<%
					if ( data.categories.queens[i].items && data.categories.queens[i].items.length > 0 ){
				%>
                <ul>
                	<%
						for ( var j = 0 ; j < data.categories.queens[i].items.length ; j++ ){
					%>
                    <li class="two"><a href="<%=data.categories.queens[i].items[j].src%>"><%=data.categories.queens[i].items[j].cate_name%></a></li>
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