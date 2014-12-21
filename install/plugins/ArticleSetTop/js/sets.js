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
			this.ajaxInput();
			this.ajaxModify();
			this.ajaxRemove();
		},
		ajaxInput: function(){
			$('.act-modify').on('click', function(){
				var id = $(this).attr('appid');
				var action = $(this).attr('action');
				var title = $(this).parent('td').prev('td').find('.art_title').html();
				$('#artid').text(id);
				$('#title').val(title);
				$('#SaveTitle').attr('appid', id);
				$('#SaveTitle').attr('action', action);
			});
		},
		ajaxModify: function(){
			var that = this;
			$('#SaveTitle').on('click', function(){
				var id = $(this).attr('appid');
				var title = $('#title').val();
				var action = $(this).attr('action');
				if (!action) {
					window.alert('请先选择要编辑的对象');
					return;
				}
				if (!title) {
					window.alert('请填入标题内容');
					return;
				}
				$.post(window.async.modify,
					{
						id: id,
						title: title,
						action: action
					},
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
		ajaxRemove: function(){
			var that = this;
			$('.act-cancel').on('click', function(){
				var id = $(this).attr('appid');
				var action = $(this).attr('action');
				$.post(window.async.remove,
					{
						id: id,
						action: action
					},
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
		}
	});
});