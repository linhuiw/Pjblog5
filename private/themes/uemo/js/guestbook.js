// JavaScript Document
define(['appjs/assets/jquery.form.min'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.ajaxPost();
		},
		ajaxPost: function(dom){
			if ( !dom ){dom = '#postform'};
			var that = this;
			$(dom).ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( window.doing ){
						return false;
					};
					window.doing = true;
					if ( $(dom).find("input[name='nick']").size() > 0 && $(dom).find("input[name='nick']").val().length === 0 ){
						$('#message').html('请输入昵称');
						window.doing = false;
						return false;
					};
					if ( $(dom).find("input[name='mail']").size() > 0 && $(dom).find("input[name='mail']").val().length === 0 ){
						$('#message').html('请输入邮箱');
						window.doing = false;
						return false;
					};
					$('#message').show().html('亲，请稍后！正在发送您的留言！');
				},
				success: function( params ){
					window.doing = false;
					if ( params.success ){
						$('#message').html('亲，留言成功了!');
						$(dom).resetForm();
						that.makePostItem(params.msg, $('.form .avatar img').attr('src'));
						setTimeout(function(){
							$('#message').html('').hide();
						}, 1000);
					}else{
						$('#message').html(params.message);
					}
				},
				error: function(){
					window.doing = false;
					$('#message').html('服务器系统内部错误');
				}
			});
		},
		makePostItem: function(data, src){
			var h = '';
			h += 	'<div class="root-comment comm">';
			h += 		'<div class="comment-box clearfix">';
			h += 			'<div class="comment-box-user">';
			h += 				'<div class="comment-box-user-avatar">';
			h += 					'<img src="' + src.replace('s=36', 's=64') + '" />';
			h += 				'</div>';
			h += 			'</div>';
			h += 			'<div class="comment-box-info">';
			h += 				'<div class="nick">' + ($('#nick').size() > 0 ? $('#nick').text() : data.msg_username) + '</div>';
			h += 				'<div class="time">' + data.msg_postdate + '</div>';
			h += 				'<div class="des">' + data.msg_content + '</div>';
			h += 			'</div>';
			h += 		'</div>';
			h += 	'</div>';
			$('#comments').prepend(h);
		}
	});
});