<%
	;(function(mark){
		var topArticleExports = load(mark);
		if ( topArticleExports ){
			var topArt = new topArticleExports(),
			gets = topArt.getSideValue();
			if ( gets.length > 0 ){
%>
<div id="links" class="clearfix"><span>友情链接</span>
<%
				for ( var i = 0 ; i < gets.length ; i++ ){
					if ( i < 5 ){
%><a href="<%=gets[i].link_src%>"><%=gets[i].link_name%></a><%					
					}
				}
%>
</div>
<%
			}
		}
	})("DER56WRT456RT45ET35DAS8WWWE6FTYJT46");
%>