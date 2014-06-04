// JavaScript Document
(function( $ ){
	
	$.loading = function(){
		var element = $('#loading');
		
		if ( element.size() === 0 ){
			element = document.createElement('div');
			element.id = 'loading';
			$('body').append(element);
			element = $(element);
		}
		
		
	}
	
})( jQuery );