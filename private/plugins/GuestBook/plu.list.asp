<style>
#book{}
#book .items{ background-color:#fff; margin-bottom:20px; padding:10px 15px; border-radius:3px; box-shadow:1px 3px 5px #ccc; color:#777;}
#book .items .img{ margin-top:8px;}
#book .items .img img{ width:36px; height:36px; border-radius:3px;}
#book .items .infos{ margin-left:50px;}
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
	var rec = new dbo.RecordSet(conn),
		keep = [],
		ids = [],
		uids = {},
		md5 = require("md5"),
		date = require("date");
		
	var page = http.query("page");
	if ( !page || page.length === 0 ){
		page = "1";
	};
	page = Number(page);
	if ( page < 1 ){
		page = 1;
	};
		
	var ac = rec.DualTopPage(
		"blog_messages", 
		"*", 
		false, 
		"msg_postdate DESC", 
		"msg_postdate ASC", 
		10, 
		page, 
		function( object ){
			keep.push({
				id: object("id").value,
				msg_member_id: object("msg_member_id").value,
				msg_content: object("msg_content").value,
				msg_postdate: date.format(new Date(object("msg_postdate").value), "y-m-d h:i:s"),
				msg_reply: object("msg_reply").value,
				msg_username: object("msg_username").value || "",
				msg_usermail: object("msg_usermail").value || ""
			});
			ids.push(object("msg_member_id").value);
		});
		
		if ( ids.length > 0 ){
			rec = new dbo.RecordSet(conn);
			rec
				.sql("Select * From blog_members Where id in (" + ids.join(",") + ")")
				.open(1)
				.each(function(object){
					uids[object("id") + ""] = {
						nick: object("member_nick").value,
						avatar: object("member_avatar").value
					}
				})
				.close();
		}
			
		for ( var i = 0 ; i < keep.length ; i++ ){
			var nick, avatar;
			if ( keep[i].msg_member_id > 0 ){
				nick = uids[keep[i].msg_member_id + ""].nick;
				avatar = uids[keep[i].msg_member_id + ""].avatar;
			}else{
				nick = keep[i].msg_username;
				avatar = blog.AppPlatForm + "/avatars/" + md5.make(keep[i].msg_usermail) + ".jpg";
			}
%>
<div class="items">
	<div class="img fleft"><img src="<%=avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" /></div>
	<div class="infos">
		<div class="nick"><%=nick%></div>
		<div class="time"><%=keep[i].msg_postdate%></div>
		<div class="des"><%=keep[i].msg_content%></div>
		<%
			if ( keep[i].msg_reply.length > 0 ){
		%>
		<div class="reply">
        	<div class="replybox">
			<h4>博主回复：</h4>
			<div class="repc"><%=keep[i].msg_reply%></div>
            </div>
		</div>
		<%	
			}else{
		%>
        <div class="reply"></div>
        <%	
			};
		%>
        <div class="tools">
        	<a href="javascript:;" app-id="<%=keep[i].id%>" class="app-reply"><i class="fa fa-repeat"></i> 回复</a>
            <a href="javascript:;" app-id="<%=keep[i].id%>" class="app-remove"><i class="fa fa-trash-o"></i> 删除</a>
        </div>
	</div>
</div>
<%		
		}
		var pages = rec.BuildPage(ac.pageindex, ac.pageCount);

		if ( pages.to > 1 ){
%>
        <div class="pages clearfix">
            <%
                for ( var i = pages.from ; i <= pages.to ; i++ ){
                    if ( i === pages.current ){
            %>
            <span><%=i%></span>
            <%			
                    }else{
            %>
            <a href="?m=<%=m%>&t=<%=t%>&page=<%=i%>"><%=i%></a>
            <%			
                    };		
                };
            %>
        </div>
<%
		}
})();
%>
</div>
<script>
	require(['appjs/assets/blog.loading', 'appjs/assets/jquery.form.min'], function(tip){
		$(".app-reply").on("click", function(){
			var p = $(this).parents('.items:first').find('.reply');
			var id = $(this).attr("app-id");
			var html = p.html();
			if ( !id || id.length === 0 ){
				tip.error('参数错误');
				return;
			};
			p.html('<div class="replybox"><form action="public/async.asp?m=A5A465WA1T545ET35DAS8WWWE6FTYJT46&p=reply&t=plugin" method="post"><input type="hidden" name="id" value="' + id + '" /><p><textarea name="reply"></textarea></p><p><input type="submit" value="保存"> <input type="button" value="关闭" class="close" /></p></form></div>');
			p.find('form').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					var t = p.find('form textarea').val();
					if ( t.length === 0 ){
						tip.error('回复内容不能为空');
						return false;
					};
					tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						tip.success(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						tip.error(params.message);
					}
				},
				error: function(){
					tip.error('服务器连接出错');
				}
			});
			p.find('form .close').on('click', function(){
				p.html(html);
			});
		});
		
		$('.app-remove').on('click', function(){
			var that = this;
			if ( !confirm('确定删除？') ){
				return;
			};
			var id = $(this).attr("app-id");
			if ( !id || id.length === 0 ){
				tip.error('参数错误');
				return;
			};
			tip.loading();
			$.getJSON('public/async.asp', {
				m: 'A5A465WA1T545ET35DAS8WWWE6FTYJT46',
				p: 'remove',
				t: 'plugin',
				id: id
			}, function( params ){
				if ( params.success ){
					tip.success(params.message);
					$(that).parents('.items:first').animate({
						opacity: 0
					}, 'slow', function(){
						$(this).remove();
					});
				}else{
					tip.error(params.message);
				}
			});
		});
	});
</script>