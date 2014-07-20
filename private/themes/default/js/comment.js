define(['appjs/assets/jquery.form.min'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.ajaxPost();
			this.ajaxReply();
			this.ajaxRemove();
		},
		ajaxPost: function(dom){
			if ( !dom ){dom = '#postform'};
			var that = this;
			$(dom).ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( $(dom).find("input[name='nick']").size() > 0 && $(dom).find("input[name='nick']").val().length === 0 ){
						that.tip.error('请输入昵称');
						return false;
					};
					if ( $(dom).find("input[name='mail']").size() > 0 && $(dom).find("input[name='mail']").val().length === 0 ){
						that.tip.error('请输入邮箱');
						return false;
					};
					that.tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						$(dom).resetForm();
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				},
				error: function(){
					that.tip.error('链接出错');
				}
			});
		},
		ajaxReply: function(){
			var that = this;
			$('.app-reply').on('click', function(){
				var cid = $(this).attr('app-cid'),
					id = $(this).attr('app-id');
					
				var h = '';
				h += '<div class="replybox">';
				h +=	'<h4>发表您的回复</h4>';
				h += 	'<form action="public/sync.asp?m=comment&p=reply" method="post" id="postreplybox">';
				h += 		'<input type="hidden" name="id" value="' + id + '" />';
        		h += 		'<input type="hidden" name="root" value="' + cid + '" />';
				h +=		'<table cellpadding="0" cellspacing="0" width="100%" border="0">';
				if ( !window.login ){
				h +=			'<tr>';
				h +=				'<td align="right">昵称</td>';
				h +=				'<td><input type="text" name="nick" value="" style="width:90%;" /></td>'
				h +=			'</tr>';
				h +=			'<tr>';
				h +=				'<td align="right">邮箱</td>';
				h +=				'<td><input type="text" name="mail" value="" style="width:90%;" /></td>';
				h +=			'</tr>';
				}else{
				h +=			'<tr>';
				h +=				'<td></td><td><i class="fa fa-exclamation-triangle"></i> ' + window.nick + '，您已登录，可以直接发表留言！</td>';
				h +=			'</tr>'	;
				};
				h +=			'<tr>'
            	h +=				'<td width="80px;" align="right">评论内容</td>'
                h +=				'<td><textarea name="content"></textarea></td>'
            	h +=			'</tr>'
            	h +=			'<tr>'
            	h +=				'<td></td>'
                h +=				'<td><input type="submit" value="提交" /> <input type="button" class="close" value="取消" /></td>'
           		h +=			'</tr>'
				h +=		'</table>';
				h +=	'</form>';
				h += '</div>';
				var x = that.tip.center(h);
				$(x).find('.close').on('click', function(){
					that.tip.close();
				});
				that.ajaxPost('#postreplybox');
			});
		},
		ajaxRemove: function(){
			var that = this;
			$('.app-remove').on('click', function(){
				if ( !confirm("确定删除这条评论？") ){
					return;
				}
				var cid = $(this).attr('app-cid');
				that.tip.loading('正在删除这条评论，请稍后！');
				$.getJSON('public/sync.asp', {
					m: 'comment',
					p: 'remove',
					id: cid
				}, function(params){
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});