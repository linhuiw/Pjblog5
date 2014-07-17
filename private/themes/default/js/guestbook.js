// JavaScript Document
define(['appjs/assets/jquery.form.min'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.ajaxPost();
		},
		ajaxPost: function(){
			var that = this;
			$('#postform').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( $("input[name='nick']").size() > 0 && $("input[name='nick']").val().length === 0 ){
						that.tip.error('请输入昵称');
						return;
					};
					if ( $("input[name='mail']").size() > 0 && $("input[name='mail']").val().length === 0 ){
						that.tip.error('请输入邮箱');
						return;
					};
					that.tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						console.log(params.msg);
						$('#postform').resetForm();
					}else{
						that.tip.error(params.message);
					}
				},
				error: function(){
					that.tip.error('链接出错');
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});