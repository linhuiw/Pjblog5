<div class="pannel">
<h6>最新评论</h6>
<%
;(function(){
	var mark = "WTRY465WA1T545ET35DAS8WWWE6FTYJT46",
		CommentExports = load(mark),
		Comment = new CommentExports(mark),
		gets = Comment.getSideValue(),
		setting = Comment.getSettingValue();
		
	var date = require("date");
	var fns = require('fns');
		
	if ( gets.length > 0 ){
		for ( var i = 0 ; i < gets.length ; i++ ){
%>
	<div class="guestitems">
    	<img src="<%=gets[i].avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
        <div class="infos">
        	<div class="nick"><%=gets[i].nick%></div>
            <div class="des"><a href="article.asp?id=<%=gets[i].aid%>#comment_<%=gets[i].id%>"><%=fns.removeHTML(gets[i].content)%></a></div>
            <%if ( setting.dispearDate === "1" ){%>
            <div class="time"><%=date.format(new Date(gets[i].time), "y-m-d h:i:s")%></div>
            <%};%>
        </div>
    </div>
<%			
		}
	}else{
%>
<div class="noguest">没有留言数据。</div>
<%		
	}
})();
%>
</div>