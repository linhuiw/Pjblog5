// JavaScript Document
var ArticleModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

ArticleModule.extend('GetArticleList', function( params ){
	var rec = new this.dbo.RecordSet(this.conn),
		page = Number(params.query.page),
		cate = Number(params.query.cate),
		sql,
		list = [],
		arrays = ['art_title', 'art_des', 'art_category', 'art_tags', 'art_cover'],
		that = this;
		
	if ( cate === 0 ){
		sql = 'Select ' + arrays.join(',') + ' From blog_articles Where art_draft=0 Order By art_postdate DESC';
	}else{
		sql = 'Select ' + arrays.join(',') + ' From blog_articles Where (art_category=' + cate + ' Or art_category in (Select id From blog_categorys Where cate_parent=' + cate + ')) And art_draft=0 Order By art_postdate DESC';
	};
	
	var Adodb = rec.sql(sql).open(1);
	Adodb.AdoPage(page, 30, function(object){
		list.push({
			art_title: object('art_title').value,
			art_des: that.fns.cutStr(that.fns.removeHTML(object('art_des').value), 200, true, '..'),
			art_category: object('art_category').value,
			art_tags: object('art_tags').value,
			art_cover: object('art_cover').value
		});
	});
	Adodb.close();
		
	return { success: true, message: '获取日志列表成功', list: list, sql: sql };
});

return ArticleModule;