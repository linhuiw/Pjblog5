// JavaScript Document
define('appjs/assets/jquery.lsotope', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.waterFull();
			this.onSearch();
			
			$("a[app-p='ChangeStatus']").data('callback', function(params){
				var t = params.status ? '已被禁止登陆本站' : '正常，可登陆。';
				$(this).parents('.item:first').find('.status').html('<i class="fa fa-dot-circle-o"></i>' + t);
			});
			
			$("a[app-p='RemoveUser']").data('callback', function(params){
				$('.waterfull').isotope('remove', $(this).parents('.item:first').get(0)).isotope('layout');
			});
		},
		waterFull: function(){ 
			$('.waterfull')
			.isotope({ 
				itemSelector: '.waterfull .item' 
			}); 
		},
		onSearch: function(){
			$('#search').on('click', function(){
				var val = $('#keyword').val();
				if ( val.length > 0 ){
					window.location.href = blog.web + '/control.asp?m=user&n=' + val;
				}
			});
			$('#keyword').on('keyup', function(event){
				if ( event.keyCode === 13 ){
					$('#search').trigger('click');
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});