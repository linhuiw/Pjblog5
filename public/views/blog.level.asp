<%
;(function(){
	var levels = [],
		rec = new dbo.RecordSet(conn);
		
	rec
		.sql("Select * From blog_levels")
		.open()
		.each(function(object){
			levels.push({
				id: object("id").value,
				name: object("code_name").value,
				des: object("code_des").value,
				mark: object("code_mark").value
			});
		})
		.close();
%>
<div class="plu-navs">
	<a href="javascript:;" class="left active"><i class="fa fa-yelp"></i><span>用户组列表</span></a>
    <a href="javascript:;" class="left AutoSendAjax addGroups" app-p="addGroupByAuto" app-m="level"><i class="fa fa-plus"></i><span>新增用户组</span></a>
</div>
<div class="plu-content">
<table cellpadding="0" cellspacing="0" border="0" width="100%" class="plu-table">
<%
	rec = new dbo.RecordSet(conn);
	rec
		.sql("Select * From blog_groups")
		.open()
		.each(function(object){
			var code = JSON.parse(object("group_code").value);
%>
	<tr>
            <td width="150" align="center" class="dt"><%=object("group_name").value%></td>
            <td>
    <%
            for ( var i = 0 ; i < levels.length ; i++ ){
                if ( code.indexOf(levels[i].id) > -1 ){
    %>
        <p><span><input type="checkbox" value="<%=levels[i].id%>" checked="checked"> <%=levels[i].name%></span> <strong><%=levels[i].des%></strong></p>			
    <%			
                }else{
    %>
        <p><span><input type="checkbox" value="<%=levels[i].id%>"> <%=levels[i].name%></span> <strong><%=levels[i].des%></strong></p>
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
%>
</table>
</div>
<%
})();
%>