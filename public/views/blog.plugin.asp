<%
;(function( rec, q, m ){
	var installedMarks = [],
		unInstalledMarks = [],
		installs = [],
		unInstalls = [];
		
	var errorImage = "public/assets/img/1402321265_Settings.png";
	
	rec
		.sql("Select * From blog_plugins")
		.open()
		.each(function(object){
			installedMarks.push(object("plu_mark").value);
			installs.push({
				folder: object("plu_folder").value,
				icon: object("plu_icon").value,
				stop: object("plu_stop").value,
				id: object("id").value,
				name: object("plu_name").value,
				mark: object("plu_mark").value,
				author: object("plu_author").value,
				mail: object("plu_mail").value,
				web: object("plu_web").value,
				des: object("plu_des").value
			});
		})
		.close();
	
	fs.dirList(contrast("private/plugins"), function( name ){
		var dl = "private/plugins/" + name;
		if ( fs.exist(resolve(dl + "/config")) ){
			var mo = require(dl + "/config");
			if ( mo.mark && installedMarks.indexOf(mo.mark) === -1 ){
				unInstalledMarks.push(mo.mark);
                unInstalls.push({
                	folder: name,
                    icon: mo.icon,
                    stop: true,
                    id: 0,
                    name: mo.name,
                    mark: mo.mark,
                    author: mo.author,
                    mail: mo.mail,
                    web: mo.site,
                    des: mo.des
                });
			}
		}
	});
	
	function renderPluginsTemplate(configs){
		if ( configs.length === 0 ){
%>
	<div class="items"><i class="fa fa-github-alt"></i> 抱歉，找不到数据。</div>
<%
		};
		for ( var i = 0 ; i < configs.length ; i++ ){
%>
			<div class="items tansAchor <%=configs[i].stop && configs[i].id > 0 ? "stop" : ""%>">
            	<div class="icon"><img src="private/plugins/<%=configs[i].folder%>/<%=configs[i].icon%>" onerror="this.src='<%=errorImage%>'"></div>
                <div class="info">
               	  <h6><%=configs[i].name%></h6>
                  <div class="mark">标识： <%=configs[i].mark%></div>
                  <div class="author">作者： <a href="mailto:<%=configs[i].mail%>" target="_blank"><%=configs[i].author%></a> 参考文档：<a href="<%=configs[i].web%>" target="_blank">查阅</a> 文件夹：<%=configs[i].folder%></div>
                  <div class="des"><%=configs[i].des%></div>
                  <div class="tool">
                  	<%if ( configs[i].id === 0 ){%>
                  	<a href="javascript:;" app-id="<%=configs[i].folder%>" class="app-setup AutoSendAjax" app-m="plugin" app-p="install" app-c="确定需要安装这个插件？"><i class="fa fa-plug"></i>安装</a>
                    <a href="javascript:;" app-id="<%=configs[i].folder%>" class="app-delete AutoSendAjax" app-m="plugin" app-p="remove" app-c="确定删除？删除后无法恢复！"><i class="fa fa-trash-o"></i>删除</a>
                    <%}else{%>
                    <%if ( configs[i].stop ){%>
                	<a href="javascript:;" class="app-runit AutoSendAjax" app-id="<%=configs[i].id%>" app-m="plugin" app-p="RunTheplugin" app-c="确定启用这个插件？"><i class="fa fa-play"></i> 启用</a>
                    <%}else{%>
                    <a href="javascript:;" class="app-stopit AutoSendAjax" app-id="<%=configs[i].id%>" app-m="plugin" app-p="StopThePlugin" app-c="确定停用这个插件？"><i class="fa fa-power-off"></i> 停用</a>	
                    <%}%>
                	<a href="javascript:;" class="app-uninstall AutoSendAjax" app-id="<%=configs[i].id%>" app-m="plugin" app-p="unInstall" app-c="确定卸载这个插件？"><i class="fa fa-bug"></i> 卸载</a>
                    <%if ( fs.exist(resolve("private/plugins/" + configs[i].folder + "/setting")) && !configs[i].stop ){%>
                    <a href="javascript:;" class="app-setting" app-id="<%=configs[i].id%>"><i class="fa fa-cog"></i> 设置</a>
                    <%}};%>
                  </div>
                </div>
            </div>
<%		
		}
	}
%>
<div class="plu-navs">
	<a href="?m=<%=m%>" class="left <%=q==="installed"?"active": ""%>"><i class="fa fa-archive"></i><span>已安装的插件</span></a>
    <a href="?m=<%=m%>&q=uninstalled" class="left <%=q==="uninstalled"?"active": ""%>"><i class="fa fa-ils"></i><span>未安装的插件</span></a>
    <a href="?m=<%=m%>&q=cloudplugin" class="right <%=q==="cloudplugin"?"active": ""%>"><i class="fa fa-wifi"></i><span>云端插件下载</span></a>
</div>
<div class="plu-content">
<%
	if ( q === "installed" ){ renderPluginsTemplate(installs); }
	else if ( q === "uninstalled" ){ renderPluginsTemplate(unInstalls); }
	else{
%>
	<div class="items"><i class="fa fa-github-alt"></i> 抱歉，云端功能暂未开放，敬请期待。</div>
<%
	}
%>
</div>
<%
		
})( new dbo.RecordSet(conn), http.query("q") || "installed", m );
%>