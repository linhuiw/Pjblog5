<%
/*
 显示头像，云平台>全球通用>默认头像
 参数说明
 user: 用户信息
 s: 图片尺寸
*/
function Avatar(user, s){
	if (typeof(s) == 'undefined') { s = 36 }
	var avatar = '';
	if (user.mid > 0) {
		avatar = user.avatar + '/' + s;
	}else{
		var md5 = require('md5');
		var vid = md5.make(user.mail.toLowerCase());
		vid = vid.toLowerCase();
		avatar = 'http://www.gravatar.com/avatar/' + vid + '?s=' + s + '&d=identicon&r=G';
	}

	return avatar;
}
%>
<h3>最新<%=dis%></h3>
<div class="r_comment">
<ul>
<%
;(function(){
	var gets = package.getSideValue(genre);

	var date = require("date");
		
	if ( gets.length > 0 ){
		for ( var i = 0 ; i < gets.length ; i++ ){
%>
<li><img src="<%=Avatar(gets[i], 36)%>" onerror="this.src='/private/themes/box/avatar.png'" class="avatar" height="34" width="34" /><%=gets[i].nick%>:<br /> <a href="<%=(genre==0) ? 'article' : 'plugin'%>.asp?id=<%=(genre==0) ? gets[i].aid : package.pid%>#comment_<%=gets[i].id%>">
                	<%=gets[i].content%>
                </a></li>
<%			
		}
	}else{
%>
<div class="guestitems">没有<%=dis%>数据。</div>
<%		
	}
})();
%>
</ul>
</div>