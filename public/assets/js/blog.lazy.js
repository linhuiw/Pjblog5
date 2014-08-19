// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function( user ){
			this.onAutoAjax();
			this.onLogout();
			this.ajaxNotice( user.token, user.appid, user.openid );
			
//			if ( Library.isIE ){
//				this.tip.loading('您正在使用IE浏览器，本系统对部分IE浏览器不兼容，请使用CFROME或者火狐浏览器浏览！为了保证用户体验，请谅解！');
//			}
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
						setTimeout(function(){
							window.doing = false;
						}, 500);
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
					typeof callback === 'function' && callback.call(_this, params);
				}else{
					that.tip.error(params.message);
				}
			});
		},
		onLogout: function(){
			var that = this;
			$('.logout').on('click', function(){
				that.tip.loading();
				$.getJSON('public/async.asp',{ m: 'user', p: 'logout' }, function( params ){
					if ( params.success ){
						window.location.reload();
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		ajaxNotice: function(token, appid, openid){
			var that = this;
			$.ajax({
				type : "get",
				async: false,
				url : blog.AppPlatForm + '/oauth/get_notice.asp?access_token=' + token + '&oauth_consumer_key=' + appid + '&openid=' + openid + '&format=jsonp',
				dataType : "jsonp",
				jsonp: "callback",
				jsonpCallback:"callback",
				success : function(json){
					//that.htmlAjaxNotice(json);
				},
				error:function(){
					alert('云端获取信息失败');
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});