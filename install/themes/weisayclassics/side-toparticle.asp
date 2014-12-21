<%
		var gets = package.getSideValue();
			if ( gets.length > 0 ){
				for ( var i = 0 ; i < gets.length ; i++ ){
%>
		<li><a href="article.asp?id=<%=gets[i].id%>" class="notelist" title="<%=gets[i].title%>"><%=gets[i].title%></a>
			<%if ( setting.dispearDate === "1" ){%>
        	<span><%=gets[i].time%></span>
        	<%};%>
                </li>
<%					
				}
			}else{
%>
		<li>抱歉，暂未找到最新日志。</li>
<%				
			}
%>