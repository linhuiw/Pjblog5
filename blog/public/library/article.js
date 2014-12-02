var article = new Class();

article.add('getbyid', function(id){
	var rec = new dbo(blog.tb + 'articles', blog.conn);
	var article = rec.selectAll().and('id', id).toJSON();
	if ( article.art_category === 0 ) {
		article.art_catename = '未分类日志';
	} else if ( article.art_category === -2 ) {
		article.art_catename = '草稿箱日志';
	} else{
		rec = new dbo(blog.tb + 'categorys', blog.conn);
		rec.select('id', 'cate_name').and('id', article.art_category).open().exec(function(object){
			article.art_catename = object('cate_name').value;
		}, function(){
			article.art_category = 0;
			article.art_catename = '未分类日志';
		}).close();
	}
	
	return article;
});

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

article.add('getall', function(cate){
	var rec = new dbo(blog.tb + 'articles', blog.conn);

});

module.exports = article;