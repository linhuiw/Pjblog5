<%
	;(function(mark){
		var CommentExports = load(mark);
		if ( CommentExports ){
%>
<div class="imitem">
  	<div class="imhead">用户最新留言</div>  
    <div class="photo"> 
<%
			var Comment = new CommentExports({ mark: mark }),
				gets = Comment.getSideValue(),
				setting = gets.setting,
				datas = gets.datas;
			
			var date = require("date");
				
			if ( datas.length > 0 ){
				for ( var i = 0 ; i < datas.length ; i++ ){
%>

                	<img src="<%=d		<div class="pitem">
        	<a href="javascript:;">
            	<div class="avatar">atas[i].avatar%>?s=64&d=<%=escape("http://app.webkits.cn/avatars/default.png")%>" />
                </div>
                <div class="info">
                	<div class="nick"><%=datas[i].nick%></div>
                    <div class="reply"><%=datas[i].content%></div>
                </div>
            </a>
        </div>
<%					
				}
			}else{
%>
		<span style="margin-top:20px; display:block; margin-left:20px;">抱歉，暂未找到用户发表的留言。</span>
<%				
			}
%>
	</div>
</div>
<%
		}
	})("A5A465WA1T545ET35DAS8WWWE6FTYJT46");
%>