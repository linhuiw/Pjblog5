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
        window.blog.control.home = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var category = new Class(function(){
		this.sortable();
	});
	
	category.add('compileTemplate', function( params ){
		var template;
		if ( !this.template || this.template.length === 0 ){}else{
			this.template = $('#category-template').html();
		};
		template = this.template;
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