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

article.add('getArticlesByStorageProcess', function( cate, Page ){
	var PAGE = new cmd('iPage', blog.conn);
	var where = null;
	
	if ( !cate && cate !== 0 ){
		cate = -1;
	};
	
	if ( cate === -2 ){
		where = 'art_draft=1';
	}
	else if ( cate === -1 ){
		where = 'art_category>=0';
	}
	else{
		where = 'art_category=' + cate;
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