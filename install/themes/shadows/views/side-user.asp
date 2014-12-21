<div class="about_c">
<%
	if ( data.user.login ){
%>
	<%if ( sups.checkStatus("ControlSystem") ){%>
    <p><a href="<%=data.user.adminsrc%>" target="_blank"><i class="fa fa-angle-right"></i> 进入后台</a></p>
    <%}%>
    <p><a href="<%=data.user.logout%>"><i class="fa fa-angle-right"></i> 退出登录</a> </p>
<%
	}else{
%>
	<p><a href="<%=data.user.href%>"><i class="fa fa-angle-right"></i> 登录本站</a></p>
    <p><a href="<%=data.user.regist%>"><i class="fa fa-angle-right"></i> 注册账号</a></p>
<%	
	}
%>
</div>