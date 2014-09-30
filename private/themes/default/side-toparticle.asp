<div class="pannel">
<h6>最新日志</h6>
<%
;(function(){
	var mark = "A5A465WA1T545ET35ER6QE4A6FTYJT46",
		topArticleExports = load(mark),
		topArt = new topArticleExports(mark),
		gets = topArt.getSideValue(),
		setting = topArt.getSettingValue();

	var date = require("date");	
	if ( gets.length > 0 ){
		for ( var i = 0 ; i < gets.length ; i++ ){
%>
	<div class="arts">
    	<a href="article.asp?id=<%=gets[i].id%>"><i><%=i + 1%>.</i><%=gets[i].title%></a>
        <%if ( setting.dispearDate === "1" ){%>
        <span><%=date.format(gets[i].time, "y-m-d h:i:s")%></span>
        <%};%>
    </div>
<%			
		}
	}else{
%>
<div class="noguest">暂无日志</div>
<%		
	}
})();
%>
</div>