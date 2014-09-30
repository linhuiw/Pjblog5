<div class="pannel">
<%
	if ( user.login ){
%>
<div class="login">
	<h6>用户登录模块</h6>
	<p><i class="fa fa-info-circle"></i>欢迎回来，<%=user.nick%>。<span id="notice"></span></p>
    <p><a href="http://app.webkits.cn/center"><i class="fa fa-angle-right"></i> 个人中心</a> </p>
    <%if ( user.group.indexOf("ControlSystem") > -1 ){%>
	<p><a href="control.asp" target="_blank"><i class="fa fa-angle-right"></i> 进入后台</a></p>
	<%}%>
	<p><a href="<%=user.logout%>"><i class="fa fa-angle-right"></i> 退出登录</a> </p>
</div>
<%
	}else{
%>
<div class="login">
	<h6>用户登录模块</h6>
    <p><a href="<%=user.href%>"><i class="fa fa-angle-right"></i> 登录本站</a></p>
    <p><a href="http://app.webkits.cn/acts/user/regist.asp"><i class="fa fa-angle-right"></i> 注册账号</a></p>
</div>
<%	
	}
%>
</div>
<%LoadJscript(function(login){ 
	window.token = login.token;
	window.appid = login.appid; 
	window.openid = login.openid;
}, { appid: global.blog_appid, token: user.token, openid: user.openid });%>
<script src="<%="private/themes/" + global.blog_theme + "/js/cloudnotice.js"%>"></script>