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

layout.extend(require(':public/library/layout'));

module.exports = layout;