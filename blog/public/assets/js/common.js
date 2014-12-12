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
		$('.ajax-form').each(function(){
			var _this = this;
			$(this).submit(function(){
				$(this).ajaxSubmit({
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
							$(_this).trigger('form.ajaxSuccess');
							alert('操作成功');
						}else{
							$(_this).trigger('form.ajaxFailure');
							alert(msg.message);
						}
					},
					error: function(){
						$(_this).trigger('form.ajaxError');
						window.doing = false;
						alert('服务端出错');
					}
				});
				return false;
			});
		});	
	});
	
	return common;

});
