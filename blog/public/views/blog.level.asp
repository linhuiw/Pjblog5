<%
	var levels = [],
		groups = {};
%>
<div class="clearfix">
    <div class="col-s-6">
    	<div class="pannel">
        	<h6><i class="fa fa-github-alt"></i> 用户组列表</h6>
            <ul class="group-list">
            	<%
					;(function(){
						var rec = new dbo.RecordSet(conn);
						rec
							.sql("Select * From blog_groups")
							.open(1)
							.each(function(object){
								groups[object("group_mark").value] = JSON.parse(object("group_code").value);
				%>
                <li class="clearfix" id="group-<%=object("group_mark").value%>" mark="<%=object("group_mark").value%>" app-id="<%=object("id").value%>">
                	<div class="mark cutWord"><%=object("group_name").value%></div>
                    <div class="des">
                    	<div class="name"></div>
                    	<div class="text"><i class="fa fa-check-square-o"></i> <%=object("group_des").value%></div>
                        <div class="code"><i class="fa fa-code"></i> <%=object("group_mark").value%></div>
                        <div class="levels clearfix"></div>
                        <div class="action">
                        	<a href="javascript:;" class="app-save-group-rights"><i class="fa fa-save"></i> 保存权限</a>
                        	<%if ( !object("group_isystem").value ){%>
                        	<a href=""><i class="fa fa-pencil-square-o"></i> 编辑</a>
                            <a href=""><i class="fa fa-trash-o"></i> 删除</a>
                            <%}%>
                        </div>
                    </div>
                </li>
                <%			
							})
							.close();
					})();
				%>
            </ul>
            <button id="addnewgroup"><i class="fa fa-plus"></i> 添加新组群</button>
        </div>
    </div>
    <div class="col-s-4">
    	<div class="pannel">
        	<h6><i class="fa fa-signal"></i> 权限列表</h6>
            <ul class="level-list">
            	<%
					;(function(){
						var rec = new dbo.RecordSet(conn);
						rec
							.sql("Select * From blog_code")
							.open(1)
							.each(function(object){
								levels.push(object("code_name").value)
				%>
                <li class="clearfix">
                	<div class="mark cutWord"><%=object("code_name").value%></div>
                    <div class="des">
                    	<div class="text"><i class="fa fa-check-square-o"></i> <%=object("code_des").value%></div>
                        <div class="code"><i class="fa fa-code"></i> TronLevel.<%=object("code_name").value%> <i class="fa fa-angle-right"></i> <span class="true">True</span> or <span class="false">False</span></div>
                        <div class="action">
                        	<%if ( !object("code_isystem").value ){%>
                        	<a href="javascript:;" app-id="<%=object("id").value%>" class="app-level-modify"><i class="fa fa-pencil-square-o"></i> 编辑</a>
                            <a href="javascript:;" app-id="<%=object("id").value%>" class="app-level-remove"><i class="fa fa-trash-o"></i> 删除</a>
                            <%}%>
                        </div>
                        <div class="editbox"></div>
                    </div>
                </li>
                <%			
							})
							.close();
					})();
				%>
            </ul>
            <button id="addnewlevel"><i class="fa fa-plus"></i> 添加新权限</button>
        </div>
    </div>
</div>
<%
	LoadJscript(function(params){
		window.levels = params[0];
		window.groups = params[1];
	}, [levels, groups]);
%>