// JavaScript Document
define('../scroller/js/jquery.slideBox.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.lazy();
			this.onScroll();
			$(window).trigger('scroll');
			this.pice();
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
		},
		pice: function(){
			$('.slideBox').slideBox({
				duration : 0.3,//滚动持续时间，单位：秒
				easing : 'linear',//swing,linear//滚动特效
				delay : 5,//滚动延迟时间，单位：秒
				hideClickBar : false,//不自动隐藏点选按键
				clickBarRadius : 10
			});
		},
		lazy: function(){
			$("img.lazy").lazyload({
				effect : "fadeIn"
			});
		}
	});
});