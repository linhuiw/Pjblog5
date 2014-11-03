// JavaScript Document
define(['appjs/assets/iscroll'], function( require, exports, module ){
	return new Class({
		initialize: function(){
			var strap = new Date().getTime();
			this.welcome();
			this.getThemes(strap, function(){
				this.install();
			});
		},
		welcome: function(){
			var welcome = $('#welcome');
			$(window).on('resize', function(){
				welcome.add(welcome.find('.welcome-wrap')).css('height', ($(window).height() - 50) + 'px');
			}).trigger('resize');
		},
		getThemes: function(strap, callback){
			var welcome = $('#welcome'),
				that = this;
			
			var promise = new Promise(function(resolve){
				$.getJSON('public/async.asp', {m: 'theme', p: 'getThemes'}, function(params){
					that.themes = params.themes;
					that.current = params.current;
					resolve(params);
				});
			});
			
			promise.then(function(params){
				$('#welcome .w1').html('正在加载图片资源');
				var asyncs = [];
				var k = 0;
				for ( var i in params.themes ){
					var folder = params.themes[i].folder,
						src = 'private/themes/' + folder + '/' + params.themes[i].icon;
					
					var img = new Image();
					
					asyncs.push(new Promise(function(resolve, reject){
						img.onload = function(){
							resolve(this);
						};
						img.onerror = function(){
							reject(this);
						};
						img.src = src;
					}));
				};
				
				that.length = asyncs.length;

				Promise.all(asyncs).then(function(){
					var diff = new Date().getTime() - strap;
					$('#welcome .w1').html('所有图片加载完毕');
					setTimeout(function(){
						welcome.addClass('welcomeoutview');
						if ( !$.support.transition ){
							welcome.remove();
						};
						typeof callback === 'function' && callback.call(that);
					}, diff > 2200 ? 0 : 2200 - diff);
				});
			});
		},
		install: function(){
			
			var length = (238 + 15) * this.length - 15;
			var that = this;
			
			$('.themefixs .themefixs-list .themefixs-list-wrap .themefixs-list-wrap-items').css('width', length + 'px');
			
			for ( var i in this.themes ){
				$('.themefixs .themefixs-list .themefixs-list-wrap .themefixs-list-wrap-items').append(this.makeHTML(this.themes[i]));
			}
			
			this.scroller = new iScroll('scrollbar', {hScrollbar:false, vScrollbar:false});
			
			$('.theme-remove').data('callback', function(){
				$(this).parents('.themefixs-list-wrap-item:first').animate({ opacity: 0 }, 'slow', function(){
					$(this).remove();
					$('.themefixs .themefixs-list .themefixs-list-wrap .themefixs-list-wrap-items').css('width', ((238 + 15) * $('.themefixs-list-wrap-item').size() - 15) + 'px');
					that.scroller.refresh();
				});
			});
			
			$('.app-setup').data('callback', function(){
				setTimeout(function(){
					window.location.reload();
				}, 1000);
			});
			
			$('.theme-review').on('click', function(){
				var folder = $(this).attr('app-id');
				if ( folder && folder.length > 0 && that.themes[folder] ){
					that.mockup(that.themes[folder]);
				}
			});
			
			if ( this.current && this.current.length > 0 && this.themes[this.current] ){
				this.mockup(this.themes[this.current]);
			};
			
			$('.do-local').data('open', true).on('click', function(){
				var open = $(this).data('open');
				if ( open ){
					$('.themefixs-list').hide();
					$('.themefixs-tabs').addClass('resize');
					$(this).data('open', false);
				}else{
					$('.themefixs-list').show();
					$('.themefixs-tabs').removeClass('resize');
					$(this).data('open', true);
				}
			});
		},
		mockup: function(currentData){
			$('.theme-image').removeClass('animated').removeClass('zoomInLeft');
			setTimeout(function(){
				$('.theme-image').addClass('animated').addClass('zoomInLeft');
			}, 0);
			$('.theme-image .theme-image-box .imgs').html('<img src="private/themes/' + currentData.folder + '/preview.png" />');
			$('.theme-info h1').html(currentData.name);
			$('.theme-info .author').html('<i class="fa fa-user"></i>' + currentData.author);
			$('.theme-info .mail').html('<i class="fa fa-envelope-o"></i>' + currentData.mail);
			$('.theme-info .link').html('<i class="fa fa-home"></i>' + currentData.site);
			$('.theme-info .mark').html('<i class="fa fa-share-alt"></i>' + currentData.mark);
			$('.theme-info .folder').html('<i class="fa fa-folder-open-o"></i>' + currentData.folder);
			$('.theme-info .des').html('<i class="fa fa-comment-o"></i>' + currentData.des);
			if ( currentData.setting ){
			$('.theme-info .set').html('<a href="?m=themesetting"><i class="fa fa-cogs"></i>设置主题参数</a>');
			}else{
			$('.theme-info .set').hide();
			}
		},
		makeHTML: function(data){
			var h = '';
			if ( this.current === data.folder ){
			h += 	'<div class="themefixs-list-wrap-item active">';
			}else{
			h += 	'<div class="themefixs-list-wrap-item">';	
			}
			h +=		'<div class="themefixs-list-wrap-item-image track">';
			h +=			'<div class="themes-image">';
			h +=				'<div class="bg">';
			h +=					'<div class="pos">'
			h +=						'<img src="private/themes/' + data.folder + '/' + data.icon + '" />';
			h +=						'<div class="tip track wordCut clearfix">';
			h +=							'<a href="' + data.site + '" target="_blank" class="fleft">' + data.author + '</a>';
			h +=							'<a href="mailto:' + data.mail + '" class="fright" target="blank">' + data.mail + '</a>';
			h +=						'</div>';
			h +=					'</div>';
			h +=				'</div>';
			h +=			'</div>';
			if ( this.current !== data.folder ){
			h +=			'<a href="javascript:;" class="setup track app-setup AutoSendAjax" app-id="' + data.folder + '" app-m="theme" app-p="setup" app-c="确定安装这个主题？如果确定安装，原主题信息将被撤销！"><i class="fa fa-plug"></i></a>';
			}
			h +=		'</div>';
			h +=		'<div class="themefixs-list-wrap-item-text track">';
			h +=			'<h6 class="wordCut">' + data.name + '</h6>';
			h +=			'<p class="wordCut">' + data.des + '</p>';	
			h +=			'<p class="clearfix">';
			h +=				'<a href="#" app-id="' + data.folder + '" class="fleft theme-review"><i class="fa fa-eye"></i>预览</a>';
			if ( this.current !== data.folder ){
			h +=				'<a href="?m=cloudthemes" app-id="' + data.folder + '" class="fright theme-remove AutoSendAjax" app-m="theme" app-p="remove" app-c="确定删除这个主题吗？删除后无法恢复！"><i class="fa fa-trash-o"></i>删除</a>';
			}
			h +=			'</p>';	
			h +=		'</div>';
			h +=	'</div>';
			
			return h;
		},
		themes: {},
		current: '',
		length: 0,
		tip: require('appjs/assets/blog.loading')
	});
});