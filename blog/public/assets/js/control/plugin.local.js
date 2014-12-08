(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery', '../../datatable/datatable.package'], mod, true);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.plugin = {};
		window.blog.control.plugin.local = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var plugin = new Class(function(){
		$('.dataTables-example').dataTable();
		this.SendAjax('.plus_install', window.modules.plugin.install);
		this.SendAjax('.plus_unisntall', window.modules.plugin.uninstall);
		this.SendAjax('.plus_change', window.modules.plugin.change);
	});
	
	plugin.add('SendAjax', function(selector, url){
		$('body').on('click', selector, function(){
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
	
	return plugin;

});