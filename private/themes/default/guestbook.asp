<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/reset.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/common.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/default.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/appjs/assets/blog.loading.css"/>
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/fontawesome/css/font-awesome.min.css"/>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/tron.js"></script>
<script type="text/javascript" src="<%=blog.web%>/private/configs/assets.js"></script>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/jquery.js"></script>
<title><%=data.global.blog_name%> - 留言本插件</title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/navigation.asp", { categorys: data.categorys, gets: data.gets, global: data.global });%>
<div class="articles clearfix wrap">
	<div class="side fright">
    	<%include("private/themes/" + data.global.blog_theme + "/side-login.asp", { user: data.user });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-toparticle.asp", { load: load, dbo: dbo, conn: conn });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-topcomment.asp", { load: load, dbo: dbo, conn: conn });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-link.asp", { load: load, dbo: dbo, conn: conn });%>
    </div>
	<div class="list">
    	<div class="detail">
        	<div class="detail-lists">
            	<h3>留言列表</h3>
            	<%
				;(function(){
					var GuestBookExports = load(data.plugin.mark),
						GuestBook = new GuestBookExports({
							perpage: data.setting.perpage,
							page: data.page
						}),
						GuestMessage = GuestBook.getList(),
						datas = GuestMessage.data;
					
					for ( var i = 0 ; i < datas.length ; i++ ){	
				%>
                <div class="items">
                	<div class="img fleft"><img src="<%=datas[i].avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" /></div>
                    <div class="infos">
                    	<div class="nick"><%=datas[i].nick%></div>
                        <div class="time"><%=datas[i].time%></div>
                        <div class="des"><%=datas[i].content%></div>
                        <%
							if ( datas[i].reply.length > 0 ){
						%>
                        <div class="reply">
                        	<div class="replybox">
                        	<h4>博主回复：</h4>
                            <div class="repc"><%=datas[i].reply%></div>
                            </div>
                        </div>
                        <%	
							};
						%>
                    </div>
                </div>
                <%		
						}
						
					include("private/themes/" + data.global.blog_theme + "/pages.asp", { pages: GuestMessage.pages, url: blog.web + "/plugin.asp?id=" + data.id });
				})();
				%>
            </div>
        	<div class="postform">
            	<h3>发表您的留言</h3>
            	<form action="public/sync.asp?m=<%=data.plugin.mark%>&p=post&t=plugin" method="post" id="postform">
                	<table cellpadding="0" cellspacing="0" width="100%" border="0">
                    	<%
							if ( !data.user.login ){
						%>
                    	<tr>
                        	<td align="center">昵称</td>
                            <td><input type="text" name="nick" style="width:300px;" /></td>
                        </tr>
                        <tr>
                        	<td align="center">邮箱</td>
                            <td><input type="text" name="mail" style="width:250px;" /></td>
                        </tr>
                        <%
							}else{
						%>
                        <tr>
                        	<td></td>
                        	<td><i class="fa fa-exclamation-triangle"></i> <%=data.user.nick%>，您已登录，可以直接发表留言！</td>
                        </tr>
                        <%		
							};
						%>
                        <tr>
                        	<td width="80" align="center">评论内容</td>
                            <td><textarea name="content"></textarea></td>
                        </tr>
                        <tr>
                        	<td></td>
                            <td><input type="submit" value="提交" /></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>
<%include("private/themes/" + data.global.blog_theme + "/footer.asp", { global: data.global });%>
<script type="text/javascript" language="javascript">
require('private/themes/<%=data.global.blog_theme%>/js/guestbook', function( book ){ typeof book === 'function' && new book(); });
</script>
</body>
</html>