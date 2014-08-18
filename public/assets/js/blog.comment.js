define(['appjs/assets/jquery.form.min'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.ajaxRemove();
		},
		ajaxRemove: function(){
			var that = this;
			$('.app-remove').on('click', function(){
				if ( !confirm("确定删除这条评论？") ){
					return;
				}
				var cid = $(this).attr('app-cid');
				that.tip.loading('正在删除这条评论，请稍后！');
				$.getJSON('public/async.asp', {
					m: 'comment',
					p: 'remove',
					id: cid
				}, function(params){
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});