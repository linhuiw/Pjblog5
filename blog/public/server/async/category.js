var category = new Class(function(querys, getforms){
	querys.m = querys.m || '';

	if ( querys.m.length > 0 && this[querys.m] ){
		var categoryPromise = require(':public/library/category');
		var BuildCategroyPromise = new categoryPromise();
		return this[querys.m](querys, getforms, BuildCategroyPromise);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

category.add('getdata', function(querys, getforms, categoryPromise){
	var data = categoryPromise.gets(),
		msg = { success: false, message: '获取数据失败' };
	
	if ( data.indexs ){
		msg.success = true;
		msg.message = '获取数据成功';
		msg.data = data;
	};
	
	return msg;
});

category.add('insdata', function(querys, getforms, categoryPromise){
	var id = categoryPromise.inst({cate_parent: Number(getforms.cate_parent)}),
		msg = { success: false, message: '添加分类失败' };
		
	if ( id > 0 ){
		msg.success = true;
		msg.message = '添加分类成功';
		msg.data = {id: id};
	};
	
	return msg;
});

category.add('setdata', function(querys, getforms, categoryPromise){
	var msg = { success: false, message: '保存分类失败' };
		
	try {
		var data = getforms;
		data.id = Number(data.id);
		data.cate_parent = Number(data.cate_parent);
		data.cate_outlink = data.cate_src ? true : false;
		data.cate_order = Number(data.cate_order);
		
		categoryPromise.save(data);
		
		msg.success = true;
		msg.message = '保存分类成功';
	}catch(e){
		msg.message = e.message;
	}

	return msg;
});

category.add('setparent', function(querys, getforms, categoryPromise){
	var msg = { success: false, message: '保存分类失败' };
		
	try {
		var data = {};
		data.id = Number(getforms.id);
		data.cate_parent = Number(getforms.parent);

		categoryPromise.save(data);
		
		msg.success = true;
		msg.message = '保存分类成功';
	}catch(e){
		msg.message = e.message;
	}

	return msg;
});

module.exports = category;