<div class="pannel">
<h6>最新留言</h6>
<%
;(function(){
	var mark = "A5A465WA1T545ET35DAS8WWWE6FTYJT46",
		GuestBookExports = load(mark),
		GuestBook = new GuestBookExports({ mark: mark }),
		gets = GuestBook.getSideValue();
		
	var setting = gets.setting,
		datas = gets.datas;
		
	if ( datas.length > 0 ){
		for ( var i = 0 ; i < datas.length ; i++ ){
%>
	<div class="guestitems">
    	<img src="<%=datas[i].avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
        <div class="infos">
        	<div class="nick"><%=datas[i].nick%></div>
            <div class="des"><%=datas[i].content%></div>
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