// JavaScript Document
define([
	'appjs/assets/jquery.lsotope'
],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.formatVersion();
			this.updatesql();
			this.addNews();
			this.waterFull();
		},
		formatVersion: function(){
			var keep = [];
			for ( var i in this.versions ){
				if ( Number(i) > blog.version ){
					this.versions[i].id = Number(i);
					keep.push(this.versions[i]);
				}
			}
			keep = keep.sort(function(a, b){
				return a.id - b.id;
			});
			if ( keep.length > 0 ){
				$('#versions .zone').append('<div class="clearfix title"><div class="ver fleft">版本</div><div class="info">描述</div></div>');
				for ( var j = 0 ; j < keep.length ; j++ ){
					$('#versions .zone').append('<div class="clearfix"><div class="ver fleft">V' + keep[j].id + '</div><div class="info"><p>' + keep[j].des + '</p><div class="date">' + (this.date.format(new Date(keep[j].time), 'y-m-d h:i:s')) + ' 发布</div><div class="tool"><a href="javascript:;" class="updatesql" app-id="' + keep[j].id + '"><i class="fa fa-angle-up"></i> 数据升级</a></div></div></div>');
				}
				$('#versions .zone').append('<p style="padding: 5px; height:20px; line-height:20px;">当前版本：V' + blog.version + ' <a href="?m=update" style="margin-left:100px;">文件校验升级</a></p>');
			}else{
				$('#versions .zone').html('<span style="padding: 5px; line-height:20px;">您已是最新版本V' + blog.version + '。无须升级。</span>');
				$('#versions .zone').append('<p style="padding: 5px; height:20px; line-height:20px;">当前版本：V' + blog.version + ' <a href="?m=update" style="margin-left:70px;">文件校验 修复/升级</a></p>');
			}
			$('.waterfull')
			.isotope('layout')
		},
		// 瀑布流设计
		waterFull: function(){ 
			$('.waterfull')
			.isotope({ 
				itemSelector: '.waterfull li' 
			}); 
		},
		addNews: function(){
			var data = this.news.data;
			for ( var i = 0 ; i < data.length ; i++ ){
				$('#platnews').append('<div class="detail-body-A2-item"><a href="http://app.webkits.cn/article/' + data[i].id + '" target="_blank"><i class="fa fa-angle-right"></i> ' + data[i].title + '</a><div class="time">'+data[i].time+'</div></div>');
			}
		},
		updatesql: function(){
			var that = this;
			$('body').on('click', '.updatesql', function(){
				var id = $(this).attr('app-id');
				that.tip.loading();
				$.getJSON('public/async.asp', {
					m: 'online',
					p: 'dosql',
					id: id
				}, function(params){
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				})
			});
		},
		versions: require('http://app.webkits.cn/upgrades/pjblog5.list'),
		news: require('http://app.webkits.cn/acts/article/up.assets.js'),
		date: require('appjs/assets/date'),
		tip: require('appjs/assets/blog.loading')
	});
});