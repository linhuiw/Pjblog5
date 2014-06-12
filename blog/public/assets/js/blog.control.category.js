// JavaScript Document
define('appjs/assets/jquery.nestable', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.formatSort();
			this.onAddNewCategoryByRoot();
			this.onAddNewCategoryBySecondCategory();
			this.onMakeFace();
			this.onCategoryDelete();
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
								ol.append( that.categoryTemplate(data) );
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
		categoryTemplate: function( params ){
			return '<li class="dd-item dd2-item" app-id="' + (params.id || 0) + '"><div class="dd-handle dd2-handle"><img src="private/icons/1.gif" /></div><div class="dd2-content"><div class="cate_tool"><a href="javascript:;" class="app-add"><i class="fa fa-plus"></i></a> <a href="javascript:;" app-icon="" class="app-icon"><i class="fa fa-image"></i></a> <a href="javascript:;"><i class="fa fa-pencil-square-o"></i></a> <a href="javascript:;" class="app-delete"><i class="fa fa-trash-o"></i></a> </div><div class="cate_name">' + (params.cate_name || '新建根分类') + '</div><div class="cate_des wordCut">' + (params.cate_des || '这里填写新分类的描述说明..') + '</div><div class="cate_out"><i class="fa fa-times"></i></div><div class="outip"></div></div></li>';
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