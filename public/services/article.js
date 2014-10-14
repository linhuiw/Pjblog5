// JavaScript Document
var ArticleModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	},
	__allows__: ['GetArticleList']
});

ArticleModule.add('GetArticleList', function( params ){
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
	var pages = Adodb.AdoPage(page, 30, function(object){
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
		
	return { success: true, message: '获取日志列表成功', list: list, count: pages ? pages.pageCount : 0 };
});

ArticleModule.add('save', function( params ){
	var id = params.form.id,
		art_title = params.form.art_title,
		art_des = params.form.art_des,
		art_category = params.form.art_category || 0,
		art_content = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.art_content)),
		art_tags = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.art_tags)),
		art_draft = false,
		art_tname = params.form.art_tname,
		art_cover = params.form.art_cover,
		art_tdes = params.form.art_tdes;
	
		
	var rets = { success: false, message: '保存日志失败' },
		data = {},
		GlobalCache = require('private/chips/' + blog.cache + 'blog.global');
	
	if ( art_title.length === 0 ){ rets.message = '标题不能为空'; return rets; };
	if ( art_title.length > 255 ){ rets.message = '标题太长，限制为255个字符。'; return rets; };
	if ( art_category.length === 0 ){ rets.message = '请选择分类后提交'; return rets; };
	art_category = Number(art_category);
	if ( art_content.length === 0 ){ rets.message = '日志内容不为空'; return rets; };
	if ( art_des.length === 0 ){ art_des = this.fns.cutStr(this.fns.removeHTML(art_content), GlobalCache.blog_articlecut, true, '...'); };
	if ( art_tdes.length === 0 ){ art_tdes = art_des; };
	if ( !id || id.length === 0 ){ id = 0; };
	id = Number(id);
	if ( id > 0 ){ data.id = id; };
	
	if ( art_tags && art_tags.length > 0 ){
		art_tags = art_tags.split(',');
	}else{
		art_tags = [];
	}
	
	data.art_title = art_title;
	data.art_des = art_des;
	data.art_category = art_category;
	data.art_content = art_content;
	data.art_tags = art_tags;
	data.art_tname = art_tname;
	
	var imgexp = /<img([^\s]*?)\ssrc=\"([^\"]*?)\"(.*?)>/i.exec(data.art_content);
	if ( imgexp && imgexp[2] ){
		data.art_cover = imgexp[2];
	}else{
		data.art_cover = '';
	};
	var ist = data.art_cover.indexOf('private');
	if ( ist > -1 ){
		data.art_cover = data.art_cover.substr(ist);
	};
	data.art_tdes = art_tdes;

	this.SaveArticle(data, rets, art_draft);
	
	return rets;
});

ArticleModule.add('SaveArticle', function( data, msg, draft ){
	var rec = new this.dbo.RecordSet(this.conn),
		id = data.id,
		date = require('date'),
		tags = require('./tag'),
		tag = new tags();
		
	if ( id && id > 0 ) { delete data.id; };
	
	data.art_draft = draft || false;
	
	try{
		if ( id && id > 0 ){
			data.art_modifydate = date.format(new Date(), 'y/m/d h:i:s');

			var oldTags = [];
			rec
				.sql('Select * From blog_articles Where id=' + id)
				.process(function( object ){
					var tags = object('art_tags').value;
					if ( tags.length > 0 ){
						oldTags = tags.replace(/^\{/, '').replace(/\}$/, '').split('}{');
					}
				}, 3);

			if ( oldTags.length > 0 ){ tag.remove(oldTags); };
			data.art_tags = tag.add(data.art_tags).join('');
			rec = new this.dbo.RecordSet(this.conn)
			rec
				.sql('Select * From blog_articles Where id=' + id)
				.on('update', function(object){
					id = object('id').value;
				})
				.open(3)
				.update(data)
				.close();
		}else{
			data.art_postdate = date.format(new Date(), 'y/m/d h:i:s');
			data.art_tags = tag.add(data.art_tags).join('');
			rec
				.sql('Select * From blog_articles')
				.on('add', function(object){
					id = object('id').value;
				})
				.open(2)
				.add(data)
				.close();
		};
		
		msg.success = true;
		msg.message = '保存日志成功';
		msg.id = id;
		
		tag.SaveCacheFile();
		
	}catch(e){
		msg.message = e.message;
	};
});

ArticleModule.add('DelArticle', function( params ){
	var id = params.query.id;
	if ( !id || id.length === 0 ){
		id = 0;
	}
	id = Number(id);
	
	var rets = { success: false, message: '删除日志失败' },
		tags = require('./tag'),
		tag = new tags();
	
	if ( id > 0 ){
		var rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_articles Where id=' + id)
			.process(function(object){
				var _tag = object('art_tags').value.replace(/^\{/, '').replace(/\}$/, '').split('}{');
				if ( _tag.length > 0 ){ tag.remove(_tag); };
				this.remove();
			}, 3);
			
		var hooks = require('public/library/hook');
		var hook = new hooks();
		
		hook.get('ECM_ARTICLE_REMOVE').proxy(this).compile(id);
			
		rets.success = true;
		rets.message = '删除日志成功';
		
		tag.SaveCacheFile();
	}
	
	return rets;
});

return ArticleModule;