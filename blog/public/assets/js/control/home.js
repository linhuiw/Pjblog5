(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(
			[
				'jquery',
				'http://app.webkits.cn/private/version/static/pjblog5.list',
				'http://app.webkits.cn/private/caches/news/static/recently',
				'http://app.webkits.cn/private/caches/apps/static/theme.recently',
				'http://app.webkits.cn/private/caches/apps/static/plugin.recently'
			], 
		mod);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.home = mod(window.jQuery);
    }
})(function ( $, versions, news, themes, plugins ) {
	
	console.log(versions, news, themes, plugins)
    
	var home = new Class(function(){
		console.log('loaded');
	});
	
	return home;

});