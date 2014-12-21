(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery'], mod);
    }
})(function ( $ ) {
	return new Class({
		initialize: function(){
			this.ajaxAction();
			this.ajaxSubmit();
			this.ajaxDialog();
			this.ajaxSelect();
		},
		ajaxAction: function(){				// Ajax删除操作
			$('.AutoSend').on('click', function(){
				var msg = '确定' + $(this).attr('title') + '?';
				if (!window.confirm(msg)) return;
				
				var id = $(this).attr('appid');
				var method = $(this).attr('method');
				
				$.post(
					iPress.setURL('async', 'PluginRequestJSON', { t: window.pid, m: method }),
					{ id: id },
					function( params ){
						if ( params.success ){
							window.alert(params.message);
							setTimeout(function(){
								window.location.reload();
							}, 1000);
						}else{
							window.alert(params.message);
						}
					},
					'json'
				);
			});
		},
		ajaxSubmit: function(){				// Ajax提交表单
			$('#linkform').ajaxForm({
				dataType: 'json',
				success: function( params ){
					if ( params.success ){
						window.alert(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						window.alert(params.message);
					}
				},
				error: function(){
					window.alert('服务器出错');
				}
			});
		},
		ajaxDialog: function(){				// 填充表单
			$('.EditForm').on('click', function(){
				$('#link-dialog-title').text('编辑友情链接');
				
				var parent = $(this).parents('.items:first');
				var icon = parent.find('img:first').attr('app-img');
				var name = parent.find('.name:first').text();
				var site = parent.find('.src:first').text();
				var text = parent.find('.des:first').text();
				var link = $(this).attr('appid');
				
				$('#linkform').attr('action', iPress.setURL('async', 'PluginRequestJSON', { t: window.pid, m: $(this).attr('method') }));
				$('#linkform #link_id').val(link);
				$('#linkform #link_name').val(name);
				$('#linkform #link_icon').val(icon);
				$('#linkform #link_src').val(site);
				$('#linkform #link_des').val(text);
			});
		},
		ajaxSelect: function(){				// 过滤友情链接
			var that = this;
			$('.filter').on('click', function(){
				var action = Number($(this).attr('action'));
				switch (action) {
					case 1:
						that.hideLinks('hide', 'true')
						break;
					case 2:
						that.hideLinks('hide', 'false')
						break;
					case 3:
						that.hideLinks('index', 'false')
						break;
					case 4:
						that.hideLinks('index', 'true')
						break;
					default:
						$('.blogLink').show();
				}
			});
		},
		hideLinks: function(att, value){	// 根据条件隐藏友情链接
			$('.blogLink').each(function(){
				if ($(this).attr(att).toLowerCase() == value) {
					$(this).hide()
				}else{
					$(this).show()
				}
			});
		}
	});
});