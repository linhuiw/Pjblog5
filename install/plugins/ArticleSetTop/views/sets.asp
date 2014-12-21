<%
modules.scriptExec(function( ms ){
	window.async = ms;
}, {
	modify: iPress.setURL("async", "PluginRequestJSON", { t: query.t, m: "Modify" }),
	remove: iPress.setURL("async", "PluginRequestJSON", { t: query.t, m: "Remove" })
});
%>
<div class="panel panel-default">
    <div class="panel-heading">
    	<h4><i class="fa fa-hand-o-up"></i> 置顶日志</h4>
    </div>
    <table class="table">
      <thead>
        <tr>
            <td style="text-align:center">ID</td>
            <td>标题</td>
            <td colspan="2" style="text-align:center">操作</td>
        </tr>      
      </thead>
      <tbody>
        <%for (var i=0; i<topList.length; i++) {%>
        <tr>
        	<td width="10"><%=topList[i].id%></td>
            <td><span class="art_title"><%=topList[i].title%></span></td>
            <td width="50"><a href="javascript:;" class="act-modify" appid="<%=topList[i].id%>" action="top">编辑</a></td>
            <td width="50"><a href="javascript:;" class="act-cancel" appid="<%=topList[i].id%>" action="top">取消</a></td>
        </tr>
        <%}%>
      </tbody>
    </table>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
    	<h4><i class="fa fa-star"></i> 推荐日志</h4>
    </div>
    <table class="table">
      <thead>
        <tr>
            <td style="text-align:center">ID</td>
            <td>标题</td>
            <td colspan="2" style="text-align:center">操作</td>
        </tr>      
      </thead>
      <tbody>
        <%for (var i=0; i<recList.length; i++) {%>
        <tr>
        	<td width="10"><%=recList[i].id%></td>
            <td><span class="art_title"><%=recList[i].title%></span></td>
            <td width="50"><a href="javascript:;" class="act-modify" appid="<%=recList[i].id%>" action="rec">编辑</a></td>
            <td width="50"><a href="javascript:;" class="act-cancel" appid="<%=recList[i].id%>" action="rec">取消</a></td>
        </tr>
        <%}%>
      </tbody>
    </table>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
    	<h4><i class="fa fa-cog"></i> 编辑标题</h4>
    </div>
    <table class="table">
      <thead>
        <tr>
            <td style="text-align:center">ID</td>
            <td>自定义标题</td>
        </tr>      
      </thead>
      <tbody>
        <tr>
        	<td width="10" style="vertical-align:middle"><span id="artid"></span></td>
            <td><input id="title" type="text" value="" class="form-control input-sm" placeholder="支持HTML标签" /></td>
        </tr>
      </tbody>
    </table>
</div>
<button class="btn btn-primary" id="SaveTitle">保存标题</button>