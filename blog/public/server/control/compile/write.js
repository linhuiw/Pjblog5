var Write = new Class(function(querys, getforms){
	this.data = {};

	var articles = require(':public/library/article'),
		_ = new articles();
		
	this.categorys();
	
	return this.data;
});

Write.add('categorys', function(){
	var categoryModules = require(':public/library/category');
	var categoryModule = new categoryModules();
	this.data.categorys = categoryModule.gets(function(){ this.and('cate_outlink', 0); });
});

module.exports = Write;