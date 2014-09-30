<style>
#book{}
#book .items{ background-color:#fff; margin-bottom:20px; padding:10px 15px; border-radius:3px; box-shadow:1px 3px 5px #ccc; color:#777; width:420px; margin-right:20px;}
#book .items .img{ margin-top:8px;}
#book .items .img img{ width:88px; height:31px;}
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
/*简单的弹出层效果*/
.linkedit_back{display:none; position:absolute; top:0%; left:0%; width:100%; height:100%; background-color:black; z-index:99; opacity:.80; -moz-opacity:0.8; filter:alpha(opacity=80);}
.linkedit_form{width:400px; border:1px solid #ccc; border-radius: 3px; display:none; z-index:100; background-color:#FFF; line-height: 35px; padding: 10px;}
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
	<div class="img fleft"><img src="<%=object("link_icon").value%>" onerror="this.src='<%=blog.web + '/private/plugins/' + pfolder + '/default.png'%>'" app-img="<%=object("link_icon").value%>" /></div>
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
            <%if ( object("link_index").value ){%>
            <a href="javascript:;" app-id="<%=object("id").value%>" class="app-unindex AutoSendAjax" app-c="确定取消前台显示该链接？" app-m="<%=pmark%>" app-p="unindex" app-t="plugin"><i class="fa fa-link"></i> 单显</a>
            <%}else{%>
            <a href="javascript:;" app-id="<%=object("id").value%>" class="app-index AutoSendAjax" app-c="确定前台显示该链接？" app-m="<%=pmark%>" app-p="index" app-t="plugin"><i class="fa fa-link"></i> 双显</a>
            <%};%>
            <a href="javascript:;" app-id="<%=object("id").value%>" class="app-edit" app-c="确定编辑该链接？" app-m="<%=pmark%>" app-p="edit" app-t="plugin"><i class="fa fa-gear"></i> 编辑</a>
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
$('.app-pass, .app-unpass, .app-index, .app-unindex').data('callback', function(){
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

// 小影添加，增加编辑功能
$(document).ready(function(){
	// 创建弹出层
	;(function(){
		var backdiv = '<div class="linkedit_back"></div>';
		var editdiv = '';
		editdiv += '<div class="linkedit_form">\r\n';
		editdiv += '    <form action="public/async.asp?m=<%=pmark%>&p=edit&t=plugin" method="post" id="postform">\r\n';
		editdiv += '        <input type="hidden" name="link_id" id="link_id" />\r\n';
		editdiv += '        <table cellpadding="0" cellspacing="0" width="100%" border="0">\r\n';
		editdiv += '            <tr>\r\n';
		editdiv += '                <td align="center">网站名称</td>\r\n';
		editdiv += '                <td><input type="text" name="link_name" id="link_name" style="width:300px;" /></td>\r\n';
		editdiv += '            </tr>\r\n';
		editdiv += '            <tr>\r\n';
		editdiv += '                <td align="center">网站地址</td>\r\n';
		editdiv += '                <td><input type="text" name="link_src" id="link_src" style="width:300px;" /></td>\r\n';
		editdiv += '            </tr>\r\n';
		editdiv += '            <tr>\r\n';
		editdiv += '                <td align="center">网站图标</td>\r\n';
		editdiv += '                <td><input type="text" name="link_icon" id="link_icon" style="width:300px;" /></td>\r\n';
		editdiv += '            </tr>\r\n';
		editdiv += '            <tr>\r\n';
		editdiv += '                <td width="80" height="84" align="center" valign="top">网站描述</td>\r\n';
		editdiv += '                <td><textarea name="link_des" id="link_des" style="width:300px; height: 70px;"></textarea></td>\r\n';
		editdiv += '            </tr>\r\n';
		editdiv += '            <tr>\r\n';
		editdiv += '                <td height="45"></td>\r\n';
		editdiv += '                <td><input type="submit" value="修改" />　<input type="button" class="app-close" value="取消" /></td>\r\n';
		editdiv += '            </tr>\r\n';
		editdiv += '        </table>\r\n';
		editdiv += '    </form>\r\n';
		editdiv += '</div>';
		
		$('body').append(backdiv);
		$('body').append(editdiv);
	})();
	
	// 弹出编辑对话框
	$('.app-edit').on('click', function(){
		var parent = $(this).parents('.items:first');
		var image =  '<%=blog.web%>/private/plugins/<%=pfolder%>/default.png';
		var icon = parent.find('img:first').attr('app-img');
			icon = (icon == image)?'':icon;
		var name = parent.find('.nick:first').text();
		var site = parent.find('.time:first').text();
		var text = parent.find('.des:first').text();
		var link = $(this).attr('app-id');
		
		$('.linkedit_form #link_id').val(link);
		$('.linkedit_form #link_name').val(name);
		$('.linkedit_form #link_icon').val(icon);
		$('.linkedit_form #link_src').val(site);
		$('.linkedit_form #link_des').val(text);
		
		$('.linkedit_form').show();
		$('.linkedit_back').show();
		
		// 让弹出层居中显示
		var div = $('.linkedit_form');
		var top = ($(window).height() - div.outerHeight()) / 2;
        var left = ($(window).width() - div.outerWidth()) / 2;
        div.css({position:'absolute', margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
	});
	
	// 关闭编辑对话框
	$('.app-close').on('click', function(){
		$('.linkedit_form').hide();
		$('.linkedit_back').hide();
	});
});

require(['appjs/assets/blog.loading', 'appjs/assets/jquery.form.min'], function(tip){
	// 提交编辑功能
	$('#postform').ajaxForm({
		dataType: 'json',
		beforeSubmit: function(){
			$('.linkedit_form').hide();
			$('.linkedit_back').hide();
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
			tip.error('编辑链接出错');
		}
	});
});
</script>