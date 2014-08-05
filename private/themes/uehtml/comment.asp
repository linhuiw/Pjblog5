<div class="comment" id="comment">
	<%
		var date = require("date");
        if ( user.group.indexOf("PostComments") > -1 ){
    %>
    <div class="postform">
    	<%
			if ( user.login ){
		%>
        <p>亲爱的粉丝 - <span id="nick"><%=user.nick%></span>，您已登录，马上发表评论吧！<span id="message" class="error"></span></p>	
        <%		
			}else{
		%>
        <p>您还没有登录，希望你能<a href="<%=user.href%>">登录</a>后发表评论，以便系统能准确的使用云平台功能跟踪。<span id="message" class="error"></span></p>
        <%		
			}
		%>
        <form action="public/sync.asp?m=comment&p=post" method="post" id="postform">
        <input type="hidden" name="id" value="<%=id%>" id="aid" />
        <input type="hidden" name="root" value="0" />
        <div class="form clearfix">
        	<div class="avatar">
            	<img src="<%=user.avatar%>?s=36" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
            </div>
            <div class="posts">
            	<%if ( !user.login ){%>
            	<p><input type="text" name="nick" value="" style="width:300px;" class="text" placeholder="亲，您还没有填写您的昵称呢！" /></p>
                <p><input type="text" name="mail" value="" style="width:300px;" class="text" placeholder="亲，有邮箱么？填一下吧！" /></p>
                <%};%>
                <div class="textarea">
            	<textarea class="inputnone" name="content" placeholder="尼玛，老子马上要发表评了，抢楼开始。"></textarea>
                <input type="submit" value="我要评论" class="submit" />
                </div>
            </div>
        </div>
        </form>
    </div>
    <div id="comments">
    <% 	};
		if ( comments.length > 0 ){
			for ( var i = 0 ; i < comments.length ; i++ ){
		%>
        <div class="root-comment comm" id="comment_<%=comments[i].id%>">
            <div class="comment-box clearfix">
                <div class="comment-box-user">
                    <div class="comment-box-user-avatar">
                        <img src="<%=comments[i].com_user.avatar%>?s=64" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
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
                    <div class="comment-box-user-avatar">
                        <img src="<%=items[j].com_user.avatar%>?s=64" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
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
		};
		include("private/themes/" + global.blog_theme + "/pages.asp", { pages: pages, url: blog.web + "/article.asp?id=" + id });	
		%>
    </div>
</div>
<%LoadJscript(function(login){ window.login = login.login; window.nick = login.nick; }, {login: user.login, nick: user.nick});%>