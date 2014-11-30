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
		$('#refresh').on('click', function(){
			var _this = this;
			$(this).addClass('fa-spin');
			that.getAjaxData(function(){
				$(_this).removeClass('fa-spin');
				this.pinkHTML();
			});
		});
	});
	
	category.add('installtrigger', function(){
		$('#refresh').trigger('click');
	});
	
	category.add('getAjaxData', function(callback){
		var that = this;
		$.getJSON(window.modules.category.url, function(params){
			if ( params.success ){
				that.ajaxData = params.data;
				typeof callback === 'function' && callback.call(that);
			}else{
				that.ajaxData = null;
				alert(params.message);
			}
		});
	});
	
	category.add('getTemplate', function(){
		var template = {};
		template.root = $('#category-template-root').html();
		template.child = $('#category-template-child').html();
		this.template = template;
	});
	
	category.add('compileTemplateByRoot', function( params ){
		
	});
	
	category.add('compileTemplateByChild', function( params ){
		
	});
	
	category.add('pinkHTML', function(){
		var indexs = this.ajaxData.indexs;
		var queens = this.ajaxData.queens;
		
		var html = [], that = this;
		
		queens.forEach(function(data){
			var id = data.id;
			var items = data.items;
			var list = indexs[id + ''];
			var template = that.template.root;
			
			if ( items && items.length > 0 ){
				var _html = [];
				items.forEach(function(_data){
					var _template = that.template.child;
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
		
	});
	
	category.add('sortable', function(){
		var oldContainer
		$("ol.nested_with_switch").sortable({
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
		    container.el.removeClass("active")
		    _super(item)
		  }
		});
	});
	
	return category;

});