// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.onScroll();
		},
		onScroll: function(){
			$(window).on('scroll', function(){
				var s = $(this).scrollTop();
				if ( s > 0 && s <= 200 ){
					$('#sooptions').css('top', (250 - s) + 'px');
				}
				else if ( s >= 200 ){
					$('#sooptions').css('top', '50px');
				}else{
					$('#sooptions').css('top', '250px');
				}
			});
		}
	});
});