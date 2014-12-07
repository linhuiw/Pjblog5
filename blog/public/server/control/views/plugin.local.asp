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
                            <a href="<%=iPress.setURL("async", "plugin", { m: "uninstall", id: installs[o.mark].id })%>" data-id="<%=installs[o.mark].id%>">卸载</a>
                            <%
									if ( !installs[o.mark].status ){
							%>
                            <a href="javascript:;">停用</a>
                            <%
									}else{
							%>
                            <a href="javascript:;">启用</a>
                            <%		
									}
								}else{
							%>
                            <a href="<%=iPress.setURL("async", "plugin", { m: "install", f: o.folder })%>" data-id="<%=o.folder%>">安装</a>
                            <a href="javascript:;">删除</a>
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