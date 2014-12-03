var article = new Class();

/*
 * # 根据日志ID获取日志信息数据的方法
 * @ id <number> 日志ID
 * ? JSON
 * 分类是从缓存读取的。
 */
article.add('getArticleByID', function(id){
	var rec = new dbo(blog.tb + 'articles', blog.conn),
		article = rec.selectAll().and('id', id).toJSON()[0];
		
	var categorys = require(':private/caches/categorys.json');
	
	if ( categorys[article.art_category + ''] ){
		article.art_category = categorys[article.art_category + '']
	}else{
		if ( article.art_category === 0 ){
			article.art_category = {
				cate_name: '回收日志',
				id: 0
			}
		}
	}
	
	return article;
});

/*
 * # 辅助方法：获取这个ID的分类ID，不管是自身ID或者parentID
 * @ cate <number> 分类ID
 * ? boolean
 * 返回一个存在这个分类的父子分类的ID集合
 */
article.add('getAllCategorys', function(cate){
	var categorys = require(':private/caches/categorys.json');
	var cates = [];
	for ( var i in categorys.indexs ){
		if ( 
			!categorys.indexs[i].cate_outlink && 
			( (categorys.indexs[i].id === cate) || (categorys.indexs[i].cate_parent === cate) ) 
		){
			cates.push(categorys.indexs[i].id);
		}
	}
	return cates;
});

/*
 * # 存储过程获取日志列表的方法
 * @ cate <number | string> 分类ID或者系统分类指定的字符串 draft all et..
 * @ page <number> 当前页
 * ? JSON
 * 同时返回总页数和当前页以及数据集合
 */
article.add('getArticlesByStorageProcess', function( cate, Page ){
	var PAGE = new cmd('iPage', blog.conn);
	var where = null;
	
	if ( !cate && cate !== 0 ){
		cate = -1;
	};
	
	if ( cate == 'draft' ){
		where = 'art_draft=1';
	}
	else if ( cate == 'all' ){
		where = 'art_category>=0 And art_draft=0';
	}
	else if ( cate === 0 ){
		where = 'art_category=0 And art_draft=0';
	}
	else{
		var cates = this.getAllCategorys(cate);
		where = 'art_category in (' + cates.join(',') + ') And art_draft=0';
	}

	var result = PAGE
		.addInputVarchar('@TableName', blog.tb + 'articles')
		.addInputVarchar('@FieldList', '*')
		.addInputVarchar('@PrimaryKey', 'id')
		.addInputVarchar('@Where', where)
		.addInputVarchar('@Order', 'art_postdate desc')
		.addInputInt('@SortType', 1)
		.addInputInt('@RecorderCount', 0)
		.addInputInt('@PageSize', 12)
		.addInputInt('@PageIndex', Page)
		.addOutputInt('@TotalCount')
		.addOutputInt('@TotalPageCount')
		.exec().toJSON();
		
	var PageCount = PAGE.get('@TotalPageCount').value;
	
	return {
		result: result,
		PageCount: PageCount,
		PageIndex: Page
	};
});

/*
 * # 保存日志方法
 * @ data <json>
 * ? boolean
 * 如果data参数存在id字段，那么为修改，其余为添加
 */
article.add('SaveArticle', function( data ){
	try{
		var id = data.id, add = true;
		if ( id && id > 0 ){
			add = false;
			delete data.id;
		};
		
		var rec = new dbo(blog.tb + 'articles', blog.conn);
			rec.selectAll()
	
			if ( add ){
				rec.create();
			}else{
				rec.and('id', id).open(3);
			};
		
			rec
				.set(data)
				.save()
				.close();
				
		return true;
	}catch(e){ return false; };
});

/*
 * # 删除日志方法
 * @ id <number | array>
 * ? boolean
 * 同时具备批量删除日志的功能
 */
article.add('removeArticle', function(id){
	try{
		if ( !readVariableType(id, 'array') ){ id = [id]; };
		var rec = new dbo(blog.tb + 'articles', blog.conn);
		rec.selectAll().and('id', id, 'in').open(3).each(function(o){
			o.Delete();
		}).close();
		
		return true;
	}catch(e){ return false; }
});

module.exports = article;