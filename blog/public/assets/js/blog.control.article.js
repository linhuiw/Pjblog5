// JavaScript Document
define([ 'appjs/assets/jquery.lsotope' ], function( require, exports, module ){
	return new Class({
		initialize: function(){
			var that = this;
			this.setCategorys();
			this.GetArticleList(function(){ that.waterFull(); });
		},
		setCategorys: function(){
			var that = this;
			$('.setCate').on('click', function(){
				window.cate = Number($(this).attr('app-cate'));
				window.page = 1;
				that.GetArticleList(function(){
					that.waterFull();
				});
			});
		},
		GetArticleList: function(callback){
			var that = this;
			if ( !window.doing ){
				window.doing = true;
				this.tip.loading('正在获取日志列表，请稍后..');
				$.getJSON('public/async.asp', {
					m: 'article',
					p: 'GetArticleList',
					cate: window.cate,
					page: window.page
				}, function( params ){
					window.doing = false;
					if ( params.success ){
						that.MakeArticleHTML(params.list);
						that.tip.close();
						typeof callback === 'function' && callback(params.list);
					}else{
						that.tip.error(params.message);
					}
				});
			}
		},
		MakeArticleHTML: function( list ){
			for ( var i = 0 ; i < list.length ; i++ ){ 
				this.MakeSingleArticleHTML(list[i]); 
				this.MakeSingleArticleHTML(list[i]);
				this.MakeSingleArticleHTML(list[i]); 
			};
		},
		MakeSingleArticleHTML: function( data ){
			var h = '<li>';
				h +=	'<div class="article-content">';
				h +=		'<div class="image">';
				h +=			'<img src="' + ((!data.art_cover || data.art_cover.length === 0) ? 'public/assets/img/man.jpg' : data.art_cover)  + '" onerror="this.src=\'public/assets/img/man.jpg\'" />';
				h +=		'</div>';
				h +=		'<div class="title wordCut">' + data.art_title + '</div>';
				h +=		'<div class="des">' + data.art_des + '</div>';
				h +=		'<div class="info clearfix">';
				h +=			'<div class="cate fleft">' + data.art_category + '</div>';
				h +=			'<div class="cate fright">' + data.art_tags + '</div>';
				h +=		'</div>';
				h +=		'<div class="tooled">';
				h +=			'<a href="javascript;;"><i class="fa fa-pencil-square-o"></i></a>';
				h +=			'<a href="javascript;;"><i class="fa fa-trash-o"></i></a>';
				h +=		'</div>';
				h +=	'</div>';
				h +='</li>';
		
			$('.waterfull').append(h);
		},
		waterFull: function(){ 
			$('.waterfull').isotope({ 
				itemSelector: '.waterfull li' 
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});