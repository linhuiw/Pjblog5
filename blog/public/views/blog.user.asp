<%
var nick = http.query("n");
if ( !nick || nick.length === 0 ){
	nick = "";
};
var page = http.query("page");
if ( !page || page.length === 0 ){
	page = "1";
};
page = Number(page);
if ( page < 1 ){
	page = 1;
};
var sql = "";
if ( nick.length > 0 ){
	sql = "Select * From blog_members Where member_nick like '%" + nick + "%' Order By member_logindate DESC";
}else{
	sql = "Select * From blog_members Order By member_logindate DESC";
};
var date = require("date");
%>
<div id="user">
	<div class="top clearfix">
    	<% if ( nick.length > 0 ){%>
        <div class="achors fleft"><a href="?m=<%=m%>"><i class="fa fa-user-md"></i> 全部用户</a></div>
        <% }else{%>
    	<div class="achors fleft"><i class="fa fa-user-md"></i> 全部用户</div>
        <% };%>
        <div class="search fright">
        	<input type="text" name="keyword" id="keyword" />
            <button id="search"><i class="fa fa-search"></i></button>
        </div>
    </div>
    <div class="list waterfull">
    <%
		var rec = new dbo.RecordSet(conn);
		rec.sql(sql).open();
		var pages = rec.AdoPage(page, 50, function(object){
	%>
    	<div class="item">
        	<div class="dis clearfix">
                <div class="img fleft"><img src="<%=object('member_avatar').value%>" onerror="this.src='<%=blog.AppPlatForm%>/avatars/default.png'" /></div>
                <div class="info">
                    <div class="name clearfix">
                    	<%if ( object("id").value !== uid ){%>
                    	<a href="javascript:;" class="fright AutoSendAjax" app-id="<%=object('id').value%>" app-m="user" app-p="RemoveUser" app-c="删除用户将删除这个用户下的所有评论和留言信息！请慎重！确定要删除吗？"><i class="fa fa-trash-o"></i></a>
                        <a href="javascript:;" class="fright AutoSendAjax" app-id="<%=object('id').value%>" app-m="user" app-p="ChangeStatus"><i class="fa fa-repeat"></i></a>
                        <%};%>
						<%=object('member_nick').value%>
                    </div>
                    <div class="des clearfix">
                    	<p class="status"><i class="fa fa-dot-circle-o"></i><%=object('member_forbit').value ? "已被禁止登陆本站" : "正常，可登陆。"%></p>
                    	<p><i class="fa fa-child"></i><%=object('member_sex').value === 0 ? "保密" : object('member_sex').value === 1 ? "男" : "女"%></p>
                        <p><i class="fa fa-envelope-o"></i><%=object('member_mail').value%></p>
                        <p><i class="fa fa-link"></i><%=object('member_website').value%></p>
                        <p><i class="fa fa-calendar"></i><%=date.format(new Date(object('member_logindate').value), "y-m-d h:i:s")%></p>
                        <p><i class="fa fa-star-o"></i><%=date.format(new Date(object('member_birthday').value), "y-m-d h:i:s")%></p>
                        <p><i class="fa fa-home"></i><%=object('member_address').value%></p>
                    </div>
                </div>
            </div>
        </div>
    <%
		});
		rec.close();
	%>
    	
    </div>
</div>