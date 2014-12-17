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
    
	var home = new Class(function(){
		console.log('loaded');
	});
	
	home.add('version', function(){
    	if ( versions.length > 0 ){
        	var activeVersions = [];
        	for ( var version in versions ){
            	if ( Number(version) > blog.version ){
                	versions[version].id = Number(version);
                	activeVersions.push(versions[version]);
            	}
        	}
        	if ( activeVersions.length > 0 ){
            	activeVersions = activeVersions.sort(function(a, b){
                	return a.id - b.id;
            	});
            	
        	}else{
            	$('#versions').html('<span style="padding: 5px; line-height:20px;">您已是最新版本V' + blog.version + '。无须升级。</span>');
        	}
    	}
	});
	
	return home;

});