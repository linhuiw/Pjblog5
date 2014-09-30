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
<title><%=data.global.blog_name%> - 友情链接插件</title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/navigation.asp", { categorys: data.categorys, gets: data.gets, global: data.global });%>
<div class="articles clearfix wrap">
	<div class="side fright">
    	<%include("private/themes/" + data.global.blog_theme + "/side-login.asp", { user: data.user, global: data.global });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-toparticle.asp", { load: load, dbo: dbo, conn: conn });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-topcomment.asp", { load: load, dbo: dbo, conn: conn });%>
        <%include("private/themes/" + data.global.blog_theme + "/side-guestbook.asp", { load: load, dbo: dbo, conn: conn });%>
    </div>
	<div class="list">
    	<div class="detail">
        	<div class="detail-lists">
            	<%
				;(function(){
					var LinkExports = load(data.plugin.mark),
						Link = new LinkExports(),
						datas = Link.getList(),
						icons = [],
						texts = [];
					
					for ( var i = 0 ; i < datas.length ; i++ ){	
						if ( datas[i].link_type === 0 ){
							texts.push(datas[i]);
						}else{
							icons.push(datas[i]);
						}
					}
					
					if ( texts.length > 0 ){
				%>
				<h3>文字链接</h3>
                <div class="texts">
				<%		
						for ( var m = 0 ; m < texts.length ; m++ ){
				%>
                    <div class="ic">
                    	<a href="<%=texts[m].link_src%>" target="_blank"><%=texts[m].link_name%></a>
                    	<div class="des"><%=texts[m].link_des%></div>
                    </div>
                <%			
						}	
				%>
                </div>
                <%			
					};
					
					if ( icons.length > 0 ){
				%>
                <h3>图片链接</h3>
                <div class="icons">
                <%
						for ( var n = 0 ; n < icons.length ; n++ ){
				%>
                	<div class="ic">
                    	<img src="<%=icons[n].link_icon%>" />
                    	<a href="<%=icons[n].link_src%>" target="_blank"><%=icons[n].link_name%></a>
                    	<div class="des"><%=icons[n].link_des%></div>
                    </div>
                <%			
						}
				%>
                </div>
                <%		
					}
				})();
				%>
            </div>
        	<div class="postform">
            	<h3>提交你的链接</h3>
            	<form action="public/sync.asp?m=<%=data.plugin.mark%>&p=post&t=plugin" method="post" id="postform">
                	<table cellpadding="0" cellspacing="0" width="100%" border="0">
                    	<tr>
                        	<td align="center">网站名称</td>
                            <td><input type="text" name="link_name" style="width:300px;" /></td>
                        </tr>
                        <tr>
                        	<td align="center">网站地址</td>
                            <td><input type="text" name="link_src" style="width:350px;" /></td>
                        </tr>
                        <tr>
                        	<td align="center">网站图标</td>
                            <td><input type="text" name="link_icon" style="width:350px;" value="http://" /></td>
                        </tr>
                        <tr>
                        	<td width="80" align="center">网站描述</td>
                            <td><textarea name="link_des"></textarea></td>
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
require('private/themes/<%=data.global.blog_theme%>/js/bloglink', function( book ){ typeof book === 'function' && new book(); });
</script>
</body>
</html>