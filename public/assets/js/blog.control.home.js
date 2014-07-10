// JavaScript Document
define([
	'appjs/assets/jquery.lsotope'
],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.waterFull();
			this.formatVersion();
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
					$('#versions .zone').append('<div class="clearfix"><div class="ver fleft">V' + keep[j].id + '</div><div class="info"><p>' + keep[j].des + '</p><div class="date">' + (this.date.format(new Date(keep[j].time), 'y-m-d h:i:s')) + ' 发布</div><div class="tool"><a href="javascript:;"><i class="fa fa-angle-up"></i> 数据升级</a></div></div></div>');
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
		versions: require('http://plats.cn/upgrades/pjblog5.list'),
		date: require('appjs/assets/date')
	});
});