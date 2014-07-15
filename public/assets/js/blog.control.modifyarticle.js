// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.ue = UE.getEditor('editor');
			this.AddTags();
			this.installTags();
			this.setCategory();
			//this.UploadImage();
			this.SaveArticle();
		},
		AddTags: function(){
			$('#addTags').on('click', function(){
				if ( !window.doing ){
					window.doing = true;
					var tag = document.createElement('div');
					$('#articles .tool .pannel .tags').append(tag);
					$(tag).addClass('item').html('<span>新建标签</span><a href="javascript:;"><i class="fa fa-times"></i></a>');	
					
					$(tag).find('span').get(0).designMode = 'on';
					$(tag).find('span').get(0).contentEditable = true;
					
					$(tag).find('span').focus().select();
					
					$(tag).find('a').on('click', function(){
						$(tag).animate({
							opacity: 0
						}, 'slow', function(){
							$(this).remove();
						})
					});
					
					setTimeout(function(){window.doing = false;}, 10);
				}
			});
		},
		installTags: function(){
			$('#articles .tool .pannel .tags .item').each(function(){
				$(this).find('span').get(0).designMode = 'on';
				$(this).find('span').get(0).contentEditable = true;
			});
		},
		setCategory: function(){
			$('body').on('click', '.setCate', function(){
				$('.setCate').removeClass('current');
				$(this).addClass('current');
				$("input[name='art_category']").val($(this).attr('app-cate'));
			});
		},
/*		UploadImage: function(){
			var that = this;
			$('#upload').on('click', function(){
				if ( !window.doing ){
					window.doing = true;
					var center = that.tip.center(that.UploadImageHTML());
					$(center).find('.close').on('click', function(){
						that.tip.close();
					});
					$(center).find('form').ajaxForm({
						dataType: 'json',
						iframe: true,
						beforeSubmit: function(){
							if ( window.doing ){
								return false;
							}
							window.doing = true;
							that.tip.loading('正在上传图片二进制流数据，请稍后...');
						},
						success: function( params ){
							window.doing = false;
							if ( params.success ){
								that.tip.success('上传图片成功..');
								var path = ('private' + params.params.path.split('private')[1]).replace(/\\/g, '/');
								$('#cover').attr('src', path);
								$("input[name='art_cover']").val(path);
							}else{
								that.tip.error('上传图片失败..');
							}
						}
					});
					setTimeout(function(){window.doing = false;}, 10);
				}
			});
		},
		UploadImageHTML: function(){
			return 	'<div class="uploadimage">' +
						'<form action="public/ControlUpload.asp" method="post" enctype="multipart/form-data">'+
							'<div class="file"><input type="file" name="file" value="" /></div>'+
							'<div class="submit"><input type="submit" value="上传" /> <input type="button" value="关闭" class="close" /></div>'+
						'</form>'+
					'</div>';
		},*/
		SaveArticle: function(){
			var that = this;
			$('#submit').on('click', function(){
				var contents = that.ue.getContent(),
						tags = [];
						
				$("textarea[name='art_content']").val(contents);
				$('#articles .tool .pannel .tags .item').each(function(){ tags.push($(this).find('span').html()); });
				$("input[name='art_tags']").val(tags.join(','));
				/*
				 * !获取图片信息
				 * 2014-7-15
				 */
				var img = $(contents).find('img:first');
				if ( img.size() === 1 ){
					$("input[name='art_cover']").val(img.attr('src'));
				};
				
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