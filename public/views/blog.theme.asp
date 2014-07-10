<%
var rec = new dbo.RecordSet(conn),
	ChoosedFolder = "",
	choosed = {},
	locals = [];
	rec.sql("Select blog_theme From blog_global Where id=1").process(function( object ){ ChoosedFolder = object("blog_theme").value; });
	
var folders = fs.dirList(contrast("private/themes"), function( name ){
	if ( fs.exist(contrast("private/themes/" + name + "/config.js")) ){
		var mode = require("private/themes/" + name + "/config");
		if ( name === ChoosedFolder ){
			choosed.folder = name
			choosed.name = mode.name;
			choosed.author = mode.author;
			choosed.mail = mode.mail;
			choosed.site = mode.site;
			choosed.des = mode.des;
			choosed.icon = mode.icon;
			choosed.mark = mode.mark;
			choosed.plugins = mode.plugins;
			choosed.setting = fs.exist(resolve("private/themes/" + name + "/setting"));
		}else{
			var local = { folder: name };
			local.name = mode.name;
			local.author = mode.author;
			local.mail = mode.mail;
			local.site = mode.site;
			local.des = mode.des;
			local.icon = mode.icon;
			local.mark = mode.mark;
			local.plugins = mode.plugins;
			locals.push(local);
		};
	};
});
%>
<div id="theme">
	<div class="choosed clearfix">
    	<div class="img fleft">
        	<img src="private/themes/<%=choosed.folder%>/<%=choosed.icon%>" />
        </div>
        <div class="info">
        	<h6><%=choosed.name%></h6>
        	<div class="it"><i class="fa fa-user"></i><%=choosed.author%></div>
            <div class="it"><i class="fa fa-envelope-o"></i><%=choosed.mail%></div>
            <div class="it"><i class="fa fa-external-link-square"></i><%=choosed.site%></div>
            <div class="it"><i class="fa fa-share-alt"></i><%=choosed.mark%></div>
            <div class="it"><i class="fa fa-folder-open-o"></i><%=choosed.folder%></div>
            <div class="it"><i class="fa fa-comment-o"></i><%=choosed.des%></div>
        </div>
        <% if ( choosed.setting ){ %>
        <div class="tols">
        	<a href="javascript:;" class="app-setting"><i class="fa fa-cogs"></i>设置主题参数</a>
        </div>
        <% }; %>
    </div>
    <div class="locals">
    	<%
			if ( locals.length > 0 ){
		%>
        <h6><i class="fa fa-bar-chart-o"></i> 可选主题</h6>
    	<ul class="wf">
        	<%
				for ( var i = 0 ; i < locals.length ; i++ ){
			%>
            <li>
            	<div class="witem">
                	<div class="img"><img src="private/themes/<%=locals[i].folder%>/<%=locals[i].icon%>" /></div>
                    <div class="title"><%=locals[i].name%></div>
                    <div class="info">
                    	<p><i class="fa fa-user"></i><%=locals[i].author%></p>
                        <p><i class="fa fa-envelope-o"></i><%=locals[i].mail%></p>
                        <p><i class="fa fa-external-link-square"></i><%=locals[i].site%></p>
                        <p><i class="fa fa-share-alt"></i><%=locals[i].mark%></p>
                        <p><i class="fa fa-comment-o"></i><%=locals[i].des%></p>
                    </div>
                    <div class="tols">
                    	<a href="javascript:;" class="app-setup AutoSendAjax" app-m="theme" app-p="setup" app-id="<%=locals[i].folder%>" app-c="确定安装这个主题？如果确定安装，原主题信息将被撤销！"><i class="fa fa-repeat"></i> 安装</a>
                        <a href="javascript:;" class="app-remove AutoSendAjax" app-m="theme" app-p="remove" app-id="<%=locals[i].folder%>" app-c="确定删除这个主题吗？删除后无法恢复！"><i class="fa fa-trash-o"></i> 删除</a>
                    </div>
                </div>
            </li>
            <%	
				}
			%>
        </ul>
        <%
			}else{
		%>
        <p style="color:#777; padding-left:10px;"><i class="fa fa-exclamation-circle"></i> 抱歉！服务器上未找到本地主题！</p>
        <%	
			}
		%>
    </div>
</div>