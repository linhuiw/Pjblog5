<div class="pannel">
<%
	if ( user.login ){
%>
<div class="login">
	<h6>用户登录模块</h6>
	<p><i class="fa fa-info-circle"></i>欢迎回来，<%=user.nick%>。 </p>
	<p><a href="<%=user.logout%>"><i class="fa fa-angle-right"></i> 退出登录</a> </p>
	<%if ( user.group.indexOf("ControlSystem") > -1 ){%>
	<p><a href="control.asp" target="_blank"><i class="fa fa-angle-right"></i> 进入后台</a></p>
	<%}%>
</div>
<%
	}else{
%>
<div class="login"><h6>用户登录模块</h6><p><a href="<%=user.href%>"><i class="fa fa-angle-right"></i> 登录</a></p></div>
<%	
	}
%>
</div>