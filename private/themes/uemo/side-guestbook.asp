<div class="imitem">
  	<div class="imhead">用户最新留言<a href="<%=blog.web%>/plugin.asp?id=<%=pid%>" target="_blank" class="immore">更多</a></div>  
    <div class="photo"> 
<%
			var datas = package.getSideValue(),
				date = require("date");
				
			if ( datas.length > 0 ){
				for ( var i = 0 ; i < datas.length ; i++ ){
%>
		<div class="pitem">
        	<a href="javascript:;">
            	<div class="avatar">
                	<img src="<%=datas[i].avatar%>?s=64&d=<%=escape("http://app.webkits.cn/avatars/default.png")%>" />
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