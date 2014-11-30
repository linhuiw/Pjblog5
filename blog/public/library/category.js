var category = new Class();

category.add('gets', function(){
	var parent = {}, childs = {}, indexs = {}, queens = [];
	var rec = new dbo(blog.tb + 'categorys', blog.conn);
	rec.selectAll().asc('cate_order').open().each(function(object){
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

module.exports = category;