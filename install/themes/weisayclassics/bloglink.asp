<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>友情链接 - <%=data.global.blog_name%></title>
<meta name="description" content="<%=data.global.blog_name%>的友情链接页面，链接，因链而接。" />
<meta name="keywords" content="bloglink,link,链接,友情链接" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/style.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/notice.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/fontawesome/css/font-awesome.min.css"/>
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/appjs/assets/blog.loading.css"/>
<script type="text/javascript" src="http://libs.useso.com/js/jquery/1.8.3/jquery.min.js"></script>
<script type="text/javascript" src="<%=blog.web + "/private/themes/" + data.global.blog_theme%>/js/weisay.js"></script>
<script type="text/javascript" src="<%=blog.web%>/appjs/assets/tron.js"></script>
<script type="text/javascript" src="<%=blog.web%>/private/configs/assets.js"></script>
</head>
<body>
<div id="page">
<div id="head">
<div id="header">
<div class="logo">
	<div id="blogname"><a href="<%=blog.web%>"><%=data.global.blog_name%></a>
    <div id="blogtitle"><%=data.global.blog_title%></div></div> 
</div>
<div class="clear"></div>
</div>
</div>
<div class="mainmenus">
<div class="mainmenu">
<div class="topnav">
<%sups.include("navigation.asp");%>
</div>
<div class="clear"></div>
</div>
</div>

<div id="roll"><div title="回到顶部" id="roll_top"></div><div title="转到底部" id="fall"></div></div>
<div id="content">
<div class="main">
<div id="map">
<div class="site">当前位置： <a title="返回首页" href="<%=blog.web%>">首页</a> &gt; 链接</div>
</div>
<div class="article article_c">
<div class="weisaylink">
			<ul>
               	<%
				;(function(){
					var ms = sups.plugins();
					var package = ms.package;
					var setting = ms.setting;
					var datas = package.getList(),
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
				<li class="clear">
				<h3>文字链接</h3>
                <ul class='texts'>
				<%		
						for ( var m = 0 ; m < texts.length ; m++ ){
				%>
                <li><a href="<%=texts[m].link_src%>" target="_blank" title="<%=texts[m].link_des%>"><%=texts[m].link_name%></a></li>
                <%			
						}	
				%>
                </ul></li>
                <%			
					};
					
					if ( icons.length > 0 ){
				%>
				<li class="clear">
                <h3>图片链接</h3>
                <ul class='icons'>
                <%
						for ( var n = 0 ; n < icons.length ; n++ ){
				%>
                <li><a href="<%=icons[n].link_src%>" target="_blank" title="<%=icons[n].link_name%> - <%=icons[n].link_des%>"><img src="<%=icons[n].link_icon%>" /></a></li>
                <%			
						}
				%>
                </ul></li>
                <%		
					}
				})();
				%>
            </ul></div>
<div class="clear"></div>
        	<div id="respond_box">
	<div id="respond">
            	<h3>提交你的链接</h3>
            	<form action="public/sync.asp?m=<%=data.plugin.mark%>&p=post&t=plugin" method="post" id="postform">
                	<table cellpadding="0" cellspacing="0" width="100%" border="0">
                    	<tr>
                        	<td align="left">网站名称<span style="color:#f00"> *</span></td>
                            <td><input type="text" name="link_name" value="" style="width:350px;"/></td>
                        </tr>
                        <tr>
                        	<td align="left">网站地址<span style="color:#f00"> *</span></td>
                            <td><input type="text" name="link_src" value="" style="width:350px;"/></td>
                        </tr>
                        <tr>
                        	<td align="left">网站图标</td>
                            <td><input type="text" name="link_icon" value="" style="width:350px;"/></td>
                        </tr>
                        <tr>
                        	<td width="80" align="left">网站描述</td>
                            <td><textarea name="link_des"></textarea></td>
                        </tr>
                        <tr>
                        	<td></td>
                            <td><input class="submit" name="submit" type="submit" value="提交" />
			<input class="reset" name="reset" type="reset" value="重写" /></td>
                        </tr>
                    </table>
                </form>
            </div></div>
</div>
<div class="clear"></div>
</div>

<%sups.include("sidebar.asp");%>

</div>
</div>
<div class="clear"></div>
<%sups.include("footer.asp");%>
<script type="text/javascript" language="javascript">
require('private/themes/<%=data.global.blog_theme%>/js/bloglink', function( book ){ typeof book === 'function' && new book(); });
</script>
</body>
</html>