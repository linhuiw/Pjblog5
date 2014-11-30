var category = new Class();

category.add('gets', function(){
	var parent = {}, childs = {}, indexs = {}, queens = [];
	var rec = new dbo(blog.tb + 'categorys', blog.conn);
	rec.selectAll().asc('cate_order').asc('id').open().each(function(object){
		var cate = {};
		for ( var i = 0; i < object.fields.count ; i++ ) {
			cate[object.fields(i).name] = object.fields(i).value;
		}
		if (cate.cate_parent === 0){
			parent[cate.id] = {id: cate.id};
		}else{
			childs[cate.id] = cate;
		}
		indexs[cate.id] = cate;
	}).close();
	
	for (var i in childs) {
		var pid = childs[i].cate_parent;
		if (!parent[pid].items) {
			parent[pid].items = [];
		}
		parent[pid].items.push(childs[i].id);
	}
	
	for (var i in parent) {
		queens.push(parent[i]);
	}
	
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
	rec.resetSQL().selectAll().and('id', id).open(3).set(data).save().close();
	
	var caches = require(':public/library/cache');
	var cache = new caches();
	cache.categorys();
});

module.exports = category;