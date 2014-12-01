var article = new Class();

article.add('getcates', function(){
	var parent = {}, childs = {}, queens = [];
	var rec = new dbo(blog.tb + 'categorys', blog.conn);
	rec.selectAll().and('cate_outlink', 0).asc('cate_order').asc('id').open().each(function(object){
		var cate = {};
		for ( var i = 0; i < object.fields.count ; i++ ) {
			cate[object.fields(i).name] = object.fields(i).value;
		}
		if (cate.cate_parent === 0){
			parent[cate.id] = cate;
		}else{
			childs[cate.id] = cate;
		}
	}).close();
	
	for (var i in childs) {
		var pid = childs[i].cate_parent;
		if (!parent[pid].items) {
			parent[pid].items = [];
		}
		parent[pid].items.push(childs[i]);
	}
	
	for (var i in parent) {
		queens.push(parent[i]);
	}
	
	return queens;
});

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


module.exports = article;