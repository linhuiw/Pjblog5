<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%include("private/themes/" + data.global.blog_theme + "/head.asp", { global: data.global });%>
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/appjs/assets/blog.loading.css"/>
<title>友情链接</title>
</head>
<body>
<%include("private/themes/" + data.global.blog_theme + "/header.asp", { categorys: data.categorys, gets: data.gets, global: data.global, user: data.user, themes: data.themes })%>
<div class="banner">
	<div id="bannerbody"><p>友情链接</p><p></p><p></p></div>
</div>
<div id="content" class="common">
	<div class="wrap">
    <div class="art-comments">
        <div class="comment" id="comment">
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
			<div class="texts clearfix">
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
			<div class="icons clearfix">
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
            <div class="postform" id="link">
            	<h3>提交你的链接</h3>
            	<form action="public/sync.asp?m=<%=data.plugin.mark%>&p=post&t=plugin" method="post" id="postform">
                	<table cellpadding="0" cellspacing="0" width="100%" border="0">
                    	<tr>
                        	<td align="center">网站名称</td>
                            <td><input type="text" name="link_name" style="width:300px;" class="text" /></td>
                        </tr>
                        <tr>
                        	<td align="center">网站地址</td>
                            <td><input type="text" name="link_src" style="width:350px;" class="text" /></td>
                        </tr>
                        <tr>
                        	<td align="center">网站图标</td>
                            <td><input type="text" name="link_icon" style="width:350px;" value="http://" class="text" /></td>
                        </tr>
                        <tr>
                        	<td width="80" align="center">网站描述</td>
                            <td><textarea name="link_des"></textarea></td>
                        </tr>
                        <tr>
                        	<td></td>
                            <td><input type="submit" value="提交" class="submit" /></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
    </div>
</div>
<script type="text/javascript">
require('<%="private/themes/" + data.global.blog_theme + "/js/bloglink"%>', function(common){new common();});
</script>
<%include("private/themes/" + data.global.blog_theme + "/footer.asp", { global: data.global });%>
</body>
</html>