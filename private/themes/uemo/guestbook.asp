<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%include("private/themes/" + data.global.blog_theme + "/head.asp", { global: data.global });%>
<title>留言本</title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/header.asp", { categorys: data.categorys, gets: data.gets, global: data.global, user: data.user, themes: data.themes })%>
<div class="banner">
	<div id="bannerbody"><p>留言本 - 雁过留声</p><p></p><p></p></div>
</div>
<div id="content" class="common">
	<div class="wrap">
    <div class="art-comments">
        <div class="comment" id="comment">
        <%
        if ( data.user.group.indexOf("PostMessage") > -1 ){
		%>
        	<div class="postform">
				<%
                    if ( data.user.login ){
                %>
                <p>亲爱的粉丝 - <span id="nick"><%=data.user.nick%></span>，您已登录，马上发表留言吧！<span id="message" class="error"></span></p>	
                <%		
                    }else{
                %>
                <p>您还没有登录，希望你能<a href="<%=data.user.href%>">登录</a>后发表留言。<span id="message" class="error"></span></p>
                <%		
                    }
                %>
                <form action="public/sync.asp?m=<%=data.plugin.mark%>&p=post&t=plugin" method="post" id="postform">
                <div class="form clearfix">
                    <div class="avatar">
                        <img src="<%=data.user.avatar%>?s=36" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
                    </div>
                    <div class="posts">
                        <%if ( !data.user.login ){%>
                        <p><input type="text" name="nick" value="" style="width:300px;" class="text" placeholder="亲，您还没有填写您的昵称呢！" /></p>
                        <p><input type="text" name="mail" value="" style="width:300px;" class="text" placeholder="亲，有邮箱么？填一下吧！" /></p>
                        <%};%>
                        <div class="textarea">
                        <textarea class="inputnone" name="content" placeholder="写下您的留言吧"></textarea>
                        <input type="submit" value="我要留言" class="submit" />
                        </div>
                    </div>
                </div>
                </form>
            </div>
            <div id="comments">
        <%
				var GuestBookExports = load(data.plugin.mark),
					GuestBook = new GuestBookExports({
						perpage: data.setting.perpage,
						page: data.page
					}),
					GuestMessage = GuestBook.getList(),
					datas = GuestMessage.data;
				
				for ( var i = 0 ; i < datas.length ; i++ ){	
		%>
        		<div class="root-comment comm">
                    <div class="comment-box clearfix">
                        <div class="comment-box-user">
                            <div class="comment-box-user-avatar">
                                <img src="<%=datas[i].avatar%>?s=64" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
                            </div>
                        </div>
                        <div class="comment-box-info">
                            <div class="nick"><%=datas[i].nick%></div>
                            <div class="time"><%=datas[i].time%></div>
                            <div class="des"><%=datas[i].content%></div>
                            <%
								if ( datas[i].reply.length > 0 ){
							%>
							<div class="reply">
								<div class="replyboxs">
								<h4>博主回复：</h4>
								<div class="repc"><%=datas[i].reply%></div>
								</div>
							</div>
							<%	
								};
							%>
                        </div>
                    </div>
                </div>
        <%		
				};
		%>
        	</div>
        <%
			include("private/themes/" + data.global.blog_theme + "/pages.asp", { pages: GuestMessage.pages, url: blog.web + "/plugin.asp?id=" + data.id });
		}else{
		%>
        	<p>抱歉，您被禁止留言。</p>
        <%
		}
		%>
        </div>
    </div>
    </div>
</div>
<script type="text/javascript">
require('<%="private/themes/" + data.global.blog_theme + "/js/guestbook"%>', function(common){new common();});
</script>
<%include("private/themes/" + data.global.blog_theme + "/footer.asp", { global: data.global });%>
</body>
</html>