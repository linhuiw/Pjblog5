<%
	;(function(mark){
		var topArticleExports = load(mark);
		if ( topArticleExports ){
%>
<div class="imitem">
  	<div class="imhead">博主最新发表的日志<!--<a href="http://www.uehtml.com/designers?sort=rec" target="_blank" class="immore">更多</a>--></div>  
    <div class="note"> 
<%
			var topArt = new topArticleExports(mark),
			gets = topArt.getSideValue(),
			setting = topArt.getSettingValue();
			if ( gets.length > 0 ){
				for ( var i = 0 ; i < gets.length ; i++ ){
%>
		<a href="article.asp?id=<%=gets[i].id%>" class="notelist">
        	<i><%=i + 1%>.</i><%=gets[i].title%>
			<%if ( setting.dispearDate === "1" ){%>
        	<span><%=gets[i].time%></span>
        	<%};%>
        </a>
<%					
				}
			}else{
%>
		<span style="margin-top:20px;display:block; margin-left:20px;">抱歉，暂未找到最新日志。</span>
<%				
			}
%>
	</div>
</div>
<%
		}
	})("A5A465WA1T545ET35ER6QE4A6FTYJT46");
%>