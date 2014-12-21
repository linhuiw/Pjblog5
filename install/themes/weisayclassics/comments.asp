<%
// 获取评论数据
var datas = package.getList(id, page);
var comments = datas.comments,
	pages = datas.pages;

// 显示留言或者评论
var dis = (id == 0) ? '留言' : '评论';

/*
 计算楼层评论数
 参数说明
 c: 当前评论页数(例如pages.current)
 i: 当前评论序号
*/
var totalcomments = package.getCount(id);
var perpage = (id == 0) ? setting.mes_perpage : setting.com_perpage;						
function floor(c, i){
	var t = totalcomments;											// 评论总数
	var p = perpage;												// 每页显示评论数
	var b = t - p * (c - 1);										// 本页第一条记录的楼层
	var f = b - i;
	return f;
}

/*
 显示头像，云平台>全球通用>默认头像
 参数说明
 user: 用户信息
 s: 图片尺寸
*/
function Avatar(user, s){
	if (typeof(s) == 'undefined') { s = 36 }
	var avatar = '';
	if (user.id > 0) {
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
<div class="comment" id="comment">
    <div class="comment-list">
        <h5><%=dis%>列表</h5>
        <%
			var date = require("date");
			if ( comments.length > 0 ){
				for ( var i = 0 ; i < comments.length ; i++ ){
		%>
        	<div class="root-comment" id="comment_<%=comments[i].id%>" Grade="0">
        		<div class="comment-box">
                	<div class="comment-box-user">
                    	<div class="comment-box-user-avatar clearfix">
                        	<img src="<%=Avatar(comments[i].com_user, 36)%>" onerror='this.src="<%=blog.web%>/private/themes/<%=data.global.blog_theme%>/avatar.png"' class="avatar"/>
                            <div class="tools">
                            <%if ( user.group.indexOf("ReplyComment") > -1 ){%>
                            <a href="javascript:;" app-cid="<%=comments[i].id%>" app-rid="<%=comments[i].id%>" app-id="<%=id%>" class="app-reply"><i class="fa fa-comment"></i></a>
                            <%};%>
                            <%if ( user.group.indexOf("RemoveComment") > -1 || (user.id === comments[i].com_user.id && user.id !== 0) ){%>
                            <a href="javascript:;" app-cid="<%=comments[i].id%>" class="app-remove"><i class="fa fa-trash-o"></i></a>
                            <%};%>
                            </div>
                        </div>
                    </div>
                    <div class="comment-box-info">
                    	<div class="nick">
							<a href="http://<%=comments[i].com_user.site%>" target="_blank" rel="nofollow">
								<%=comments[i].com_user.nick%>
                            </a>
                        	<span class="floor fright"><%=floor(pages.current,i)%>楼</span>
                        </div>
                        <div class="time"><%=date.format(new Date(comments[i].com_postdate), "y-m-d h:i:s")%></div>
                        <div class="des"><%=comments[i].com_content%></div>
                    </div>
                </div>
        	</div>
        <%			
					// 子评论
					var items = comments[i].items;
					if ( items.length > 0 ){
						for ( var j = 0 ; j < items.length ; j++ ){
							// 计算评论的左边距
							var Grade = items[j].thread.split('.').length;
							var PadLeft = Grade * 20;
								PadLeft = PadLeft < 200 ? PadLeft : 200;
		%>
        	<div class="root-comment" id="comment_<%=items[j].id%>" style="padding-left:<%=PadLeft%>px;" Grade="<%=Grade%>">
        		<div class="comment-box">
                	<div class="comment-box-user">
                    	<div class="comment-box-user-avatar clearfix">
                        	<img src="<%=Avatar(items[j].com_user, 36)%>"  onerror='this.src="<%=blog.web%>/private/themes/<%=data.global.blog_theme%>/avatar.png"' class="avatar"/>
                            <div class="tools">
                            <%if ( user.group.indexOf("ReplyComment") > -1 ){%>
                            <a href="javascript:;" app-cid="<%=items[j].id%>" app-rid="<%=comments[i].id%>" app-id="<%=id%>" class="app-reply"><i class="fa fa-comment"></i></a>
                            <%};%>
                            <%if ( user.group.indexOf("RemoveComment") > -1 || (user.id === items[j].com_user.id && user.id !== 0) ){%>
                            <a href="javascript:;" app-cid="<%=items[j].id%>" class="app-remove"><i class="fa fa-trash-o"></i></a>
                            <%};%>
                            </div>
                        </div>
                    </div>
                    <div class="comment-box-info">
                    	<div class="nick">
                        	<a href="http://<%=items[j].com_user.site%>" target="_blank" rel="nofollow"><%=items[j].com_user.nick%></a>
                        </div>
                        <div class="time"><%=date.format(new Date(items[j].com_postdate), "y-m-d h:i:s")%></div>
                        <div class="des"><%=items[j].com_content%></div>
                    </div>
                </div>
        	</div>
        <%					
						}			
					}
				}
				data.pages = pages;
				if ( !data.actives ){ data.actives = {}; };
				data.actives.url = url;
				data.pages.current = page;
				sups.include("pages.asp");
			}else{
		%>
        	<p>暂无<%=dis%></p>
        <%		
			}
		%>
    </div>
<%
	if ( user.group.indexOf("PostComments") > -1 ){
%>
    <div class="comment-post">
        <h5>发表您的<%=dis%></h5>
        
        <div id="avatar" style="display:none;">
    	<!--用户的默认头像，此处没地方摆，所以display:none了-->
		<%
			if ( user.login ){
		%>
            <img src="<%=user.avatar%>/64" onerror="this.src='<%=blog.web%>/private/themes/<%=data.global.blog_theme%>/avatar.png'" />
		<%		
			}else{
		%>
            <img src="<%=blog.web%>/private/themes/<%=data.global.blog_theme%>/avatar.png" />      
		<%
			}
		%>    
        </div>
        
        <form action="public/sync.asp?m=<%=package.pmark%>&p=post&t=plugin" method="post" id="postform">
        <input type="hidden" name="id" value="<%=id%>" />
        <input type="hidden" name="root" value="0" />
        <input type="hidden" name="parent" value="0" />
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
        <%
            if ( !user.login ){
        %>
        	<tr>
            	<td></td>
                <td><i class="fa fa-exclamation-triangle"></i> 强烈建议<a href="http://app.webkits.cn/public/views/regist.asp">注册云平台</a>，一键登录所有基于PJBlog5搭建的网站！</td>
            </tr>
            <tr>
                <td align="right">昵称</td>
                <td><input type="text" name="nick" value="" style="width:300px;" /></td>
            </tr>
            <tr>
                <td align="right">邮箱</td>
                <td><input type="text" name="mail" value="" style="width:300px;" /></td>
            </tr>
            <tr>
                <td align="right">网址</td>
                <td><input type="text" name="site" value="" style="width:300px;" /></td>
            </tr>
        <%
			}else{
		%>
        	<tr>
            	<td></td>
                <td><i class="fa fa-exclamation-triangle"></i> <span id="nick"><%=user.nick%></span>，您已登录，可以直接发表<%=dis%>！</td>
            </tr>
        <%		
			};
		%>
        	<tr>
            	<td width="80px;" align="right"><%=dis%>内容</td>
                <td><textarea name="content"></textarea></td>
            </tr>
            <tr>
            	<td></td>
                <td><input class="submit" name="submit" type="submit" value="提交" /><input class="reset" name="reset" type="reset" value="重写" /></td>
            </tr>
        </table>
        </form>
    </div>
<%};%>
</div>
<%
LoadJscript(function(params){ 
	window.login = params.login; 
	window.nick = params.nick; 
	window.mark = params.mark;
	window.dis = params.dis;
}, {login: user.login, nick: user.nick, mark: package.pmark, dis: dis});
%>