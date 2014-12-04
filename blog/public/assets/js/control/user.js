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
        window.blog.control.user = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var user = new Class(function(){
		this.onGroup();
		this.onStatus();
	});
	
	user.add('onGroup', function(){
		$('.post-group').on('click', function(){
			var uid = $(this).attr('data-id'),
				gid = $(this).attr('data-gid');
			
			var name = $(this).text();
			var _this = this;
				
			$.post(window.modules.user.group, {
				uid: uid,
				gid: gid
			}, function( params ){
				if ( params.success ){
					$(_this).parents('ul:first').prev().find('span.name').text(name);
				}else{
					alert(params.message);
				}
			}, 'json');
		});
	});
	
	user.add('onStatus', function(){
		$('.post-status').on('click', function(){
			var uid = $(this).attr('data-id');
			var _this = this;
				
			$.post(window.modules.user.status, {
				uid: uid
			}, function( params ){
				if ( params.success ){
					$(_this).prev().text(params.word);
				}else{
					alert(params.message);
				}
			}, 'json');
		});
	});
	
	return user;

});