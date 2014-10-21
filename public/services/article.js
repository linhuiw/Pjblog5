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

ArticleModule.add('save', function( params ){
	var id = params.form.id || '0',
		art_title = params.form.art_title || '',
		art_des = params.form.art_des || '',
		art_category = params.form.art_category || '0',
		art_content = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.art_content || '')),
		art_tags = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.art_tags || '')),
		art_draft = false,
		art_cover = params.form.art_cover,
		art_monick = false; // 是否用户自己填写
	
	if ( id.length === 0 ){ id = '0'; };
	id = Number(id);
	
		
	var rets = { success: false, message: '保存日志失败' },
		data = {},
		GlobalCache = require('private/chips/' + blog.cache + 'blog.global');
		
	if ( id > 0 ){ data.id = id; };
	if ( art_title.length === 0 ){ rets.message = '标题不能为空'; return rets; };
	if ( art_title.length > 255 ){ rets.message = '标题太长，限制为255个字符。'; return rets; };
	if ( art_category.length === 0 ){ rets.message = '请选择分类后提交'; return rets; };
	art_category = Number(art_category);
	if ( art_category < 1 ){
		rets.message = '请选择分类后提交'; 
		return rets;
	}
	if ( art_content.length === 0 ){ rets.message = '日志内容不为空'; return rets; };
	
	// 新增日志的时候
	if ( id === 0 ){
		if ( art_des.length === 0 ){ 
			art_des = this.fns.cutStr(this.fns.removeHTML(art_content), GlobalCache.blog_articlecut, true, '');
		}else{
			art_monick = true;
		}
	}
	

	if ( art_tags && art_tags.length > 0 ){
		art_tags = art_tags.split(',');
	}else{
		art_tags = [];
	}
	
	data.art_monick = art_monick;
	data.art_title = art_title;
	data.art_des = art_des;
	data.art_category = art_category;
	data.art_content = art_content;
	data.art_tags = art_tags;
	
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

	this.SaveArticle(data, rets, art_draft, GlobalCache);
	
	return rets;
});

ArticleModule.add('SaveArticle', function( data, msg, draft, GlobalCache ){
	var rec = new this.dbo.RecordSet(this.conn),
		id = data.id,
		date = require('date'),
		tags = require('./tag'),
		tag = new tags(),
		that = this;
		
	if ( id && id > 0 ) { delete data.id; };
	
	data.art_draft = draft || false;
	
	try{
		if ( id && id > 0 ){
			data.art_modifydate = date.format(new Date(), 'y/m/d h:i:s');

			var oldTags = [];
			rec
				.sql('Select * From blog_articles Where id=' + id)
				.process(function( object ){
					if ( !object.Bof && !object.Eof ){
						var tags = object('art_tags').value;
						var art_monick = object('art_monick').value;
						if ( tags.length > 0 ){
							oldTags = tags.replace(/^\{/, '').replace(/\}$/, '').split('}{');
						};
						
						if ( data.art_des.length === 0 ){
							data.art_monick = false;
							data.art_des = that.fns.cutStr(that.fns.removeHTML(data.art_content), GlobalCache.blog_articlecut, true, '');
						}else{
							if ( object('art_des').value === data.art_des ){
								if ( !art_monick ){
									data.art_des = that.fns.cutStr(that.fns.removeHTML(data.art_content), GlobalCache.blog_articlecut, true, '');
								}
							}else{
								data.art_monick = true;
							}
						}
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