<%
modules.scriptExec(function( data ){
	window.modules.plugin = data;
}, {
	install: iPress.setURL('async', 'plugin', { m: 'install' }),
	uninstall: iPress.setURL('async', 'plugin', { m: 'uninstall' }),
	change: iPress.setURL('async', 'plugin', { m: 'change' }),
	remove: iPress.setURL('async', 'plugin', { m: 'remove' })
})
%>
<div class="iPress-wrap">
	<div class="ibox float-e-margins">
        <div class="ibox-title">
            <h5>插件聚合</h5>
            <div class="ibox-tools">
                <a class="close-link" href="<%=blog.appsite + '/download'%>" target="_blank"> <i class="fa fa-location-arrow"></i> </a>
            </div>
        </div>
        <div class="ibox-content">
            <table class="table table-striped table-bordered table-hover dataTables-example">
                <thead>
                    <tr>
                        <th width="60">icon</th>
                        <th>名称</th>
                        <th>作者</th>
                        <th>安装</th>
                        <th>状态</th>
                        <th>版本</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                  	<%
						plugins.forEach(function(o){
					%>
                    <tr>
                    	<td><img src="<%="private/plugins/" + o.folder + "/" + o.icon%>" /></td>
                        <td><%=o.name%></td>
                        <td><%=o.author%></td>
                        <td><%=installs[o.mark] ? "已安装" : "未安装"%></td>
                        <td><%=installs[o.mark] ? ( !installs[o.mark].status ? "已启用" : "未启用" ) : "未知"%></td>
                        <td align="center" valign="middle"><%=o.version || 0%></td>
                        <td><%=o.des%></td>
                        <td>
                        	<%
								if ( installs[o.mark] ){
							%>
                            <a href="javascript:;" data-id="<%=installs[o.mark].id%>" class="plus_unisntall">卸载</a>
                            <%
									if ( !installs[o.mark].status ){
							%>
                            <a href="javascript:;" data-id="<%=installs[o.mark].id%>" class="plus_change">停用</a>
                            <%
									}else{
							%>
                            <a href="javascript:;" data-id="<%=installs[o.mark].id%>" class="plus_change">启用</a>
                            <%		
									}
									
									if ( o.setExist ){
							%>
                            <a href="javascript:;" data-id="<%=o.folder%>" class="plus_set" data-toggle="modal" data-target=".bs-example-modal-lg">设置</a>
                            <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                              <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                                    <h4 class="modal-title" id="myLargeModalLabel"><%=o.name%>插件自定义参数设置</h4>
                                  </div>
                                  <div class="modal-body">
                                  	<form action="<%=iPress.setURL("async", "plugin", { m: "setParams" })%>" method="post" class="ajax-form">
                                    	<input type="hidden" name="id" value="<%=installs[o.mark].id%>" />
                                        <table class="table table-bordered">
                                        <%=formatParams(installs[o.mark].id, o.folder)%>
                                        </table>
                                        <p><button type="submit" class="btn btn-info">保存自定义配置参数</button></p>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <%		
									}
								}else{
							%>
                            <a href="javascript:;" data-id="<%=o.folder%>" class="plus_install">安装</a>
                            <a href="javascript:;" data-id="<%=o.folder%>" class="plus_remove">删除</a>
                            <%	
								}
							%>
                        </td>
                    </tr>
                    <%	
						});
					%>  
                </tbody>
                <tfoot>
                    <tr>
                        <th>icon</th>
                        <th>名称</th>
                        <th>作者</th>
                        <th>安装</th>
                        <th>状态</th>
                        <th>版本</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>