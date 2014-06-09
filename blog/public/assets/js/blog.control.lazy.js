// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.onAutoAjax();
		},
		onAutoAjax: function(){
			var that = this;
			$('body').on('click', '.AutoSendAjax', function(){
				var m = $(this).attr('app-m'),
					p = $(this).attr('app-p'),
					t = $(this).attr('app-t'),
					c = $(this).attr('app-c'),
					id = $(this).attr('app-id'),
					r = {};
				
				var callback = $(this).data('callback');
					
				if ( m && m.length > 0 ){ r.m = m; };
				if ( p && p.length > 0 ){ r.p = p; };
				if ( t && t.length > 0 ){ r.t = t; };
				if ( id && id.length > 0 ){ r.id = id; };
				
				if ( window.doing ){ return; };
				window.doing = true;
				
				if ( c && c.length > 0 ){
					if ( window.confirm(c) ){ 
						that.onSendAjax(r, this, callback);
					}else{
						window.doing = false;
					}
				}else{
					that.onSendAjax(r, this, callback);
				}
			});
		},
		onSendAjax: function( r, _this, callback ){
			var that = this;
			this.tip.loading();
			$.getJSON('public/async.asp', r, function( params ){
				window.doing = false;
				if ( params.success ){
					that.tip.success(params.message);
					typeof callback === 'function' && callback.call(_this);
				}else{
					that.tip.error(params.message);
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});