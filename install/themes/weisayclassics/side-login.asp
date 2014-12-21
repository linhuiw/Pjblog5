<div class="pannel">
<%
	if ( data.user.login ){
%>
<div class="login">
	<h3>用户登录模块</h3>
	<p><i class="fa fa-info-circle"></i>欢迎回来，<%=data.user.nick%>。<span id="notice"></span></p>
    <p><a href="http://app.webkits.cn/me" target="_blank"><i class="fa fa-angle-right"></i> 个人中心</a> </p>
    <%if ( sups.checkStatus("ControlSystem") ){%>
	<p><a href="control.asp" target="_blank"><i class="fa fa-angle-right"></i> 进入后台</a></p>
	<%}%>
	<p><a href="<%=data.user.logout%>"><i class="fa fa-angle-right"></i> 退出登录</a> </p>
</div>
<%
	}else{
%>
<div class="login">
	<h3>用户登录模块</h3>
    <p><a href="<%=data.user.href%>"><i class="fa fa-angle-right"></i> 登录本站</a></p>
    <p><a href="http://app.webkits.cn/public/views/regist.asp" target="_blank"><i class="fa fa-angle-right"></i> 注册账号</a></p>
</div>
<%	
	}
%>
</div>
<%LoadJscript(function(login){ 
	window.token = login.token;
	window.appid = login.appid; 
	window.openid = login.openid;
}, { appid: data.global.blog_appid, token: data.user.token, openid: data.user.openid });%>
<script src="<%=data.theme.dir + "/js/cloudnotice.js"%>"></script>