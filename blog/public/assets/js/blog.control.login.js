// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.tip.loading();
		},
		tip: require('appjs/assets/blog.loading')
	});
});