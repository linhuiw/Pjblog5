<div class="header-profile">
<%
	if ( data.user.login ){
%>
	<a href="#pass" class="thumbnail avatar" data-toggle="tooltip" title="请添加正确的邮箱以保证账户安全"><img src="<%=data.user.avatar||"http://app.webkits.cn/avatar/5D71E878AA66434CAA8ED0170550292F"%>" class="avatar" width="100" height="100" /></a><ul class="user-profile clearfix"><li class="clearfix"><a href="http://app.webkits.cn/me" class="name" title="<%=data.user.nick%>"><%=data.user.nick%></a>，你好！<a href="<%=data.user.logout%>" title="登出这个帐号" data-no-instant>登出 &raquo;</a></li><!--<li class="tabs"><a href="#" title="查看我的消息(1)">消息(1)</a></li>--></ul>
<%
	}else{
%>
	<ul class="user-profile clearfix"><li class="date">今天是 <%=date.format(new Date(),'y 年 m 月 d 日')%>，星期<%=["日","一","二","三","四","五","六"][new Date().getDay()]%></li><li class="login clearfix"><a href="<%=data.user.href%>">登录</a><a href="<%=data.user.regist%>">注册</a><!--<a href="javascript:void(0)" class="wordpress" title="使用本地帐号登录" rel="nofollow" data-no-instant></a><a href="javascript:void(0)" class="qq" title="使用QQ帐号登录" rel="nofollow" data-no-instant></a><a href="javascript:void(0)" class="weibo" title="使用微博帐号登录" rel="nofollow" data-no-instant></a>--><!--<span style="float:left;display: block;"></span>--></li></ul>
<%	
	}
%>
</div>