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
		this.onDownload();
	});
	
	online.add('getList', function(){
		var o = 0;
		for ( var i in list ){
			o++;
			$('#list').append('<tr><td><input type="checkbox" value="' + list[i] + '" name="' + i + '" /></td><td>' + o + '</td><td><code>' + list[i] + '</code></td><td><i class="fa fa-file-code-o" style="margin-right: 5px;"></i>' + i + '</td><td class="static"><i class="fa fa-ban"></i></td></tr>');
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

			var PromiseCallback = function(data, resolve, reject){
				var that = this;
				$(that).parents('tr:first').find('td.static').html('<i class="fa fa-spin fa-spinner"></i>');
				$.ajax({
					url: iPress.setURL('async', 'online', { m: 'wifi' }),
					data: data,
					dataType: 'json',
					type: 'post',
					success: function(msg){
						if ( msg.success ){
							$(that).parents('tr:first').find('td.static').html('<i class="fa fa-search"></i>');
							$(that).iCheck('check');
							$('#list').prepend($(that).parents('tr:first'));
						}else{
							$(that).parents('tr:first').find('td.static').empty();
							$(that).iCheck('uncheck');
						}
						resolve();
					},
					error: function(){
						reject();
					}
				});
			};
			
			var AllSuccess = function(){
				alert('所有文件都已检测完毕');
			}
			
			getAmd(groups, PromiseCallback, AllSuccess);
		});
	});
	
	online.add('onDownload', function(){
		$('#download').on('click', function(){
			var checkeds = $("#list input[type='checkbox']:checked");
			var size = checkeds.size();
			if ( size < 1 ){
				alert('请先选择需要升级修复的文件');
				return;
			};
			
			var groups = getGroup(checkeds);
			var PromiseCallback = function(data, resolve, reject){
				var that = this;
				$(that).parents('tr:first').find('td.static').html('<i class="fa fa-spin fa-spinner"></i>');
				$.ajax({
					url: iPress.setURL('async', 'online', { m: 'download' }),
					data: data,
					dataType: 'json',
					type: 'post',
					success: function(msg){
						if ( msg.success ){
							$(that).parents('tr:first').find('td.static').html('<i class="fa fa-check"></i>');
							$(that).iCheck('uncheck');
						}else{
							$(that).parents('tr:first').find('td.static').html('<i class="fa fa-close"></i>');
							$(that).iCheck('check');
						}
						resolve();
					},
					error: function(){
						reject();
					}
				});
			};
			
			var AllSuccess = function(){
				alert('文件更新修复完毕');
			}
			
			getAmd(groups, PromiseCallback, AllSuccess);
		});
	});
	
	function getGroup(groups){
		var a = [], b = [];
		groups.each(function(i, el){
			var c = $(this).attr('name');
			var d = $(this).val();
			var e = null;
			
			if ( (i + 1) % threads === 0 ){
				b.push({ name: c, value: d, that: this });
				a.push(b);
				b = [];
			}
			else{
				b.push({ name: c, value: d, that: this });
			}
			
			if ( i + 1 === groups.length && b.length > 0 ){ a.push(b); }
		});

		return a;
	}
	
	function getAmd(groups, callback, success, i){
		if ( !i ) i = 0;
		if ( groups[i] ){
			var a = [];
			
			for ( var o = 0 ; o < groups[i].length ; o++ ){
				a.push(new Promise(function(resolve, reject){
					var that = groups[i][o].that;
					delete groups[i][o].that;
					callback.call(that, groups[i][o], resolve, reject); 
				}));
			}

			Promise.all(a).then(function(){
				getAmd(groups, callback, success, i + 1);
			});
		}else{
			success();
		}
	}
	
	function getAjaxCheckStatus(file, value){
			
	}
	
	return online;
});