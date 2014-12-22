<div class="pannel">
<%
	if ( data.user.login ){
%>
<div class="login">
	<h6>用户登录模块</h6>
	<p><i class="fa fa-info-circle"></i>欢迎回来，<%=data.user.nick%>。<span id="notice"></span></p>
    <p><a href="http://app.webkits.cn/me"><i class="fa fa-angle-right"></i> 个人中心</a> </p>
    <%if ( sups.checkStatus("ControlSystem") ){%>
	<p><a href="<%=data.user.adminsrc%>" target="_blank"><i class="fa fa-angle-right"></i> 进入后台</a></p>
	<%}%>
	<p><a href="<%=data.user.logout%>"><i class="fa fa-angle-right"></i> 退出登录</a> </p>
</div>
<%
	}else{
%>
<div class="login">
	<h6>用户登录模块</h6>
    <p><a href="<%=data.user.href%>"><i class="fa fa-angle-right"></i> 登录本站</a></p>
    <p><a href="<%=data.user.regist%>"><i class="fa fa-angle-right"></i> 注册账号</a></p>
</div>
<%	
	}
%>
</div>