var article = new Class(function(querys, forms){
	
	this.data = {};
	
	// your code here.
	
	var articles = require(':public/library/article'),
		_ = new articles();
	
	this.getCategorys(_);
	
	return this.data;
	
});

// 系统统计数据
article.add('getCategorys', function(articles){
	this.data.categorys = articles.getcates();
});

module.exports = article;