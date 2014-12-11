var layout = new Class(function(querys, forms){
	
	var that = this;
	this.load(querys, forms);
	this.getArticles();
	
	fs(contrast(':private/themes/' + this.data.global.blog_theme + '/views/articles.asp')).exist().then(function(){
		that.render('articles.asp');
	}).fail(function(){
		try{
			blog.conn.Close();
			Response.Redirect(iPress.setURL('page', 'error'));
		}catch(e){}
	});
	
});

layout.add('getArticles', function(){
	var cate = this.req.query.id,
		page = this.req.query.page;
		
	if ( !cate || cate.length === 0 ){
		cate = 'all';
	};
	
	if ( !isNaN(cate) ){
		cate = Number(cate);
	};
	
	this.req.query.cate = cate;
	
	if ( !page || page.length === 0 ){
		page = 1;
	};
	
	page = Number(page);
	
	if ( page < 1 ){
		page = 1;
	};
	
	var articles = require(':public/library/article');
	var article = new articles();
	var rec = article.getArticlesByStorageProcess(cate, page);
	var IPAGE = require('iPage');
	var iPage = new IPAGE(rec.PageCount, rec.PageIndex);
	var tagModules = require(':public/library/tag');
	var tagModule = new tagModules();
	
	var Arts = [], that = this;
	rec.result.forEach(function(o){
		o.src = iPress.setURL('page', 'article', { id: o.id });
		
		var category = o.art_category;
		if ( that.data.categories.indexs[category] ){
			o.art_category = that.data.categories.indexs[category];
		}else{
			o.art_category = {};
		}

		o.art_tags = tagModule.get(tagModule.parse(o.art_tags));
		
		o.art_postdate = new Date(o.art_postdate).getTime();
		o.art_modifydate = new Date(o.art_modifydate).getTime();
		
		Arts.push(o);
	});
	
	this.data.articles = Arts;
	this.data.pages = {
		arrays: iPage.toArray(),
		value: iPage.value
	};
});

layout.extend(require(':public/library/layout'));

module.exports = layout;