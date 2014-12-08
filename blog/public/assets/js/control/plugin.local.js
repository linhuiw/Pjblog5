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
		this.onInstall();
		this.onUnInstall();
	});
	
	plugin.add('onInstall', function(){
    	$('.plus_install').on('click', function(){
        	var folder = $(this).attr('data-id');
        	if ( folder && folder.length > 0 ){
            	$.post(window.modules.plugin.install, {
                	folder: folder
            	}, function( params ){
                	if ( params.success ){
                    	window.location.reload();
                	}else{
                    	alert(params.message);
                	}
            	}, 'post');
        	}
    	});
	});
	
	plugin.add('onUnInstall', function(){
    	$('.plus_unisntall').on('click', function(){
        	var id = $(this).attr('data-id');
        	if ( id && id.length > 0 ){
            	$.post(window.modules.plugin.uninstall, {
                	id: id
            	}, function( params ){
                	if ( params.success ){
                    	window.location.reload();
                	}else{
                    	alert(params.message);
                	}
            	}, 'post');
        	}
    	});
	});
	
	return plugin;

});