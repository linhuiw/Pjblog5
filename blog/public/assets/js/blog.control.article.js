// JavaScript Document
define([
	'appjs/assets/jquery.lsotope'
], function( require, exports, module ){
	return new Class({
		initialize: function(){
			var that = this;
			setTimeout(function(){
				that.waterFull();
			}, 100);
		},
		waterFull: function(){ $('.waterfull').isotope({ itemSelector: '.waterfull li' }); }
	});
});