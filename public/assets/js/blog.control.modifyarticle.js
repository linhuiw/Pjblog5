// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.ue = UE.getEditor('editor');
			this.AddTags();
			this.setCategory();
			this.SaveArticle();
		},
		AddTags: function(){
			$('#addTags').on('click', function(){
				$('#artlist .art-wrap .art-zone .dc-tags .tags').append('<div class="tag-item"><input type="text" value="" class="tag-input" placeholder="新建标签" /><i class="fa fa-close"></i></div>');
			});
			$('body').on('click', '#artlist .art-wrap .art-zone .dc-tags .tags .tag-item i', function(){
				$(this).parents('.tag-item:first').animate({
					opacity: 0
				}, 'slow', function(){
					$(this).remove();
				});
			});
		},
		setCategory: function(){
			$('body').on('click', '.setCate', function(){
				$('.setCate').removeClass('active');
				$(this).addClass('active');
				$("input[name='art_category']").val($(this).attr('app-cate'));
			});
		},
		SaveArticle: function(){
			var that = this;
			$('#submit').on('click', function(event){
				var contents = that.ue.getContent(),
					tags = [];
						
				$("textarea[name='art_content']").val(contents);
				$('#artlist .art-wrap .art-zone .dc-tags .tags .tag-item input').each(function(){
					var val =  $(this).val().replace(/^\s+/, '').replace(/\s+$/, '');
					if ( val && val.length > 0 ){
						tags.push(val);
					}
				});
				$("input[name='art_tags']").val(tags.join(','));
				
				that.doSaveArticle();
			});
		},
		doSaveArticle: function(){
			var that = this;
			this.tip.loading('正在发送数据信息..');
			$('#postArticle').ajaxSubmit({
				dataType: 'json',
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){
							window.location.href = '?m=article';
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				},
				error: function(){
					that.tip.error('服务端程序错误');
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});