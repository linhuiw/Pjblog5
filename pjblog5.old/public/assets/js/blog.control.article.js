// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			$('.deletearticle').data('callback', function(){
				$(this).parents('.art-detail:first').animate({
					opacity: 0
				}, 'slow', function(){
					$(this).remove();
				});
			});
		}
	});
});