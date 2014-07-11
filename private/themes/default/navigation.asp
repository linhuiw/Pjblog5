<div class="top">
	<div class="wrap clearfix">
    	<div class="logo fleft">
        	<%=global.blog_title%>
        	<div class="logo-title"><%=global.blog_des%></div>
        </div>
        <div class="tools fright">
        	<%
				if ( user.login ){
			%>
        	<p><i class="fa fa-info-circle"></i> 欢迎回来，<%=user.nick%>。 <a href="<%=user.href%>"><i class="fa fa-sign-out"></i> 退出登录</a> <%
				if ( user.group.indexOf("ControlSystem") > -1 ){
			%>
            <a href="control.asp"><i class="fa fa-sign-in"></i> 进入后台</a>
            <%	
				}
			%></p>
            <%
				}else{
			%>
            <a href="<%=user.href%>"><i class="fa fa-sign-in"></i> 登录</a>
            <%	
				}
			%>
        </div>
    </div>
</div>
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