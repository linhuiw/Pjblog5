// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			var that = this;
			$('#postform').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( window.doing ){ return; };
					window.doing = true;
					that.tip.loading();
				},
				success: function(params){
					window.doing = false;
					if ( params.success ){
						that.tip.success(params.message);
					}else{
						that.tip.error(params.message);
					}
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});