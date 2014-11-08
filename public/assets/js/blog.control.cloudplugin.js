// JavaScript Document
define('appjs/assets/jquery.lsotope', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.SetupCloud();
			this.onApplicationDownload();
			this.onBindPages();
		},
		perpage: 10,
		onBindPages: function(){
			var that = this;
			$('body').on('click', '.pages a', function(){
				var page = $(this).attr('app-page');
				if ( !isNaN(page) && Number(page) > 0 ){
					that.getplugin(Number(page));
				}
			});
		},
		getClouds: function(perpage, page, callback){
			var that = this;
			this.tip.loading('正在获取云端插件信息，请稍后..');
			$.ajax({
				type : "get",
				async: false,
				url : blog.AppPlatForm + '/oauth/plugin?access_token=' + window.token + '&oauth_consumer_key=' + window.appid + '&openid=' + window.openid + '&format=jsonp&oauth_customer_perpage=' + perpage + '&oauth_customer_page=' + page,
				dataType : "jsonp",
				jsonp: "callback",
				jsonpCallback: "callback",
				success : callback,
				error: function(){
					that.tip.error('获取云端插件失败！');
				}
			});
		},
		SetupCloud: function(){
			this.getplugin(1);
		},
		getplugin: function(page){
			if ( !page ){ page = 1; };
			var that = this;
			this.getClouds(this.perpage, page, function(params){
				if ( params.error === 0 && params.data && params.data.plugins && params.data.plugins.length > 0 ){
					that.makeHTML(params.data.plugins, params.data.pages);
					that.tip.success('获取云端插件成功');
				}else{
					that.tip.error('获取云端插件失败！');
				}
			});
		},
		makeHTML: function(datas, pages){
			var that = this;
			$('#cloud-plugins').empty();
			for ( var i = 0 ; i < datas.length ; i++ ){	
				var data = datas[i];
				var div = document.createElement('div');
				$('#cloud-plugins').append(div);
				$(div).data('plugin', data).addClass('items tansAchor').html(this.makes(data));
			}
			if ( pages && pages.to > 1 ){
				var h  = '<div class="pages">';
				for ( var i = pages.from ; i <= pages.to ; i++ ){
					if ( i === pages.current ){
						h += '<span>' + i + '</span>';
					}else{
						h += '<a href="javascript:;" app-page="' + i + '" class="cloud_plugin_page">' + i + '</a>';
					}
				}
				h += '</div>';
				$('#cloud-plugins').append(h);
			}
		},
		makes: function(data){
			var h = '';
            h +=	'<div class="icon"><img src="' + blog.AppPlatForm + '/app/' + data.logo + '" /></div>';
            h +=    	'<div class="info">';
            h +=	   	  	'<h6>' + data.name + '</h6>';
            h +=			'<div class="mark">标识： <code>' + data.mark + '</code></div>';
            h +=			'<div class="author">作者： <a href="mailto:' + data.author.email + '" target="_blank">' + data.author.nick + '</a> 参考文档：<a href="' + data.author.site + '" target="_blank">查阅</a> </div>';
			h +=			'<div class="down">下载：' + data.down + ' 次</div>';
			h +=			'<div class="price">价格：<i class="fa fa-cny"></i>' + data.price.toFixed(2) + '</div>';
            h +=			'<div class="des">' + data.des + '</div>';
           	h +=			'<div class="tool">';
			if ( window.installeds.indexOf(data.mark) === -1 ){
			h +=				'<a href="javascript:;" class="app-download"><i class="fa fa-plug"></i>安装</a>';
			}
			h +=			'</div>';
			h +=		'</div>';
			h +=	'</div>';
			return h;
		},
		onApplicationDownload: function(){
			var that = this;
			$('body').on('click', '.app-download', function(){
				var node = $(this).parents('.items:first');
				var data = node.data('plugin');
				var mark = data.mark;
				if ( mark.length > 0 ){
					var install = new that.apps(mark, that.tip, 'plugin');
					install.complete = function(mark){
						that.onAppDownloaded(mark);
					}
				}
			});
		},
		onAppDownloaded: function(mark){
			var that = this;
			this.tip.loading('正在安装插件...');
			$.getJSON('public/async.asp', {
				m: 'plugin',
				p: 'install',
				id: mark
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
		},
		tip: require('appjs/assets/blog.loading'),
		apps: require('./app.download')
	});
});