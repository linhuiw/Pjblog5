define(['appjs/assets/jquery.form.min', 'appjs/assets/cookie'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.inputCookie();
			this.ajaxPost();
			this.ajaxReply();
			this.ajaxRemove();
		},
		date: require('appjs/assets/date'),
		inputCookie: function(){
			if ( $('#postform').find("input[name='nick']").size() > 0 ) {
				$('#postform').find("input[name='nick']").val($.cookie('comments_usernick'));
			}
			if ( $('#postform').find("input[name='mail']").size() > 0 ) {
				$('#postform').find("input[name='mail']").val($.cookie('comments_usermail'));
			}
			if ( $('#postform').find("input[name='site']").size() > 0 ) {
				$('#postform').find("input[name='site']").val($.cookie('comments_usersite'));
			}
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
					}else{
						$.cookie('comments_usernick', $(dom).find("input[name='nick']").val(), {expires:180}); 
					};
					if ( $(dom).find("input[name='mail']").size() > 0 && $(dom).find("input[name='mail']").val().length === 0 ){
						that.tip.error('请输入邮箱');
						return false;
					}else{
						var mail = $(dom).find("input[name='mail']").val();
						$.cookie('comments_usermail', mail, {expires:180}); 
					};
					if ( $(dom).find("input[name='site']").size() > 0 && $(dom).find("input[name='site']").val().length === 0 ){
						// 允许网址为空
					}else{
						$.cookie('comments_usersite', $(dom).find("input[name='site']").val(), {expires:180}); 
					};
					if ($(dom).find("textarea[name='content']").val().length === 0 ){
						that.tip.error(window.dis + '内容不能为空');
						return false;
					};
					that.tip.loading();
				},
				success: function( params ){
					params.message = params.message.replace('{0}', window.dis);
					if ( params.success ){
						var infomation = (!params.data.pass) ? '请等待审核您的' + window.dis : params.message;
						that.tip.success(infomation);
						//$(dom).resetForm();
						$(dom).find("textarea[name='content']").val('');
						that.makePostItem(params.data, $('#avatar img').attr('src'));
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
			$('body').on('click', '.app-reply', function(){
				var cid = $(this).attr('app-cid'),
					rid = $(this).attr('app-rid'),
					id = $(this).attr('app-id');
					
				var nick = $.cookie('comments_usernick'),
					mail = $.cookie('comments_usermail'),
					site = $.cookie('comments_usersite');
				
				nick = (!nick) ? '' : nick;
				mail = (!mail) ? '' : mail;
				site = (!site) ? '' : site;
				
				var h = '';
				h += '<div class="replybox">';
				h +=	'<h4>发表您的' + window.dis + '</h4>';
				h += 	'<form action="public/sync.asp?m=' + window.mark + '&p=reply&t=plugin" method="post" id="postreplybox">';
				h += 		'<input type="hidden" name="id" value="' + id + '" />';
        		h += 		'<input type="hidden" name="root" value="' + rid + '" />';
				h += 		'<input type="hidden" name="parent" value="' + cid + '" />';
				h +=		'<table cellpadding="0" cellspacing="0" width="100%" border="0">';
				if ( !window.login ){
				h +=			'<tr>';
				h +=				'<td align="right">昵称</td>';
				h +=				'<td><input type="text" name="nick" value="' + nick + '" style="width:90%;" /></td>'
				h +=			'</tr>';
				h +=			'<tr>';
				h +=				'<td align="right">邮箱</td>';
				h +=				'<td><input type="text" name="mail" value="' + mail + '" style="width:90%;" /></td>';
				h +=			'</tr>';
				h +=			'<tr>';
				h +=				'<td align="right">网址</td>';
				h +=				'<td><input type="text" name="site" value="' + site + '" style="width:90%;" /></td>';
				h +=			'</tr>';
				}else{
				h +=			'<tr>';
				h +=				'<td></td><td><i class="fa fa-exclamation-triangle"></i> ' + window.nick + '，您已登录，可以直接发表' + window.dis + '！</td>';
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
			$('body').on('click', '.app-remove', function(){
				if ( !confirm('确定删除这条' + window.dis + '？') ){
					return;
				}
				var cid = $(this).attr('app-cid');
				that.tip.loading('正在删除这条' + window.dis + '，请稍后！');
				$.getJSON('public/sync.asp', {
					m: window.mark,
					p: 'remove',
					t: 'plugin',
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
		makePostItem: function(data, src){	
			// 这段代码写得比较乱，自己看着优化一下吧~
			var floor = $('.floor:first').text();
				floor = Number(floor) + 1;
			var Grade = 0;
			if (data.cid != data.rid) {
				Grade = $('#comment_' + data.com_parent).attr('Grade');
				Grade = Number(Grade) + 1;
			}
			var PadLeft = Grade * 20;
						
			var h = '';
			/*评论成功之后直接在页面上显示*/
			h += 	'<div class="root-comment" id="comment_' + data.cid + '" style="padding-left:' + PadLeft + 'px;" Grade="' + Grade + '">';
        	h += 	  '<div class="comment-box">';
            h += 		'<div class="comment-box-user">';
            h += 	        '<div class="comment-box-user-avatar clearfix">';
 			h += 			  '<img src="' + src + '">';
            h += 	          	'<div class="tools">';
            h += 	                '<a href="javascript:;" app-cid="' + data.cid + '" app-rid="' + data.rid + '" app-id="' + data.id + '" class="app-reply"><i class="fa fa-comment"></i></a>\n';
            h += 	                '<a href="javascript:;" app-cid="' + data.cid + '" class="app-remove"><i class="fa fa-trash-o"></i></a>';
            h += 	            '</div>';
            h += 	        '</div>';
            h += 	    '</div>';
			h += 		'<div class="comment-box-info">';
			h += 			'<div class="nick">';
			h += 				'<a href="http://" target="_blank">' + ($('#nick').size() > 0 ? $('#nick').text() : data.com_username) + '</a>';
			if (data.cid === data.rid) {
				// 一级评论显示楼层
			h += 				'<span class="floor fright">' + floor + '</span>';
			}
			h += 			'</div>';
			h += 			'<div class="time">' + this.date.format(data.com_postdate, 'y-m-d h:i:s') + '</div>';
			h += 			'<div class="des">' + data.com_content + '</div>';
			h += 		'</div>';
            h += 	  '</div>';
         	h += 	'</div>';

			if (data.cid == data.rid) {
				// 一级评论的显示
				$('.comment-list h5').after(h);
			}else{
				// 二级评论的显示
				$('#comment_' + data.com_parent).after(h);
			}
		},
		tip: require('appjs/assets/blog.loading')
	});
});