// JavaScript Document
define('appjs/assets/jquery.nestable', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.formatSort();
		},
		formatSort: function(){
			$(function(){
				setTimeout(function(){
					$('.dd').nestable({
						expandBtnHTML   : '<button data-action="expand" type="button"><i class="fa fa-angle-down"></i></button>',
						collapseBtnHTML : '<button data-action="collapse" type="button"><i class="fa fa-angle-up"></i></button>',
						group           : 0,
						maxDepth        : 2
					});
				}, 500);
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});