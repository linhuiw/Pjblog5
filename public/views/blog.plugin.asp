<div class="clearfix" id="plugin">
	<div class="col-x-4">
    	<div class="tips">
        	<div class="clearfix">
            	<div class="install-block installed fleft"></div>
                <div class="install-block-info fleft">已安装插件</div>
                <div class="install-block uninstalled fleft"></div>
                <div class="install-block-info fleft">未安装插件</div>
            </div>
        </div>
        <div class="plugin-zone">
<%
	;(function(){
		var rec = new dbo.RecordSet(conn),
			keep = [];
			
		rec
			.sql("Select * From blog_plugins")
			.open(1)
			.each(function(object){
				keep.push(object("plu_mark").value);
%>
			<div class="plugins installed clearfix">
            	<div class="icon fleft"><img src="<%=object("plu_icon").value%>" onerror="this.src='public/assets/img/1402321265_Settings.png'" /></div>
                <div class="tool fright">
                	<%
						if ( object("plu_stop").value ){
					%>
                	<a href="javascript:;" class="app-runit AutoSendAjax" app-id="<%=object("id").value%>" app-m="plugin" app-p="RunTheplugin" app-c="确定启用这个插件？">
                    	<i class="fa fa-play"></i> 启用
                    </a>
                    <%
						}else{
					%>
                    <a href="javascript:;" class="app-stopit AutoSendAjax" app-id="<%=object("id").value%>" app-m="plugin" app-p="StopThePlugin" app-c="确定停用这个插件？">
                    	<i class="fa fa-power-off"></i> 停用
                    </a>	
                    <%	
						}
					%>
                	<a href="javascript:;" class="app-uninstall AutoSendAjax" app-id="<%=object("id").value%>" app-m="plugin" app-p="unInstall" app-c="确定卸载这个插件？"><i class="fa fa-undo"></i> 卸载</a>
                    <%
					if ( fs.exist(resolve("private/plugins/" + object("plu_folder").value + "/setting")) ){
					%>
                    <a href="javascript:;" class="app-setting" app-id="<%=object("id").value%>"><i class="fa fa-cog"></i> 设置</a>
                    <%
					}
					%>
                    <!--<a href=""><i class="fa fa-location-arrow"></i> 升级</a>-->
                </div>
                <div class="im">
                	<h6><%=object("plu_name").value%> <span class="mark"><i class="fa fa-share-alt-square"></i> <%=object("plu_mark").value%></span></h6> 
                    <div class="name">
                    	<i class="fa fa-child"></i> <%=object("plu_author").value%> 
                        <a href="mailto:<%=object("plu_mail").value%>" target="_blank"><i class="fa fa-send"></i> <%=object("plu_mail").value%></a>
                        <a href="<%=object("plu_web").value%>" target="_blank"><i class="fa fa-link"></i> <%=object("plu_web").value%></a>
                    </div>
                    <div class="des"><i class="fa fa-slack"></i> <%=object("plu_des").value%></div>
                    <div class="set"></div>
                </div>
            </div>
<%
			})
			.close();
			
		fs.dirList(contrast("private/plugins"), function( name ){
			var dl = "private/plugins/" + name;
			if ( fs.exist(resolve(dl + "/config")) ){
				var mo = require(dl + "/config");
				if ( mo.mark && keep.indexOf(mo.mark) === -1 ){
%>
			<div class="plugins uninstalled clearfix">
            	<div class="icon fleft"><img src="<%=mo.icon%>" onerror="this.src='public/assets/img/1402321265_Settings.png'" /></div>
                <div class="tool fright">
                	<a href="javascript:;" app-id="<%=name%>" class="app-setup AutoSendAjax" app-m="plugin" app-p="install" app-c="确定需要安装这个插件？">
                    	<i class="fa fa-repeat"></i> 安装
                    </a>
                    <a href="javascript:;" app-id="<%=name%>" class="app-delete AutoSendAjax" app-m="plugin" app-p="remove" app-c="确定删除？删除后无法恢复！">
                    	<i class="fa fa-trash-o"></i> 删除
                    </a>
                </div>
                <div class="im">
                	<h6><%=mo.name%> <span class="mark"><i class="fa fa-share-alt-square"></i> <%=mo.mark%></span></h6>
                    <div class="name">
                    	<i class="fa fa-child"></i> <%=mo.author%> 
                        <a href="mailto:<%=mo.mail%>" target="_blank"><i class="fa fa-send"></i> <%=mo.mail%></a>
                        <a href="http://webkits.cn" target="_blank"><i class="fa fa-link"></i> <%=mo.site%></a>
                    </div>
                    <div class="des"><i class="fa fa-slack"></i> <%=mo.des%></div>
                    <div class="set"></div>
                </div>
            </div>
<%
				}
			}
		});
	})();
%>

        </div>
    </div>
</div>