<%
	var levels = {};
%>
<div class="clearfix">
    <div class="col-s-4">
    	<div class="pannel" id="levelul">
        	<h6><i class="fa fa-signal"></i> 权限列表</h6>
           	<%
				;(function(){
					var rec = new dbo.RecordSet(conn);
					rec
						.sql("Select * From blog_levels")
						.open(1)
						.each(function(object){
							levels[object("id").value + ""] = { name: object("code_name").value, des: object("code_des").value };
			%>
            <div class="blocks clearfix">
            	<div class="p1">
                	<div class="name"><%=object("code_name").value%></div>
                    <div class="mark">[ <%=object("code_mark").value%> ]</div>
                </div>
                <div class="fright p3">
                    <%
						if ( !object("code_isystem").value ){
					%>
                    <a href="javascript:;" class="app-level-modify" app-id="<%=object("id").value%>"><i class="fa fa-edit"></i> 编辑</a>
                    <a href="javascript:;" class="AutoSendAjax app-level-remove" app-id="<%=object("id").value%>" app-m="level" app-p="LevelRemove" app-c="确定要删除？"><i class="fa fa-trash-o"></i> 删除</a>
                    <%
						};
					%>
                </div>
                <div class="p2"><%=object("code_des").value%></div>
            </div>
            <%	
						})
						.close();
				})();
			%>
            <input type="button" value="新增权限" id="addnewlevel" />
        </div>
    </div>
    <div class="col-s-6">
    	<div class="pannel">
        	<h6><i class="fa fa-github-alt"></i> 用户组列表</h6>
			<div class="setform groups-list">
                <h5><i class="fa fa-hand-o-right"></i> 组群功能管理列表。请慎重选择权限。 <button app-p="addGroupByAuto" app-m="level" class="AutoSendAjax addGroups"><i class="fa fa-plus"></i> 添加组群</button></h5>
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                <%
					;(function(){
						var rec = new dbo.RecordSet(conn);
						rec
							.sql("Select * From blog_groups")
							.open(1)
							.each(function(object){
								var code = JSON.parse(object("group_code").value);
				%>
                	<tr>
                        <td width="150"><%=object("group_name").value%></td>
                        <td>
                <%
						for ( var i in levels ){
							if ( code.indexOf(Number(i)) > -1 ){
				%>
                	<p><span><input type="checkbox" value="<%=i%>" checked="checked"> <%=levels[i].name%></span> <strong><%=levels[i].des%></strong></p>			
                <%			
							}else{
				%>
                	<p><span><input type="checkbox" value="<%=i%>"> <%=levels[i].name%></span> <strong><%=levels[i].des%></strong></p>
                <%	
							}	
						}
				%>        
                			<div class="tools">
                            	<a href="javascript:;" class="app-group-levels-save" app-id="<%=object("id").value%>"><i class="fa fa-save"></i> 保存权限</a>
                                <%
									if ( !object("group_isystem").value ){
								%>
                                <a href="javascript:;" class="app-group-modify" app-id="<%=object("id").value%>"><i class="fa fa-edit"></i> 编辑该组</a>
                                <a href="javascript:;" class="app-group-remove AutoSendAjax" app-id="<%=object("id").value%>" app-m="level" app-p="RemoveGroup" app-c="确定要删除"><i class="fa fa-trash-o"></i> 删除该组</a>
                                <%
									};
								%>
                            </div>
                        </td>
                    </tr>
                <%
							})
							.close();
					})();
				%>
                </tbody></table>
            </div>
        </div>
    </div>
</div>