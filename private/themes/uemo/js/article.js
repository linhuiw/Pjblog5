// JavaScript Document
define(['appjs/assets/jquery.form.min'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.HightLight();
			this.RelativeArticles();
			this.resizeImgs();
			this.ajaxPost();
			this.ajaxRemove();
			this.ajaxReply();
		},
		date: require('appjs/assets/date'),
		HightLight: function(){
			SyntaxHighlighter.highlight();
			//调整左右对齐
			try{
			for(var i=0,di;di=SyntaxHighlighter.highlightContainers[i++];){
				var tds = di.getElementsByTagName('td');
				for(var j=0,li,ri;li=tds[0].childNodes[j];j++){
					ri = tds[1].firstChild.childNodes[j];
					ri.style.height = li.style.height = ri.offsetHeight + 'px';
				}
			}
			}catch(e){}
		},
		RelativeArticles: function(page){
			var that = this;
			if ( !page ){ page = 1; };
			if ( window.tag ){
				$('#tag-list').html('<p><i class="fa fa-refresh fa-spin"></i> 正在查询相关日志，请稍后..</p>');
				$.post('public/sync.asp?m=' + window.tag.mark + '&p=getValue&t=plugin&id=' + window.tag.id + '&page=' + page, { tags: window.tag.tags.join(',') }, function(object){
					if ( object.success ){
						if ( object.data.length > 0 ){
							$('#tag-list').empty().append('<p class="total"><i class="fa fa-bug"></i> 共有相关日志 ' + object.data.length + ' 篇</p>');
							for ( var i = 0 ; i < object.data.length ; i++ ){
								$('#tag-list').append('<a href="' + object.data[i].href + '" target="_blank"><i class="fa fa-angle-right"></i><span>[ ' + that.date.format(new Date(object.data[i].time), 'y/m-d h:i') + ' ]</span>' + object.data[i].title + '</a>');
							}
							var html_page = '';
							if ( object.pages && object.pages.to > 1 ){
								for ( i = object.pages.from ; i <= object.pages.to ; i++ ){
									if ( i === object.pages.current ){
										html_page += '<span>' + i + '</span>';
									}else{
										html_page += '<a href="javascript:;" class="RelativeArticlesAchor" page="' + i + '">' + i + '</a>';
									}
								}
								$('.tag-page').html(html_page).find('a.RelativeArticlesAchor').on('click', function(){
									that.RelativeArticles(Number($(this).attr('page')));
								});
							}else{
								$('.tag-page').empty();
							}
						}
					}
				}, 'json');
			}
		},
		resizeImgs: function(){
			$('.art-detail img').each(function(){
				if ( !($(this).parent().size() > 0 && $(this).parent().get(0).tagName.toLowerCase() === 'a') ){
					var href = $(this).attr('src');
					$(this).wrap('<a href="' + href + '" target="_blank"></a>');
				}
			});
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
					$('#message').show().html('亲，请稍后！正在发送您的评论！');
				},
				success: function( params ){
					window.doing = false;
					if ( params.success ){
						$('#message').html('亲，评论成功了!');
						$(dom).resetForm();
						if ( dom === '#postform' ){
							that.makePostItem(params.data, $('.form .avatar img').attr('src'), $('#aid').val());
						}else{
							that.makeReplyItem(params.data, $('.form .avatar img').attr('src'), $('#aid').val());
						}
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
		makePostItem: function(data, src, id){
			var h = '';
			h += 	'<div class="root-comment comm" id="comment_' + data.cid + '">';
			h += 		'<div class="comment-box clearfix">';
			h += 			'<div class="comment-box-user">';
			h += 				'<div class="comment-box-user-avatar">';
			h += 					'<img src="' + src.replace('s=36', 's=64') + '" />';
			h += 					'<div class="tools">';
			h += 					'<a href="javascript:;" app-cid="' + data.cid + '" app-id="' + id + '" class="app-reply"><i class="fa fa-comment"></i></a>';
			h += 					'<a href="javascript:;" app-cid="' + data.cid + '" class="app-remove"><i class="fa fa-trash-o"></i></a>';
			h += 					'</div>';
			h += 				'</div>';
			h += 			'</div>';
			h += 			'<div class="comment-box-info">';
			h += 				'<div class="nick">' + ($('#nick').size() > 0 ? $('#nick').text() : data.com_username) + '</div>';
			h += 				'<div class="time">' + data.com_postdate + '</div>';
			h += 				'<div class="des">' + data.com_content + '</div>';
			h += 			'</div>';
			h += 		'</div>';
			h += 	'</div>';
			$('#comments').prepend(h);
		},
		makeReplyItem: function(data, src, id){
			var h = '';
			h += 	'<div class="child-comment comm" id="comment_' + data.cid + '">';
			h += 		'<div class="comment-box clearfix">';
			h += 			'<div class="comment-box-user">';
			h += 				'<div class="comment-box-user-avatar">';
			h += 					'<img src="' + src.replace('s=36', 's=64') + '" />';
			h += 					'<div class="tools">';
			h += 					'<a href="javascript:;" app-cid="' + data.cid + '" class="app-remove"><i class="fa fa-trash-o"></i></a>';
			h += 					'</div>';
			h += 				'</div>';
			h += 			'</div>';
			h += 			'<div class="comment-box-info">';
			h += 				'<div class="nick">' + ($('#nick').size() > 0 ? $('#nick').text() : data.com_username) + '</div>';
			h += 				'<div class="time">' + data.com_postdate + '</div>';
			h += 				'<div class="des">' + data.com_content + '</div>';
			h += 			'</div>';
			h += 		'</div>';
			h += 	'</div>';
			$('#replybox').replaceWith(h);
		},
		ajaxRemove: function(){
			var that = this;
			$('body').on('click', '.app-remove', function(){
				if ( window.doing ){
					return;
				};
				window.doing = true;
				if ( !confirm("确定删除这条评论？") ){
					return;
				}
				var cid = $(this).attr('app-cid');
				var comm = $(this).parents('.comm:first').size() > 0 ? $(this).parents('.comm:first') : $(this).parents('.child-comment:first');
				var info = comm.find('.comment-box-info');
				var html = info.html();
				var _this = this;
				comm.html('正在删除数据，请稍后！');
				$.getJSON('public/sync.asp', {
					m: 'comment',
					p: 'remove',
					id: cid
				}, function(params){
					window.doing = false;
					if ( params.success ){
						comm.remove();
					}else{
						info.html(params.message);
						setTimeout(function(){
							info.html(html);
						}, 2000);
					}
				});
			});
		},
		ajaxReply: function(){
			var that = this;
			$('body').on('click', '.app-reply', function(){
				$('#replybox').remove();
				var cid = $(this).attr('app-cid'),
					id = $(this).attr('app-id'),
					src = $('.form .avatar img').attr('src');
					
				var h = '';
				h += '<div class="replybox" id="replybox">';
				h += 	'<form action="public/sync.asp?m=comment&p=reply" method="post" id="postreplybox">';
				h += 		'<input type="hidden" name="id" value="' + id + '" />';
        		h += 		'<input type="hidden" name="root" value="' + cid + '" />';
				h +=		'<div class="replyboxs clearfix">';
				h +=			'<div class="avatar fleft">';
				h +=				'<img src="' + src.replace('s=36', 's=64') + '" />'	;
				h +=				'<a href="javascript:;" class="fa fa-times close"></a>';
				h +=			'</div>';
				h +=			'<div class="info">';
				if ( !window.login ){
				h +=				'<p><input type="text" name="nick" value="" style="width:300px;" class="text" placeholder="亲，您还没有填写您的昵称呢！" /></p>';
                h +=				'<p><input type="text" name="mail" value="" style="width:300px;" class="text" placeholder="亲，有邮箱么？填一下吧！" /></p>';
				}
				h +=				'<div class="textarea">';
            	h +=					'<textarea class="inputnone" name="content" placeholder="这里填写回复内容"></textarea>';
                h +=					'<input type="submit" value="马上回复" class="submit" />';
                h +=				'</div>';
				h +=			'</div>';
				h +=		'</div>';
				h +=	'</form>';
				h += '</div>';
				$(this).parents('.comm:first').after(h);
				$('#replybox').find('.close').on('click', function(){
					$('#replybox').remove();
				});
				that.ajaxPost('#postreplybox');
			});
		}
	});
});