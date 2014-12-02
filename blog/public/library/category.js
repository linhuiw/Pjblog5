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

module.exports = category;