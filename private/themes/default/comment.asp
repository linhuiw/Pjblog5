<div class="comment" id="comment">
    <div class="comment-list">
        <h5>评论列表</h5>
        <%
			var date = require("date");
			if ( comments.length > 0 ){
				for ( var i = 0 ; i < comments.length ; i++ ){
		%>
        	<div class="root-comment" id="comment_<%=comments[i].id%>">
        		<div class="comment-box">
                	<div class="comment-box-user">
                    	<div class="comment-box-user-avatar clearfix">
                        	<img src="<%=comments[i].com_user.avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
                            <div class="tools">
                            <%if ( user.group.indexOf("ReplyComment") > -1 ){%>
                            <a href="javascript:;" app-cid="<%=comments[i].id%>" app-id="<%=id%>" class="app-reply"><i class="fa fa-comment"></i></a>
                            <%};%>
                            <%if ( user.group.indexOf("RemoveComment") > -1 || (user.id === comments[i].com_user.id && user.id !== 0) ){%>
                            <a href="javascript:;" app-cid="<%=comments[i].id%>" class="app-remove"><i class="fa fa-trash-o"></i></a>
                            <%};%>
                            </div>
                        </div>
                    </div>
                    <div class="comment-box-info">
                    	<div class="nick"><%=comments[i].com_user.nick%></div>
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
		%>
        	<div class="child-comment" id="comment_<%=items[j].id%>">
        		<div class="comment-box">
                	<div class="comment-box-user">
                    	<div class="comment-box-user-avatar clearfix">
                        	<img src="<%=items[j].com_user.avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
                            <div class="tools">
                            <%if ( user.group.indexOf("RemoveComment") > -1 || (user.id === items[j].com_user.id && user.id !== 0) ){%>
                            <a href="javascript:;" app-cid="<%=items[j].id%>" class="app-remove"><i class="fa fa-trash-o"></i></a>
                            <%};%>
                            </div>
                        </div>
                    </div>
                    <div class="comment-box-info">
                    	<div class="nick"><%=items[j].com_user.nick%></div>
                        <div class="time"><%=date.format(new Date(items[j].com_postdate), "y-m-d h:i:s")%></div>
                        <div class="des"><%=items[j].com_content%></div>
                    </div>
                </div>
        	</div>
        <%					
						}			
					}
				}
				include("private/themes/" + global.blog_theme + "/pages.asp", { pages: pages, url: blog.web + "/article.asp?id=" + id });	
			}else{
		%>
        	<p>暂无评论</p>
        <%		
			}
		%>
    </div>
<%
	if ( user.group.indexOf("PostComments") > -1 ){
%>
    <div class="comment-post">
        <h5>发表您的评论</h5>
        <form action="public/sync.asp?m=comment&p=post" method="post" id="postform">
        <input type="hidden" name="id" value="<%=id%>" />
        <input type="hidden" name="root" value="0" />
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
        <%
            if ( !user.login ){
        %>
            <tr>
                <td align="right">昵称</td>
                <td><input type="text" name="nick" value="" style="width:300px;" /></td>
            </tr>
            <tr>
                <td align="right">邮箱</td>
                <td><input type="text" name="mail" value="" style="width:300px;" /></td>
            </tr>
        <%
			}else{
		%>
        	<tr>
            	<td></td>
                <td><i class="fa fa-exclamation-triangle"></i> <%=user.nick%>，您已登录，可以直接发表留言！</td>
            </tr>
        <%		
			};
		%>
        	<tr>
            	<td width="80px;" align="right">评论内容</td>
                <td><textarea name="content"></textarea></td>
            </tr>
            <tr>
            	<td></td>
                <td><input type="submit" value="提交" /></td>
            </tr>
        </table>
        </form>
    </div>
<%};%>
</div>
<%LoadJscript(function(login){ window.login = login.login; window.nick = login.nick; }, {login: user.login, nick: user.nick});%>