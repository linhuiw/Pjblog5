var Write = new Class(function(querys, getforms){
	this.data = {};

	var articles = require(':public/library/article'),
		_ = new articles();
		
	this.categorys();
	this.getArticle(querys, _);
	
	return this.data;
});

Write.add('categorys', function(){
	var categoryModules = require(':public/library/category');
	var categoryModule = new categoryModules();
	this.data.categorys = categoryModule.gets(function(){ this.and('cate_outlink', 0); });
});

Write.add('getArticle', function( q, o ){
	if ( q.id && q.id.length > 0 && !isNaN(q.id) ){
		this.data.article = o.getArticleByID(Number(q.id));
	}else{
		this.data.article = {};
	}
});

module.exports = Write;