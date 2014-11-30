// JavaScript Document
define(['jquery-plugin-lsotope'], function(require, exports, module){
	$('.ad-pannels').isotope({ itemSelector: '.pannel' }); 
	$('.ad-pannels .pannel img').each(function(){
		this.onload = function(){
			$('.ad-pannels').isotope('layout');
		}
	});	
})