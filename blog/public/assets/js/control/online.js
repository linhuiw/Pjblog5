(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery', 'http://app.webkits.cn/private/version/static/pjblog5.js'], mod);
    }
    else {
        window.blog.online = mod(window.jQuery);
    }
})(function ( $, list ) {
	
	var threads = 10;
	
	var online = new Class(function(){
		this.getList();
		this.onBind();
		this.onwifi();
	});
	
	online.add('getList', function(){
		var o = 0;
		for ( var i in list ){
			o++;
			$('#list').append('<tr><td><input type="checkbox" value="' + list[i] + '" name="' + i + '" /></td><td>' + o + '</td><td><code>' + list[i] + '</code></td><td><i class="fa fa-file-code-o" style="margin-right: 5px;"></i>' + i + '</td><td><i class="fa fa-ban"></i></td></tr>');
		}
	});
	
	online.add('onBind', function(){
		$('#selectall').on('ifChanged', function(){
			if ( this.checked ){
				$("#list input[type='checkbox']").iCheck('check');
			}else{
				$("#list input[type='checkbox']").iCheck('uncheck');
			}
		})
	});
	
	online.add('onwifi', function(){
		$('#check').on('click', function(){
			var checkeds = $("#list input[type='checkbox']:checked");
			var size = checkeds.size();
			if ( size < 1 ){
				alert('请先选择需要对比的文件');
				return;
			};
			
			var groups = getGroup(checkeds);
			
			$.ajax({
				url: iPress.setURL('async', 'online', { m: 'wifi' }),
				dataType: 'json',
				type: 'post',
				success: function(){
					
				}
			})
		});
	});
	
	function getGroup(groups){
		var group = []
		groups.each(function(el, i){
			if ( (i + 1) % threads === 1 ){
				
			}
		});
	}
	
	function getAjaxCheckStatus(file, value){
			
	}
	
	return online;
});