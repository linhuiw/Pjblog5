// JavaScript Document
define([
	'public/assets/js/sortable/jquery.sortable.js', 
	'public/assets/js/nestable/jquery.nestable.js',
	'public/assets/js/nestable/nestable.css',
	'appjs/assets/jquery.form.min'
], function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.formatSort();
			this.onAddNewCategoryByRoot();
			this.onAddNewCategoryBySecondCategory();
			this.onMakeFace('.app-icon');
			this.onCategoryDelete();
			this.onModifyCategoryForm();
			this.SaveSort();
		},
		formatSort: function(){
			$('#nestable2').show().nestable({
					expandBtnHTML	: '',
					collapseBtnHTML	: '',
					maxDepth        : 2,
					handleClass		: 'dd-item-content'
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
		onMakeFace: function(element){
			var that = this;
			$(element).popover({
				html: true,
				title: '<button type="button" class="close pull-right" data-dismiss="popover">×</button>选择图标',
				placement: 'top',
				content: function(element){
					var icon = $(this).attr('app-icon');
					var hand = $(this).parents('.dd-handle:first');
					var _this = this;
					
					hand.off('click');
					hand.on('click', '.scrollable li', function(){
						var id = hand.parents('li:first').attr('data-id'),
							name = $(this).attr('app-icon-name');
						var ts = $(this).parents('.popover:first').find('.close');
							
						that.tip.loading();
						$.getJSON('public/async.asp', {
							m: 'category',
							p: 'SaveIcon',
							id: id,
							icon: name
						}, function(params){
							if ( params.success ){
								that.tip.close();
								hand.find('.pull-left img').attr('src', 'private/icons/' + name);
								ts.trigger('click');
								$(_this).attr('app-icon', name);
							}else{
								that.tip.error(params.message);
							}
						});
					});
					
					return "<div class='scrollable'>" + that.iconsTemplate(icon) + "</div>";
				}
			});
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
				var id = $(this).parents('li:first').attr('data-id'),
					_this = this;
				that.tip.loading();
				$.getJSON('public/async.asp', {
					m: 'category',
					p: 'getMessage',
					id: id
				}, function( params ){
					if ( params.success ){
						that.tip.close();
						that.MakeModifyForm(params.data, _this);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		MakeModifyForm: function(data, element){
			$('.modal').remove();
			var h = '', that = this;
			h +=	'<div class="modal-dialog modal fade">'
			h +=	  			'<form action="public/async.asp?m=category&p=modify" method="post"><input type="hidden" name="id" value="' + data.id + '" />';
			h +=		'<div class="modal-content">';
			h +=			'<div class="modal-header">';
			h +=	  			'<button type="button" class="close" data-dismiss="modal">&times;</button>';
			h +=	  			'<h4 class="modal-title">Modal title</h4>';
			h +=			'</div>';
			h +=			'<div class="modal-body">';
			
			h +=					'<table cellpadding="0" cellspacing="0" width="100%" border="0">';
			h +=						'<tr><td width="100">分类名</td><td><input type="text" name="cate_name" value="' + data.cate_name + '" class="form-control" /></td></tr>';
			h +=						'<tr><td width="100">外链</td><td><input type="text" name="cate_src" value="' + data.cate_src + '" class="form-control" /></td></tr>';
			h +=						'<tr><td width="100">分类描述</td><td><textarea name="cate_des" class="form-control" style="height:60px;">' + data.cate_des + '</textarea></td></tr>';
			h +=					'</table>';
			
			h +=			'</div>';
			h +=			'<div class="modal-footer">';
			h +=	  			'<a href="javascript:;" class="btn btn-default dcode" data-dismiss="modal">取消修改</a>';
			h +=	  			'<input type="submit" value="保存修改" class="btn btn-primary dosave" />';
			h +=			'</div>';
			h +=  		'</div>';
			h +=				'</form>';
			h +=	'</div>';
			$('body').append(h);
			$('.modal form').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					that.tip.loading();
				},
				success: function(params){
					if ( params.success ){
						var li = $(element).parents('li:first');
						li.find('.dd-item-content:first').html(params.data.cate_name);

						if ( params.data.cate_outlink ){
							li.find('.doadd:first').hide();
							var lis = li.find('ol li');
							lis.find('.bg-primary').removeClass('bg-primary').addClass('bg-info');
							li.after(lis);
							li.find('ol').remove();
						}else{
							li.find('.doadd:first').show();
						}
						that.tip.close();
						$('.modal').find('.dcode').trigger('click');
					}else{
						that.tip.error(params.message);
					}
				}
			});
			$('.modal').modal('show');
		},
		SaveSort: function(){
			var that = this;
			$('#savesort').on('click', function(){
				var list = [];
				$('ol.sortable>li').each(function(){
					var id = $(this).attr('data-id'),
						d = [];
					$(this).find('ol li').each(function(){
						var _id = $(this).attr('data-id');
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
					if ( params.success ){
						window.location.reload();
					}else{
						that.tip.error(params.message);
					}
				}, 'json');
			});
		},
		categoryTemplate: function( params, isSecond ){
/*			var h = '';
			h +=	'<li class="dd-item" data-id="<%=category[i].id%>">';
			h +=		'<div class="dd-handle bg-info">';
			h +=			'<span class="pull-right">'; 
			h +=				'<a href="#" data-toggle="tooltip" data-placement="top" data-original-title="在这个分类下新增子分类"><i class="fa fa-plus fa-fw m-r-xs"></i></a>'; 
			h +=				'<a href="#" data-toggle="tooltip" data-placement="top" data-original-title="修改这个分类的图标"><i class="fa fa-picture-o fa-fw m-r-xs"></i></a>';
			h +=				'<a href="#" data-toggle="tooltip" data-placement="top" data-original-title="编辑这个分类"><i class="fa fa-pencil fa-fw m-r-xs"></i></a>';
			h +=				'<a href="#" data-toggle="tooltip" data-placement="top" data-original-title="删除这个分类"><i class="fa fa-times fa-fw"></i></a>'; 
			h +=			'</span>'; 
			h +=			'<span class="pull-left media-xs"><i class="fa fa-sort text-muted fa m-r-sm"></i> <img src="private/icons/<%=category[i].cate_icon%>"></span>';
			h +=			'<div class="dd-item-content"><%=category[i].cate_name%></div>';
			h +=		'</div>';
			h +=	'</li>';*/
			
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