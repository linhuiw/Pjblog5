(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery'], mod);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.article = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var article = new Class(function(){
		this.onDelete();
	});
	
	article.add('onDelete', function(){
		$('.delete-article').on('click', function(){
			if ( !confirm('确定删除？') ){
				return;
			};
			
			var id = $(this).attr('data-id');
			var _this = this;
			
			$.post(window.modules.article.del, {
				id: id
			}, function(params){
				if ( params.success ){
					$(_this).parents('.col-md-4:first').remove();
				}else{
					alert(params.message);
				}
			}, 'json');
		});
	});
	
	return article;

});