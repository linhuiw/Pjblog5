// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			var that = this;
			$('#loginform').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( $("input[name='UserName']").val().length < 4 ){
						that.tip.error('登录名不能少于4位');
						return false;
					};
					if ( $("input[name='PassWord']").val().length < 6 ){
						that.tip.error('密码不能少于6位');
						return false;
					};
					that.tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){ window.location.reload(); }, 1000);
					}else{
						that.tip.error(params.message);
					}
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});