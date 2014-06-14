// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			var that = this;
				that.waterFull();
				this.setCategorys();
				$(function(){
					that.GetArticleList();
				});
				this.GotoModifyArticle();
				this.onScrollGetMessage();
		},
		GotoModifyArticle: function(){
			$('#modifyarticle').on('click', function(){
				window.location.href = '?m=modifyarticle';
			});
		},
		CategorysTitle: function(){
			if ( window.cate === -1 ){
				return '全部分类日志(-1)';
			}
			else if ( window.cate === -2 ){
				return '草稿箱日志(-2)';
			}
			else if ( window.cate === 0 ){
				return '垃圾箱日志(0)';
			}
			else{
				return window.categorys[window.cate + ''] + "(" + window.cate + ")";
			}
		},
		setCategorys: function(){
			var that = this;
			$('.setCate').on('click', function(){
				window.cate = Number($(this).attr('app-cate'));
				window.page = 1;
				$('#cates').html(that.CategorysTitle());
				that.GetArticleList(function(){
					$('.waterfull').isotope('layout')
				}, true);
			});
		},
		GetArticleList: function(callback, reloaded){
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
						window.PageCount = params.count;
						that.MakeArticleHTML(params.list, reloaded);
						that.tip.close();
						typeof callback === 'function' && callback(params.list);
					}else{
						that.tip.error(params.message);
					}
				});
			}
		},
		MakeArticleHTML: function( list, reloaded ){
			if ( reloaded ){ 
				$('.waterfull li').each(function(){
					$('.waterfull').isotope('remove', this);
				}); 
			};
			
			var i = 0;
			
			if ( list[i] ){
				this.MakeSingleArticleHTML(list[i], i, list)
			}
		},
		MakeSingleArticleHTML: function( data, i, list ){
			if ( !list[i] ){ return; };
			var that = this;
			var img = (!data.art_cover || data.art_cover.length === 0) ? 'public/assets/img/man.jpg' : data.art_cover;
			var h 	=	'<div class="article-content">';
				h +=		'<div class="image">';
				h +=			'<img src="' + img  + '" onerror="this.src=\'public/assets/img/man.jpg\'" class="artimg" />';
				h +=		'</div>';
				h +=		'<div class="title"><a href="article.asp?id=' + data.id + '" class="wordCut" target="_blank">' + data.art_title + '</a></div>';
				h +=		'<div class="des">' + data.art_des + '</div>';
				h +=		'<div class="info clearfix">';
				h +=			'<div class="cate fleft"><i class="fa fa-dot-circle-o"></i> ' + window.categorys[data.art_category + ''] + '</div>';
				h +=			'<div class="cate fright">' + (data.art_tags || '') + '</div>';
				h +=		'</div>';
				h +=		'<div class="tooled">';
				h +=			'<a href="?m=modifyarticle&id=' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
				h +=			'<a href="javascript:;" class="AutoSendAjax deletearticle" app-m="article" app-p="DelArticle" app-c="确定删除这个日志？" app-id="' + data.id + '"><i class="fa fa-trash-o"></i></a>';
				h +=		'</div>';
				h +=	'</div>';
				
			var imgs = new Image();
			
			imgs.onload = imgs.onerror = function(){
				var li = document.createElement('li');
				$('.waterfull').append(li);
				$(li).html(h);
				$('.waterfull').isotope('insert', li);
				$(li).find('.deletearticle').data('callback', function(){
					that.onDeleteArticle(li);
				});
				i++;
				that.MakeSingleArticleHTML(list[i], i, list);
			}
			
			imgs.src = img;
		},
		waterFull: function(){ 
			$('.waterfull').isotope({ 
				itemSelector: '.waterfull li' 
			});
		},
		onDeleteArticle: function(el){
			$('.waterfull').isotope('remove', el).isotope('layout');
		},
		onScrollGetMessage: function(){
			var that = this;
			if ( !window.bindScroll ){
				window.bindScroll = true;
				$(window).on("scroll",function() {
					if ($('body').scrollTop() + $(window).height() > $(document).height() - 50) {
							if ( !window.doing && window.page < window.PageCount ){
								window.page++;
								that.GetArticleList(function(){ $('.waterfull').isotope('layout'); });
							}
					}
				});
			}
		},
		tip: require('appjs/assets/blog.loading')
	});
});