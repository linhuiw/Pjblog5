var layout = new Class(function( querys, forms ){
    var that = this;
	this.load(querys, forms);
	this.getArticle();
	this.getPrevArticle();
	this.getNextArticle();
	
	fs(contrast(':private/themes/' + this.data.global.blog_theme + '/views/article.asp')).exist().then(function(){
		that.render('article.asp');
	}).fail(function(){
		try{
			blog.conn.Close();
			Response.Redirect(iPress.setURL('page', 'error'));
		}catch(e){}
	});
});

layout.add('getArticle', function(){
    var id = this.req.query.id;
    if ( !id || id.length === 0 ){
        id = 0;
    };
    id = Number(id);
    if ( id < 1 ){
        this.error(10001);
    }else{
		this.req.query.id = id;
        var articles = require(':public/library/article');
        var article = new articles();
        this.data.article = article.getArticleByID(id);
		if ( this.data.article.art_category > 0 ){
			if ( this.data.categories.indexs[this.data.article.art_category] ){
				this.data.article.art_category = this.data.categories.indexs[this.data.article.art_category];
			}else{
				this.data.article.art_category = {};
			}
		}
    }
});

layout.add('getPrevArticle', function(){
	var rec = new dbo(blog.tb + 'articles', blog.conn);
	var data = null;
	
	rec.top(1).select('id', 'art_title', 'art_cover').and('id', this.req.query.id, '<').desc('id').open().exec(function( object ){
		data = {};
		data['id'] = object('id').value;
		data['art_title'] = object('art_title').value;
		data['art_cover'] = object('art_cover').value;
		data['src'] = iPress.setURL('page', 'article', { id: object('id').value });
	}).close();
	
	this.data.PrevArticle = data;
});

layout.add('getNextArticle', function(){
	var rec = new dbo(blog.tb + 'articles', blog.conn);
	var data = null;
	
	rec.top(1).select('id', 'art_title', 'art_cover').and('id', this.req.query.id, '>').asc('id').open().exec(function( object ){
		data = {};
		data['id'] = object('id').value;
		data['art_title'] = object('art_title').value;
		data['art_cover'] = object('art_cover').value;
		data['src'] = iPress.setURL('page', 'article', { id: object('id').value });
	}).close();
	
	this.data.NextArticle = data;
});

layout.extend(require(':public/library/layout'));

module.exports = layout;