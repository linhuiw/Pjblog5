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
		arrays = ['id', 'art_title', 'art_des', 'art_category', 'art_tags', 'art_cover'],
		that = this;
		
	if ( cate === -1 ){
		sql = 'Select ' + arrays.join(',') + ' From blog_articles Where art_draft=0 Order By art_postdate DESC';
	}
	else if ( cate === -2 ){
		sql = 'Select ' + arrays.join(',') + ' From blog_articles Where art_draft=1 Order By art_postdate DESC';
	}
	else if ( cate === 0 ){
		sql = 'Select ' + arrays.join(',') + ' From blog_articles Where art_category=0 And art_draft=0 Order By art_postdate DESC';
	}
	else{
		sql = 'Select ' + arrays.join(',') + ' From blog_articles Where (art_category=' + cate + ' Or art_category in (Select id From blog_categorys Where cate_parent=' + cate + ')) And art_draft=0 Order By art_postdate DESC';
	};
	
	var Adodb = rec.sql(sql).open(1);
	var pages = Adodb.AdoPage(page, 8, function(object){
		list.push({
			id: object('id').value,
			art_title: object('art_title').value,
			art_des: that.fns.cutStr(that.fns.removeHTML(object('art_des').value), 200, true, '..'),
			art_category: object('art_category').value,
			art_tags: object('art_tags').value,
			art_cover: object('art_cover').value
		});
	});
	Adodb.close();
		
	return { success: true, message: '获取日志列表成功', list: list, count: pages.pageCount };
});

ArticleModule.extend('save', function( params ){
	var id = params.form.id,
		art_title = params.form.art_title,
		art_des = params.form.art_des,
		art_category = params.form.art_category,
		art_content = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.art_content)),
		art_tags = params.form.art_tags,
		art_draft = false,
		art_tname = params.form.art_tname,
		art_cover = params.form.art_cover,
		art_tdes = params.form.art_tdes;
	
		
	var rets = { success: false, message: '保存日志失败' },
		data = {},
		GlobalCache = require('private/chips/blog.global');
	
	if ( art_title.length === 0 ){ rets.message = '标题不能为空'; return rets; };
	if ( art_category.length === 0 ){ rets.message = '请选择分类后提交'; return rets; };
	art_category = Number(art_category);
	if ( art_content.length === 0 ){ rets.message = '日志内容不为空'; return rets; };
	if ( art_des.length === 0 ){ art_des = this.fns.cutStr(this.fns.removeHTML(art_content), GlobalCache.blog_articlecut, true, '...'); };
	if ( art_tdes.length === 0 ){ art_tdes = art_des; };
	if ( !id || id.length === 0 ){ id = 0; };
	id = Number(id);
	if ( id > 0 ){ data.id = id; };
	
	data.art_title = art_title;
	data.art_des = art_des;
	data.art_category = art_category;
	data.art_content = art_content;
	data.art_tags = art_tags;
	data.art_tname = art_tname;
	data.art_cover = art_cover;
	data.art_tdes = art_tdes;
	
	this.SaveArticle(data, rets, art_draft);
	
	return rets;
});

ArticleModule.extend('SaveArticle', function( data, msg, draft ){
	var rec = new this.dbo.RecordSet(this.conn),
		id = data.id,
		date = require('date');
		
	if ( id && id > 0 ) { delete data.id; };
	
	data.art_draft = draft || false;
	
	try{
		if ( id && id > 0 ){
			data.art_modifydate = date.format(new Date(), 'y/m/d h:i:s');
			rec.sql('Select * From blog_articles Where id=' + id).open(3).update(data).close()
		}else{
			data.art_postdate = date.format(new Date(), 'y/m/d h:i:s');
			rec.sql('Select * From blog_articles').open(2).add(data).close();
		};
		
		msg.success = true;
		msg.message = '保存日志成功';
		
	}catch(e){
		msg.message = e.message;
	};
});

ArticleModule.extend('DelArticle', function( params ){
	var id = params.query.id;
	if ( !id || id.length === 0 ){
		id = 0;
	}
	id = Number(id);
	
	var rets = { success: false, message: '删除日志失败' };
	
	if ( id > 0 ){
		var rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_articles Where id=' + id)
			.open(3)
			.remove()
			.close();
			
		rets.success = true;
		rets.message = '删除日志成功';
	}
	
	return rets;
});

return ArticleModule;