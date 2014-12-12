var layout = new Class(function( querys, forms ){
    var that = this;
	this.load(querys, forms);
	this.getArticle();
	
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
    var id = this.req.id;
    if ( !id || id.length === 0 ){
        id = 0;
    };
    id = Number(id);
    if ( id < 1 ){
        this.error(10001);
    }else{
        var articles = require(':public/library/article');
        var article = new articles();
        this.data.article = article.getArticleByID(id);
    }
});

layout.extend(require(':public/library/layout'));

module.exports = layout;