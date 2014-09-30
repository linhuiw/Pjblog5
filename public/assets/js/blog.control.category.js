// JavaScript Document
define([
	'appjs/assets/jquery.nestable', 
	'appjs/assets/jquery.form.min'
], function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.formatSort();
			this.onAddNewCategoryByRoot();
			this.onAddNewCategoryBySecondCategory();
			this.onMakeFace();
			this.onCategoryDelete();
			this.onModifyCategoryForm();
			this.SaveSort();
		},
		formatSort: function(){
			$(function(){
				setTimeout(function(){
					$('.dd').nestable({
						expandBtnHTML   : '<button data-action="expand" type="button"><i class="fa fa-angle-down"></i></button>',
						collapseBtnHTML : '<button data-action="collapse" type="button"><i class="fa fa-angle-up"></i></button>',
						maxDepth        : 2
					});
				}, 500);
			});
		},
		onAddNewCategoryByRoot: function(){
			var that = this;
			$('#addNewCategoryByRoot').on('click', function(){
				if ( !window.doing ){
					window.doing = true;
					
					if ( !confirm('确定添加？') ){
						setTimeout(function(){ window.doing = false; }, 10);
						return;
					}

					var data = {
						cate_icon: '1.gif',
						cate_name: '新建根分类',
						cate_des: '这里填写新分类的描述说明..',
						cate_parent: 0,
						cate_src: ''
					};
					
					that.tip.loading();
					$.post('public/async.asp?m=category&p=addor', data, function(params){
						window.doing = false;
						if ( params.success ){
							that.tip.success(params.message);
							if ( params.id && params.id > 0 ){
								data.id = params.id;
								$('#first').append( that.categoryTemplate(data) );
								$('#first').find('li:last').addClass('animated flash');
							}
						}else{
							that.tip.error(params.message);
						}
					}, 'json');
				};
			});
		},
		onAddNewCategoryBySecondCategory: function(){
			var that = this;
			$('body').on('click', '.app-add', function(){
				if ( !window.doing ){
					window.doing = true;
					
					if ( !confirm('确定添加？') ){
						setTimeout(function(){ window.doing = false; }, 10);
						return;
					}
					
					var _this = this,
						id = $(this).parents('li:first').attr('app-id');

					var data = {
						cate_icon: '1.gif',
						cate_name: '新建根分类',
						cate_des: '这里填写新分类的描述说明..',
						cate_parent: Number(id),
						cate_src: ''
					};
					
					that.tip.loading();
					$.post('public/async.asp?m=category&p=addor', data, function(params){
						window.doing = false;
						if ( params.success ){
							that.tip.success(params.message);
							if ( params.id && params.id > 0 ){
								data.id = params.id;
								var li = $(_this).parents('li:first'),
									ol = li.find('ol.dd-list');
									
								if ( ol.size() === 0 ){
									li.append('<ol class="dd-list"></ol>');
									ol = li.find('ol.dd-list');
								}
								ol.append( that.categoryTemplate(data, true) );
								ol.find('li:last').addClass('animated flash');
							}
						}else{
							that.tip.error(params.message);
						}
					}, 'json');
				};
			});
		},
		onMakeFace: function(){
			var that = this;
			$('body').on('click', '.app-icon', function(){
				if ( !window.doing ){
					window.doing = true;
					var _this = this,
						box = $('#icon-box'),
						z = $(this).attr('app-icon'),
						id = $(this).parents('li:first').attr('app-id');
						
						box.remove();
						$('#modifyform').remove();
						box = document.createElement('div');
						box.id = 'icon-box';
						$('body').append(box);	
						box = $(box);
						box.addClass('icon-box');
					
					box.html(that.iconsTemplate(z));
					box.css({position: 'absolute'});
					
					var box_width = box.outerWidth(),
						box_height = box.outerHeight(),
						target_top = $(this).offset().top,
						target_left = $(this).offset().left;
						
					box.css({
						top: (target_top + 36) + 'px',
						left: (target_left - box_width - 50) + 'px'
					});
					
					box.find('li').on('click', function(){
						var name = $(this).attr('app-icon-name');
						that.tip.loading();
						$.getJSON('public/async.asp', {
							m: 'category',
							p: 'SaveIcon',
							id: id,
							icon: name
						}, function(params){
							if ( params.success ){
								that.tip.success(params.message);
								$(_this).parents('li:first').find('.dd-handle:first img').attr('src', 'private/icons/' + name);
								box.remove();
							}else{
								that.tip.error(params.message);
							}
						});
					});
					
					setTimeout(function(){ window.doing = false; }, 10);
				}
			});
			
			$('body').on('click', function(event){
				if ( 
					$(event.target).hasClass('icon-box') || 
					$(event.target).parents('.icon-box').size() > 0 || 
					$(event.target).hasClass('app-icon') || 
					$(event.target).parent().hasClass('app-icon') 	
				){}else{ $('#icon-box').remove(); };
			})
		},
		onCategoryDelete: function(){
			var that = this;
			$('body').on('click', '.app-delete', function(){
				if ( !window.doing ){
					window.doing = true;
					var id = $(this).parents('li:first').attr('app-id');
					that.tip.loading();
					$.getJSON('public/async.asp', {
						m: 'category',
						p: 'remover',
						id: id
					}, function( params ){
						window.doing = false;
						if ( params.success ){
							that.tip.success(params.message);
							setTimeout(function(){ window.location.reload(); }, 1000);
						}else{
							that.tip.error(params.message);
						}
					});
				}
			});
		},
		onModifyCategoryForm: function(){
			var that = this;
			$('body').on('click', '.app-modify', function(){
				if ( !window.doing ){
					window.doing = true;
					var id = $(this).parents('li:first').attr('app-id'),
						_this = this;;
					that.tip.loading();
					$.getJSON('public/async.asp', {
						m: 'category',
						p: 'getMessage',
						id: id
					}, function( params ){
						window.doing = false;
						if ( params.success ){
							that.tip.success(params.message);
							that.MakeModifyForm(params.data, _this);
						}else{
							that.tip.error(params.message);
						}
					});
				}
			});
		},
		MakeModifyForm: function(data, element){
			$('#modifyform').remove();
			$('#icon-box').remove();
			var box = document.createElement('div'),
				that = this;
			box.id = 'modifyform';
			$('body').append(box);
			var h = '<form action="public/async.asp?m=category&p=modify" method="post"><input type="hidden" name="id" value="' + data.id + '" />';
				h	+=	'<table cellpadding="0" cellspacing="0" width="100%" border="0">';
				h 	+=	'<tr><td width="100">分类名</td><td><input type="text" name="cate_name" value="' + data.cate_name + '" class="col-x-3" /></td></tr>';
				h 	+=	'<tr><td width="100">外链</td><td><input type="text" name="cate_src" value="' + data.cate_src + '" class="col-x-3" /></td></tr>';
				h 	+=	'<tr><td width="100">分类描述</td><td><textarea name="cate_des" class="col-x-4" style="height:60px;">' + data.cate_des + '</textarea></td></tr>';
				h	+=	'<tr><td>&nbsp;</td><td><input type="submit" value="保存分类修改"  /><input type="button" value="关闭" class="close" /></td></tr>';
				h	+=	'</table>';
				h += '</form>';
			
			$('#modifyform').addClass('setform').html(h).css('position', 'absolute');
			var li = $(element).parents('li:first'),
				top = li.offset().top + 36,
				left = li.offset().left + 50,
				width = li.outerWidth() - 50;
				
			$('#modifyform').css({
				top: top + 'px',
				left: left + 'px',
				width: width + 'px',
				zIndex: 9999
			})
			.find('.close').on('click', function(){
				$('#modifyform').remove();
			});
			
			$('#modifyform').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( window.doing ){ return false; };
					window.doing = true;
					that.tip.loading();
				},
				success: function(params){
					window.doing = false;
					if ( params.success ){
						that.tip.success(params.message);
						$('#modifyform').find('.close').trigger('click');
						li.find('.cate_name:first').html(params.data.cate_name);
						li.find('.cate_des:first').html(params.data.cate_des);
						li.find('.outip:first').html(params.data.cate_src);
						if ( params.data.cate_outlink ){
							li.find('.cate_out:first').html('<i class="fa fa-check"></i>');
						}else{
							li.find('.cate_out:first').html('<i class="fa fa-times"></i>');
						}
					}else{
						that.tip.error(params.message);
					}
				}
			});
		},
		SaveSort: function(){
			var that = this;
			$('#savesort').on('click', function(){
				if ( !window.doing ){
					window.doing = true;
					var list = [];
					$('#first>li').each(function(){
						var id = $(this).attr('app-id'),
							d = [];
						$(this).find('ol li').each(function(){
							var _id = $(this).attr('app-id');
							d.push(Number(_id));
						});
						list.push({
							id: Number(id),
							childs: d
						});
					});
					that.tip.loading();
					$.post('public/async.asp?m=category&p=sort', {
						data: JSON.stringify(list)
					}, function(params){
						window.doing = false;
						if ( params.success ){
							that.tip.success(params.message);
						}else{
							that.tip.error(params.message);
						}
					}, 'json');
				}
			});
		},
		categoryTemplate: function( params, isSecond ){
			var h = '<li class="dd-item dd2-item" app-id="' + (params.id || 0) + '"><div class="dd-handle dd2-handle"><img src="private/icons/1.gif" /></div><div class="dd2-content"><div class="cate_tool">';
			if ( !isSecond ){
			h += '<a href="javascript:;" class="app-add"><i class="fa fa-plus"></i></a> ';
			};
			h += '<a href="javascript:;" app-icon="" class="app-icon"><i class="fa fa-image"></i></a> <a href="javascript:;" class="app-modify"><i class="fa fa-pencil-square-o"></i></a> <a href="javascript:;" class="app-delete"><i class="fa fa-trash-o"></i></a> </div><div class="cate_name">' + (params.cate_name || '新建根分类') + '</div><div class="cate_des wordCut">' + (params.cate_des || '这里填写新分类的描述说明..') + '</div><div class="cate_out"><i class="fa fa-times"></i></div><div class="outip"></div></div></li>';
			return h;
		},
		iconsTemplate: function(z){
			var h = '';
			for ( var i = 0 ; i < window.icons.length ; i++ ){
				if ( z === window.icons[i] ){
					h += '<li class="current" app-icon-name="' + window.icons[i] + '"><img src="private/icons/' + window.icons[i] + '" /></li>';
				}else{
					h += '<li app-icon-name="' + window.icons[i] + '"><img src="private/icons/' + window.icons[i] + '" /></li>';
				}
			}
			return '<ul class="clearfix">' + h + '</ul>';
		},
		tip: require('appjs/assets/blog.loading')
	});
});