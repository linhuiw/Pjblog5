<div class="pannel">
<h6>友情链接</h6>
<%
;(function(){
	var mark = "DER56WRT456RT45ET35DAS8WWWE6FTYJT46",
		LinkExports = load(mark),
		Link = new LinkExports(),
		datas = Link.getSideValue();
		
	if ( datas.length > 0 ){
		for ( var i = 0 ; i < datas.length ; i++ ){
%>
	<div class="arts">
    	<a href="<%=datas[i].link_src%>"><i><%=i + 1%>.</i><%=datas[i].link_name%></a>
    </div>
<%			
		}
	}else{
%>
<div class="noguest">没有友情链接。</div>
<%		
	}
})();
%>
</div>