<div class="pannel">
<h6>最新评论</h6>
<%
;(function(){
	var mark = "WTRY465WA1T545ET35DAS8WWWE6FTYJT46",
		CommentExports = load(mark),
		Comment = new CommentExports(mark),
		gets = Comment.getSideValue();
		
	var setting = gets.setting,
		datas = gets.datas;
		
	if ( datas.length > 0 ){
		for ( var i = 0 ; i < datas.length ; i++ ){
%>
	<div class="guestitems">
    	<img src="<%=datas[i].avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
        <div class="infos">
        	<div class="nick"><%=datas[i].nick%></div>
            <div class="des"><a href="article.asp?id=<%=datas[i].aid%>#comment_<%=datas[i].id%>"><%=datas[i].content%></a></div>
            <%if ( setting.dispearDate === "1" ){%>
            <div class="time"><%=datas[i].time%></div>
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