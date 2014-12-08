(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery', 'jquery.form.min'], mod);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.common = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var common = new Class(function(){
		this.ajaxForm();
	});
	
	common.add('ajaxForm', function(){
		$('.ajax-form').ajaxForm({
			dataType: 'json',
			beforeSubmit: function(){
				if ( window.doing ){
					return false;
				}else{
					window.doing = true;
				}
			},
			success: function(msg){
				window.doing = false;
				if ( msg.success ){
    				console.log(this);
    				$(this).trigger('form.ajaxSuccess');
					alert('操作成功');
				}else{
					alert(msg.message);
				}
			},
			error: function(){
				window.doing = false;
				alert('服务端出错');
			}
		});
	});
	
	return common;

});
