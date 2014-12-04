var category = new Class();

category.add('gets', function( callback ){
	var exists = {}, 
		orders = [], 
		indexs = {}, 
		queens = [];
		
	var rec = new dbo(blog.tb + 'categorys', blog.conn);
		rec
			.selectAll()
			.asc('cate_order')
			.asc('id');
	
	if ( typeof callback === 'function' ){
		callback.call(rec);
	};
	
	var data = rec.toJSON();
	
	data.forEach(function( detail ){
		indexs[detail.id + ''] = detail;
		if ( detail.cate_parent === 0 ){
			if ( !exists[detail.id + ''] ){
				exists[detail.id + ''] = [];
			};
			orders.push(detail.id);
		}else{
			if ( !exists[detail.cate_parent + ''] ){
				exists[detail.cate_parent + ''] = [];
			};
			exists[detail.cate_parent + ''].push(detail.id);
		}
	});
	
	orders.forEach(function( id ){
		var cate = { id: id, items: [] };
		if ( exists[id + ''] && exists[id + ''].length > 0 ){
			cate.items = exists[id + ''];
		}
		queens.push(cate);
	});
	
	return {indexs: indexs, queens: queens};
});

category.add('inst', function(data){
	var id = 0;
	var rec = new dbo(blog.tb + 'categorys', blog.conn);
		rec.create().set(data).save().exec(function(object){
			id = object('id').value;
		}).close();
	
	return id;
});

category.add('save', function(data){
	var id = data.id;
	delete data.id;
	var rec = new dbo(blog.tb + 'categorys', blog.conn);

	if (data.cate_parent) {
		rec.selectAll().and('id', data.cate_parent).open().exec(function(){}, function(object){
			data.cate_parent = 0;
		}).close();
	}
	
	if ( data.cate_src && data.cate_src.length > 0 ){
		data.cate_outlink = 1;
	}else{
		data.cate_outlink = 0;
	}
	
	rec.resetSQL().selectAll().and('id', id).open(3).set(data).save().close();
	
	var caches = require(':public/library/cache');
	var cache = new caches();
	cache.categorys();
});

category.add('remove', function(id, isAppend){
	// return boolean
	var GlobalCache = require(':private/caches/global.json'),
		ArticleModules = require('article'),
		ArticleModule,
		that = this;

	// 删除分类下的日志
	// 首先取得所有日志的ID集合
	var articles = [];
	(new dbo(blog.tb + 'articles', blog.conn))
	.select('id').and('art_category', id).open().each(function(object){ articles.push(object('id').value); }).close();
	
	// 创建日志删除类的实例对象
	ArticleModule = new ArticleModules();
	// 开始删除日志
	// 直接删除
	if ( GlobalCache.blog_categoryremove === 1 ){
		ArticleModule.removeArticle(articles);
	}
	// 移动到回收站
	else if ( GlobalCache.blog_categoryremove === 0 ){
		ArticleModule.removeArticleToRestoreage(articles);
	}
	
	// 如果是父分类
	// 那么根据设置来删除父分类
	// 取得父分类
	var parent = (new dbo(blog.tb + 'categorys', blog.conn)).select('cate_parent').and('id', id).toJSON()[0].cate_parent;
	if ( parent === 0 ){
		// 循环删除这个父分类下面的子分类
		(new dbo(blog.tb + 'categorys', blog.conn))
		.select('id').and('cate_parent', id).toJSON().forEach(function( o ){ that.remove(o.id, true); });
		// 删除这个父分类
		(new dbo(blog.tb + 'categorys', blog.conn)).selectAll().and('id', id).open(3).remove().close();
	}else{
		// 如果是继承循环过来的子分类删除 而且 删除类型是转移定分类
		if ( isAppend && GlobalCache.blog_categoryremovechild === 0 ){
			(new dbo(blog.tb + 'categorys', blog.conn)).selectAll().and('id', id).open(3).set({ cate_parent: 0 }).save().close();
		}
		// 直接删除这个分类
		else{
			(new dbo(blog.tb + 'categorys', blog.conn)).selectAll().and('id', id).open(3).remove().close();
		}
	};
});

// 主删除方法
category.add('removeCategory', function(id){
	blog.conn.BeginTrans();
	try{
		this.remove(id);
		var caches = require(':public/library/cache');
		var cache = new caches();
			cache.categorys();
		blog.conn.CommitTrans();
		return true;
	}catch(e){
		blog.conn.RollBackTrans();
		return false;
	};
});

module.exports = category;