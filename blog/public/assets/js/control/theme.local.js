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
		window.blog.control.theme = {};
        window.blog.control.theme.local = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var theme = new Class(function(){
		this.SendAjax('.install', window.modules.theme.install, function(){
			return confirm('确定安装？');
		});
		this.SendAjax('.remove', window.modules.theme.remove, function(){
			return confirm('确定删除？');
		});
	});
	
	theme.add('SendAjax', function(selector, url, callback){
		$('body').on('click', selector, function(){
    		if ( typeof callback === 'function' ){
        		if ( callback.call(this) === false ){
            		return false;
        		}
    		}
        	var id = $(this).attr('data-id');
        	if ( id && id.length > 0 ){
            	$.post(url, {
                	id: id
            	}, function( params ){
                	if ( params.success ){
                    	window.location.reload();
                	}else{
                    	alert(params.message);
                	}
            	}, 'json');
        	}
    	});
	});
	
	return theme;

});