<%
modules.scriptExec(function( ms ){
	window.async = ms;
}, {
	top: iPress.setURL("async", "PluginRequestJSON", { t: query.t, m: "AddTop" }),
	rec: iPress.setURL("async", "PluginRequestJSON", { t: query.t, m: "AddRec" })
});
%>
<div class="panel panel-default">
    <table class="table table-striped">
      <thead>
        <tr>
            <td style="text-align:center">ID</td>
            <td>标题</td>
            <td colspan="2" style="text-align:center">操作</td>
        </tr>      
      </thead>
      <tbody>

        <%for (var i=0; i<lists.length; i++) {%>
        <tr>
        	<td width="10"><%=lists[i].id%></td>
            <td><span id="art_<%=lists[i].id%>"><%=lists[i].art_title%></td>
            <td width="50"><a href="javascript:;" class="act-favorites" appid="<%=lists[i].id%>">置顶</a></td>
            <td width="50"><a href="javascript:;" class="act-recommend" appid="<%=lists[i].id%>">推荐</a></td>
        </tr>
        <%}%>
      </tbody>
    </table>
</div>

<ul class="pagination">
<%
	if ( pages.to > 1 ){
		for ( var i = pages.from ; i <= pages.to ; i++  ){
			if ( i === pages.current ){
%>
    			<li class="active"><a href="#"><%=i%></a></li>
    	<%}else{%>
				<li><a href="<%=iPress.setURL("control", "wrap", { t: query.t, p: query.p, page: i })%>"><%=i%></a></li>
<%		
			};
		};
	};
%> 
</ul>