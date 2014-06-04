// JavaScript Document
define([
	'appjs/assets/jquery.lsotope'
],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.waterFull();
		},
		
		// 瀑布流设计
		waterFull: function(){ 
			$('.waterfull')
			.isotope({ 
				itemSelector: '.waterfull li' 
			}); 
		}
	});
});