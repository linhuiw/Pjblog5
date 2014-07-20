<style>
#book{}
#book .items{ background-color:#fff; margin-bottom:20px; padding:10px 15px; border-radius:3px; box-shadow:1px 3px 5px #ccc; color:#777; width:420px; margin-right:20px;}
#book .items .img{ margin-top:8px;}
#book .items .img img{ width:88px; height:31px; border-radius:3px;}
#book .items .infos{ margin-left:100px;}
#book .items .infos .nick{ height:20px; line-height:20px; font-weight:bold;}
#book .items .infos .time{ height:20px; line-height:20px; margin-bottom:5px;}
#book .items .infos .des{ line-height:20px;}
#book .items .infos .tools{ padding:10px 0px 5px 0;}
#book .items .infos .tools a{ margin-right:10px;}
#book .items .infos .reply .replybox{ border:1px dashed #ddd; padding:10px 15px; background-color:#f9f9f9;}
#book .items .infos .reply .replybox textarea{ width:90%; height:80px; margin-bottom:10px;}
#book .items .infos .reply .replybox h4{ height:20px; line-height:20px; padding:0px 0 5px 0; border-bottom:1px dashed #ccc; margin-bottom:5px;}
#book .items .infos .reply .replybox .repc{ line-height:20px;}
</style>
<div id="book">
<%
;(function(){
	var rec = new dbo.RecordSet(conn);
		
	rec
		.sql("Select * From blog_links Order By id DESC")
		.open()
		.each(function( object ){
%>
<div class="items">
	<div class="img fleft"><img src="<%=object("link_icon").value%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" /></div>
	<div class="infos">
		<div class="nick"><%=object("link_name").value%></div>
		<div class="time"><a href="<%=object("link_src").value%>" target="_blank"><%=object("link_src").value%></a></div>
		<div class="des"><%=object("link_des").value%></div>
        <div class="tools">
        	<%if ( object("link_hide").value ){%>
        	<a href="javascript:;" app-id="<%=object("id").value%>" class="app-pass AutoSendAjax" app-c="确定通过该链接？" app-m="<%=pmark%>" app-p="pass" app-t="plugin"><i class="fa fa-check"></i> 通过</a>
            <%}else{%>
            <a href="javascript:;" app-id="<%=object("id").value%>" class="app-unpass AutoSendAjax" app-c="确定取消该链接？" app-m="<%=pmark%>" app-p="unpass" app-t="plugin"><i class="fa fa-times"></i> 取消</a>
            <%};%>
            <a href="javascript:;" app-id="<%=object("id").value%>" class="app-remove AutoSendAjax" app-c="确定删除该链接？" app-m="<%=pmark%>" app-p="remove" app-t="plugin"><i class="fa fa-trash-o"></i> 删除</a>
        </div>
	</div>
</div>
<%	
		})
		.close();
})();
%>
</div>
<script>
$('.app-pass, .app-unpass').data('callback', function(){
	setTimeout(function(){
		window.location.reload();
	}, 1000);
});
$('.app-remove').data('callback', function(){
	$('#book').isotope('remove', $(this).parents('.items:first').get(0)).isotope('layout');
});
require('appjs/assets/jquery.lsotope', function(){
	$('#book')
	.isotope({ 
		itemSelector: '#book .items' 
	}); 
});
</script>