var article = new Class(function(querys, getforms){
	
	this.data = {};
	
	// your code here.
	
	var articles = require(':public/library/article'),
		_ = new articles();
	
	this.getCategorys();
	this.getArticles(querys, getforms, _);
	
	return this.data;
	
});

// 系统统计数据
article.add('getCategorys', function(articles){
	var CategroyModules = require(':public/library/category');
	var CategroyModule  = new CategroyModules();
	this.data.categorys = CategroyModule.gets(function(){ this.and('cate_outlink', 0); });
});

article.add('getArticles', function(querys, getforms, articles){
	var c = querys.c,
		p = querys.s;

	if ( !c || c.length === 0 ){
		c = 'all';
	};

	if ( !isNaN(c) ){
		c = Number(c);
	}

	if ( !p || p.length === 0 ){
		p = 1;
	}
	
	if ( !isNaN(p) ){
		p = Number(p);
	}
	
	if ( p < 1 ) p = 1;
	
	this.data.articles = articles.getArticlesByStorageProcess(c, p);
	
	var IPAGE = require('iPage');
	var iPage = new IPAGE(this.data.articles.PageCount, this.data.articles.PageIndex);
	
	this.data.pages = {
		arrays: iPage.toArray(),
		value: iPage.value,
		c: c + '',
		s: p + ''
	};

});

module.exports = article;