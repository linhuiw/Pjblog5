(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery', 'jquery-plugin-sortable'], mod);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.category = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var category = new Class(function(){
		this.installon();
		this.installtrigger();
	});
	
	category.add('installon', function(){
		var that = this;
		this.getTemplate();
		this.addRootCategory();
		this.addCategory();
		this.onIconEvent();
		$('#refresh').on('click', function(event, callback){
			var _this = this;
			$(this).addClass('fa-spin');
			that.getAjaxData(function(){
				$(_this).removeClass('fa-spin');
				this.pinkHTML();
				this.sortable();
				typeof callback === 'function' && callback.call(that);
			});
		});
	});
	
	category.add('installtrigger', function(){
		$('#refresh').trigger('click');
	});
	
	category.add('getTemplate', function(){
		var template = {};
		template.root = $('#category-template-root').html();
		template.child = $('#category-template-child').html();
		this.template = template;
	});

	category.add('pinkHTML', function(){
		var indexs = this.ajaxData.indexs;
		var queens = this.ajaxData.queens;
		
		var html = [], that = this;
		//simple_with_no_drop
		queens.forEach(function(data){
			var id = data.id;
			var items = data.items;
			var list = indexs[id + ''];
			var template = that.template.root + '';
			list.childrens = '';
			list.nodrop = '';
			list.count = items ? items.length : 0;
			
			if ( list.cate_outlink ){
				list.nodrop = 'simple_with_no_drop';
			}

			if ( items && items.length > 0 ){
				var _html = [];
				items.forEach(function(_data){
					var _template = that.template.child + '';
					var _list = indexs[_data + ''];

					_html.push(that.replaceHTMLByData(_template, _list));
				});
				list.childrens = _html.join('');
			}
			
			html.push(that.replaceHTMLByData(template, list));
		});
		
		$('#category-list').html(html.join(''));
		
		this.onEvent();
	});
	
	category.add('onEvent', function(){
		$('#category-list > li').each(function(){
			var out = $(this).attr('data-out');
			if ( out == 'true' ){
				$(this).find('.category:first .action .addCategory').remove();
			}
		});
		$('.changeIcon').popover({	
			content: function(){
				var icon = $(this).attr('data-icon');
				var div = document.createElement('div');
				$(div).addClass('poptarget').css({
					width: '200px',
					height: '160px'
				}).html('<div style="width:100px; height:70px; text-align:center; margin:0 auto;"><span class="fa ' + icon + '" style="line-height: 70px; font-size:40px;"></span></div><div><input class="form-control" value="' + icon + '" style="text-align:center" /></div><div style="margin-top:10px;" class="row"><div class="col-xs-6"><button class="btn btn-danger pop-close" style="width:100%;"><i class="fa fa-power-off"></i> 关闭</button></div><div class="col-xs-6"><button class="btn btn-success pop-save" style="width:100%;"><i class="fa fa-save"></i> 保存</button></div></div></div>');
				div.target = this;
				return div;
			},
			html: true,
			placement: 'left',
			title: '修改小图标'
		});
	});
	
	category.add('onIconEvent', function(){
		var that = this;
		$('body').on('click', '.poptarget .pop-close', function(){
			var parent = $(this).parents('.poptarget:first');
			if ( parent.size() > 0 ){
				$(parent.get(0).target).trigger('click');
			}
		});
		$('body').on('click', '.poptarget .pop-save', function(){
			var parent = $(this).parents('.poptarget:first'),
				value;
			if ( parent.size() > 0 ){
				value = parent.find('input.form-control').val();
				parent = parent.get(0).target;
			}else{
				parent = null;
			}
			
			if ( parent ){
				var id = $(parent).attr('data-id');
				that.SaveIcon(id, value, parent);
			}
		});
		$('body').on('keyup', '.poptarget input.form-control', function(){
			var value = $(this).val();
			$(this).parent().prev().find('span').attr('class', 'fa ' + value);
		});
	});
	
	category.add('replaceHTMLByData', function(html, data){
		for ( var i in data ){
			var r = new RegExp('{' + i.replace('\_', '\\_') + '}', 'ig');
				html = html.replace(r, data[i]);
		}
		return html;
	});
	
	category.add('sortable', function(){
		var oldContainer, that = this;
		var group = $("ol.nested_with_switch").sortable("destroy").sortable({
		  group: 'nested',
		  handle: '.handlemove',
		  afterMove: function (placeholder, container) {
		    if(oldContainer != container){
		      if(oldContainer)
		        oldContainer.el.removeClass("active")
		      container.el.addClass("active")
		      
		      oldContainer = container
		    }
		  },
		  onDrop: function (item, container, _super) {
		    container.el.removeClass("active");
		    _super(item);
		    
		    var source = Number($(item).attr('data-id'));
		  	var target = $(container.el).attr('data-id');
		  	var tp = target && target.length > 0 ? Number(target) : 0;
		  	
		  	var data = group.sortable("serialize").get()[0];
    		var jsonString = JSON.stringify(data, null, ' ');

		  	that.setParent(source, tp, jsonString, function(){
		  		
		  	});
		  },
		  isValidTarget: function(item, container){
		  	if ( window.doing ){ return false; };
		  	//console.log(item[0], container.el[0]);
		  	var source = Number($(item).attr('data-count') || '0');
		  	var target = $(container.el).attr('data-parent');
		  	var tp = target && target.length > 0 ? Number(target) : -1;

		  	if ( source > 0 && tp === 0 ){
		  		return false;
		  	}
		  	return true;
		  }
		});
		$("ol.simple_with_no_drop").sortable({
		  group: 'no-drop',
		  drop: false
		})
		$("ol.simple_with_no_drag").sortable({
		  group: 'no-drop',
		  drag: false
		})
	});

	category.add('getAjaxData', function(callback){
		var that = this;
		var doing = window.doing;
		if ( !doing ){
			window.doing = true;
		}
		$.getJSON(window.modules.category.url + '=' + new Date().getTime(), function(params){
			if ( params.success ){
				that.ajaxData = params.data;
				typeof callback === 'function' && callback.call(that);
			}else{
				that.ajaxData = null;
				alert(params.message);
			};
			if ( !doing ){
				window.doing = false;
			};
		});
	});

	category.add('setParent', function(id, parent, orders, callback){
		window.doing = true;
		$.post(window.modules.category.setParent + '=' + new Date().getTime(), {
			id: id,
			parent: parent,
			orders: orders
		}, function(params){
			if ( params.success ){
				if ( typeof callback === 'function' ){
					callback();
				}
				$('#refresh').trigger('click', function(){
					window.doing = false;
				});
			}else{
				alert(params.message);
			}
		}, 'json');
	});
	
	category.add('addRootCategory', function(){
		$('body').on('click', '#addroot', function(){
			window.doing = true;
			$.post(window.modules.category.addRootCategory + '=' + new Date().getTime(), {
				pid: 0
			}, function(params){
				if ( params.success ){
					$('#refresh').trigger('click', function(){
						window.doing = false;
					});
				}else{
					alert(params.message);
				}
			}, 'json');
		});
	});
	
	category.add('addCategory', function(){
		$('body').on('click', '.addCategory', function(){
			var id = $(this).attr('data-id');
			window.doing = true;
			$.post(window.modules.category.addRootCategory + '=' + new Date().getTime(), {
				pid: id
			}, function(params){
				if ( params.success ){
					$('#refresh').trigger('click', function(){
						window.doing = false;
					});
				}else{
					alert(params.message);
				}
			}, 'json');
		});
	});
	
	category.add('SaveIcon', function(id, value, parent){
		window.doing = true;
		$.post(window.modules.category.saveIcon + '=' + new Date().getTime(), {
			id: id,
			icon: value
		}, function(params){
			if ( params.success ){
				$(parent).trigger('click');
				$('#refresh').trigger('click', function(){
					window.doing = false;
				});
			}else{
				alert(params.message);
			}
		}, 'json');
	});

	
	return category;

});