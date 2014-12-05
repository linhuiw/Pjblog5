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
	});
	
	return plugin;

});