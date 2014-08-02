<div class="header">
  <div class="wrap"> <a href="default.asp" id="hlogo"><img src="<%="private/themes/" + global.blog_theme + "/imgs/5pjsm.png"%>" width="120" height="50"></a>
    <ul id="hnav">
      <%
			for ( var i = 0 ; i < categorys.length ; i++ ){
				var href;
				if ( categorys[i].cate_outlink ){
					href = categorys[i].cate_src;
				}else{
					href = "default.asp?cate=" + categorys[i].id;	
				};
		%>
      <li <%if ( categorys[i].items && categorys[i].items.length > 0 ){%>class="hnavmore"<%};%>> <a href="<%=href%>"><%=categorys[i].cate_name%>
        <%if ( categorys[i].items && categorys[i].items.length > 0 ){%>
        <span class="glyphicon glyphicon-chevron-down"></span>
        <%}%>
        </a>
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
          <li><a href="<%=_href%>" target="_blank"><%=categorys[i].items[j].cate_name%></a></li>
          <%
					};
				%>
        </ul>
        <%		
				}
			%>
      </li>
      <%		
			}
		%>
    </ul>
    <div id="hrnav">
      <div id="mulogin">
        <%
            if ( user.login ){
		%>
        <div class="avatar"> <img src="<%=user.avatar%>?s=36" /> </div>
        <div class="info">
          <div class="nick"><%=user.nick%></div>
          <div class="links"> <a href="http://app.webkits.cn/center"><i class="fa fa-angle-right"></i> 个人中心</a>
            <%if ( user.group.indexOf("ControlSystem") > -1 ){%>
            <a href="control.asp" target="_blank"><i class="fa fa-angle-right"></i> 进入后台</a>
            <%}%>
            <a href="<%=user.logout%>"><i class="fa fa-angle-right"></i> 退出登录</a> </div>
        </div>
        <%		
			}else{
        %>
        <a href="<%=user.href%>" id="loginbtn" class="box">登录</a><a id="muregbtn" href="http://app.webkits.cn/acts/user/regist.asp" class="box">注册</a>
        <%};%>
      </div>
    </div>
  </div>
</div>
