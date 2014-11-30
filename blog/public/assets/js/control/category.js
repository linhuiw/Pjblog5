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
	});
	
	category.add('replaceHTMLByData', function(html, data){
		for ( var i in data ){
			var r = new RegExp('{' + i.replace('\_', '\\_') + '}', 'ig');
				html = html.replace(r, data[i]);
		}
		return html;
	});
	
	category.add('setParent', function(id, parent, callback){
		window.doing = true;
		$.post(window.modules.category.setParent + '=' + new Date().getTime(), {
			id: id,
			parent: parent
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
	
	category.add('sortable', function(){
		var oldContainer, that = this;
		$("ol.nested_with_switch").sortable("destroy").sortable({
		  group: 'nested',
		  handle: 'i.fa-arrows-alt',
		  afterMove: function (placeholder, container) {
		    if(oldContainer != container){
		      if(oldContainer)
		        oldContainer.el.removeClass("active")
		      container.el.addClass("active")
		      
		      oldContainer = container
		    }
		  },
		  onDrop: function (item, container, _super) {
		    
		    var source = Number($(item).attr('data-id'));
		  	var target = $(container.el).attr('data-id');
		  	var tp = target && target.length > 0 ? Number(target) : 0;

		  	that.setParent(source, tp, function(){
		  		container.el.removeClass("active");
		    	_super(item);
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

	
	return category;

});