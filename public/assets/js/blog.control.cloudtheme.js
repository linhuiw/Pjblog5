// JavaScript Document
define('appjs/assets/jquery.lsotope', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.SetupCloud();
		},
		perpage: 10,
		plugins: null,
		getClouds: function(perpage, page, callback){
			var that = this;
			this.tip.loading('正在获取云端主题信息，请稍后..');
			$.ajax({
				type : "get",
				async: false,
				url : blog.AppPlatForm + '/oauth/theme?access_token=' + window.token + '&oauth_consumer_key=' + window.appid + '&openid=' + window.openid + '&format=jsonp&oauth_customer_perpage=' + perpage + '&oauth_customer_page=' + page,
				dataType : "jsonp",
				jsonp: "callback",
				jsonpCallback: "callback",
				success : callback,
				error: function(){
					that.tip.error('获取云端主题失败！');
				}
			});
		},
		SetupCloud: function(){
			this.gethemes(1);
		},
		gethemes: function(page){
			if ( !page ){ page = 1; };
			var that = this;
			this.getClouds(this.perpage, page, function(params){
				if ( params.error === 0 && params.data && params.data.themes && params.data.themes.length > 0 ){
					that.plugins = params.data.plugins;
					that.makeHTML(params.data.themes, params.data.pages);
					that.tip.success('获取云端主题成功');
					that.onWaterFalls();
					that.onImageLoaded();
				}else{
					that.tip.error('获取云端主题失败！');
				}
			});
		},
		makeHTML: function(themes, pages){
			$('#cloud-themes').empty();
			for ( var i = 0 ; i < themes.length ; i++ ){
				var data = themes[i];
				var div = document.createElement('div');
				$('#cloud-themes').append(div);
				$(div).data('theme', data).addClass('theme-item').html(this.makes(data));
			}
		},
		makes: function(data){
			var h = '';
			h +=	'<div class="theme-item-zone">';
			h +=		'<div class="theme-item-logo" app-src="' + blog.AppPlatForm + '/app/' + data.logo + '">';
			h +=		'</div>';
			h +=		'<div class="theme-item-content">';
			h +=			'<h6>' + data.name + '</h6>';
			h +=			'<div class="author"><span class="nick"><img src="' + blog.AppPlatForm + '/' + data.author.avatar + '/16">' + data.author.nick + '</span><span class="link"><a href="' + data.web + '" target="_blank"><i class="fa fa-home"></i>预览主题</a></span></div>';
			h +=			'<div class="info"><span class="down"><i class="fa fa-pie-chart"></i>' + data.down + ' 次</span><span class="price"><i class="fa fa-cny"></i>' + data.price.toFixed(2) + '</span></div>';
			h +=			'<div class="action"><a href="javascript:;" class="fa fa-plug"></a></div>';
			h +=		'</div>';
			h +=	'</div>';
			return h;
		},
		onWaterFalls: function(){
			try{
				$('#cloud-themes')
				.isotope({ 
					itemSelector: '.theme-item' 
				}); 
			}catch(e){}
		},
		onImageLoaded: function(){
			$('.theme-item-logo').each(function(){
				var img = new Image(),
					src = $(this).attr('app-src'),
					that = this;

				img.onload = function(){
					$(that).append(this);
					$('#cloud-themes').isotope('layout');
				};
				
				img.src = src;
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});