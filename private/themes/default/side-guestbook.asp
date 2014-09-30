<div class="pannel">
<h6>最新留言</h6>
<%
;(function(){
	var mark = "QKRJQWELSADJFLJLWERQWLASJKIOERT",
		GuestBookExports = load(mark),
		GuestBook = new GuestBookExports({ mark: mark }),
		gets = GuestBook.getSideValue(),
		setting = GuestBook.getSettingValue();
		
	var fns = require('fns');
		
	if ( gets.length > 0 ){
		for ( var i = 0 ; i < gets.length ; i++ ){
%>
	<div class="guestitems">
    	<img src="<%=gets[i].avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
        <div class="infos">
        	<div class="nick"><%=gets[i].nick%></div>
            <div class="des"><%=fns.removeHTML(gets[i].content)%></div>
            <%if ( setting.dispearDate === "1" ){%>
            <div class="time"><%=gets[i].time%></div>
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