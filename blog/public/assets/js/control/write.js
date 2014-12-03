(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery', '../../ueditor/ueditor.package.js'], mod);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.write = mod(window.jQuery);
    }
})(function ( $, ue, require, exports, modules ) {
	var Write = new Class(function(){
		// 设置ueditor变量基址
		window.UEDITOR_CONFIG.UEDITOR_HOME_URL = modules.contrast('../../ueditor') + '/';
		window.UEDITOR_CONFIG.serverUrl = window.UEDITOR_CONFIG.UEDITOR_HOME_URL + "asp/controller.asp";
		
		this.bindUeditor();
	});
	
	Write.add('bindUeditor', function(){
		this.ue = UE.getEditor('editor');
	});
	
	return Write;

});