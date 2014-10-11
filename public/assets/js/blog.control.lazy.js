// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			if ( Library.isIE ){
				this.tip.loading('您正在使用IE浏览器，本系统对部分IE浏览器不兼容，请使用CFROME或者火狐浏览器浏览！为了保证用户体验，请谅解！');
			};
			
			this.onAutoAjax();
			this.onLogout();
			this.onColpase();
			this.onWindowResize();
			this.onContentTabsChange();
		},
		onContentTabsChange: function(){
			$('.ecm-tabs').each(function(){
				var that = this;
				$(this).find('.ecm-tabs-nav').on('click', function(){
					var i = $.inArray(this, $(that).find('.ecm-tabs-nav').toArray());
					if ( i && i > -1 && $(that).find('.ecm-tabs-content').eq(i).size() === 1 ){
						$(that).find('.ecm-tabs-content').hide();
						$(that).find('.ecm-tabs-content').eq(i).show();
						$(that).find('.ecm-tabs-nav').removeClass('active');
						$(this).addClass('active');
					}
				});
				if ( $(this).find('.ecm-tabs-nav').size() > 0 ){
					$(this).find('.ecm-tabs-nav').trigger('click');
				}
			});
		},
		onWindowResize: function(){
			$(window).on('scroll', function(){
				$('.navdirty').css('height', Math.max($(window).height(), $('#page').outerHeight()) + 'px');
			});
			$(window).on('resize', function(){
				var width = $(window).width();
				if ( width < 1062 ){
					$('.navdirty').empty().html('<h6>系统导航</h6>' + $('#navachor').html());
					if ( !$('.navcolpase').data('installed') ){
						$('.navcolpase').on('click', function(){
							var open = $(this).data('open');
							if ( !open ){
								$('#page').animate({
									left: '200px'
								}, 'fast');
								$(this).data('open', true);
							}else{
								$('#page').animate({
									left: '0px'
								}, 'fast');
								$(this).data('open', false);
							}
						}).data('installed', true);
					}
				}
			}).trigger('resize').trigger('scroll');
		},
		onColpase: function(){
			$('.colpase').on('click', function(){
				var open = $(this).data('open');
				if ( !open ){
					$(this).next().show();
					$(this).data('open', true);
				}else{
					$(this).next().hide();
					$(this).data('open', false);
				}
			});
			
			$('body').on('click', function(event){
				if ( $('.colpase').css('display') === 'none' ){
					return;
				}
				if ( event.target === $('.sidezone').get(0) || $(event.target).parents('.sidezone').size() > 0 || event.target === $('.colpase').get(0) || $(event.target).parents('.colpase').size() > 0 ){}else{
					$('.colpase').data('open', false).next().hide();
				}
			});
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
		tip: require('appjs/assets/blog.loading')
	});
});