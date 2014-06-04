// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			var that = this;
			this.tip.loading();
			setTimeout(function(){
				that.tip.success('生成数据成功，暂时无法关闭数据库');
			}, 3000);
		},
		tip: require('appjs/assets/blog.loading')
	});
});