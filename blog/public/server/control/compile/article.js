var article = new Class(function(querys, forms){
	
	this.data = {};
	
	// your code here.
	
	var articles = require(':public/library/article'),
		_ = new articles();
	
	this.getCategorys();
	this.getArticles(_);
	
	return this.data;
	
});

// 系统统计数据
article.add('getCategorys', function(articles){
	var CategroyModules = require(':public/library/category');
	var CategroyModule  = new CategroyModules();
	this.data.categorys = CategroyModule.gets(function(){ this.and('cate_outlink', 0); });
});

article.add('getArticles', function(articles){
	this.data.articles = articles.getArticlesByStorageProcess(-1, 1);
});

module.exports = article;