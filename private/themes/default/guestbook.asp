<%
	var date = require("date");
%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
    </div>
	<div class="list">
    	<div class="detail">
        	<div class="detail-lists">
            	<h3>留言列表</h3>
            	<%
				;(function(){
					var rec = new dbo.RecordSet(conn),
						keep = [],
						ids = [],
						uids = {},
						md5 = require("md5");
						
					var ac = rec.DualTopPage(
						"blog_messages", 
						"*", 
						false, 
						"msg_postdate DESC", 
						"msg_postdate ASC", 
						data.setting.perpage, 
						data.page, 
						function( object ){
							keep.push({
								id: object("id").value,
								msg_member_id: object("msg_member_id").value,
								msg_content: object("msg_content").value,
								msg_postdate: date.format(new Date(object("msg_postdate").value), "y-m-d h:i:s"),
								msg_reply: object("msg_reply").value,
								msg_username: object("msg_username").value || "",
								msg_usermail: object("msg_usermail").value || ""
							});
							ids.push(object("msg_member_id").value);
						});
						
						if ( ids.length > 0 ){
							rec = new dbo.RecordSet(conn);
							rec
								.sql("Select * From blog_members Where id in (" + ids.join(",") + ")")
								.open(1)
								.each(function(object){
									uids[object("id") + ""] = {
										nick: object("member_nick").value,
										avatar: object("member_avatar").value
									}
								})
								.close();
						}
							
						for ( var i = 0 ; i < keep.length ; i++ ){
							var nick, avatar;
							if ( keep[i].msg_member_id > 0 ){
								nick = uids[keep[i].msg_member_id + ""].nick;
								avatar = uids[keep[i].msg_member_id + ""].avatar;
							}else{
								nick = keep[i].msg_username;
								avatar = blog.AppPlatForm + "/avatars/" + md5.make(keep[i].msg_usermail) + ".jpg";
							}
				%>
                <div class="items">
                	<div class="img fleft"><img src="<%=avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" /></div>
                    <div class="infos">
                    	<div class="nick"><%=nick%></div>
                        <div class="time"><%=keep[i].msg_postdate%></div>
                        <div class="des"><%=keep[i].msg_content%></div>
                        <%
							if ( keep[i].msg_reply.length > 0 ){
						%>
                        <div class="reply">
                        	<div class="replybox">
                        	<h4>博主回复：</h4>
                            <div class="repc"><%=keep[i].msg_reply%></div>
                            </div>
                        </div>
                        <%	
							};
						%>
                    </div>
                </div>
                <%		
						}
						
					include("private/themes/" + data.global.blog_theme + "/pages.asp", { pages: rec.BuildPage(ac.pageindex, ac.pageCount), url: blog.web + "/plugin.asp?id=" + data.id });
				})();
				%>
            </div>
        	<div class="postform">
            	<h3>发表您的留言</h3>
            	<form action="public/sync.asp?m=A5A465WA1T545ET35DAS8WWWE6FTYJT46&p=post&t=plugin" method="post" id="postform">
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