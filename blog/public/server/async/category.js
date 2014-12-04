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
	var id = categoryPromise.inst({
		cate_parent: Number(getforms().pid || 0), 
		cate_icon: 'fa-star', 
		cate_des: '默认描述', 
		cate_name: '默认导航名称', 
		cate_order: 99,
		cate_outlink: 0,
		cate_src: '',
		cate_isroot: 1
	}),
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
		var forms = getforms();
		var data = {};
		data.id = Number(forms.id);
		data.cate_name = forms.cate_name;
		data.cate_des = forms.cate_des;
		data.cate_order = forms.cate_order;
		data.cate_src = forms.cate_src;
		data.cate_outlink = data.cate_src ? true : false;
		if (data.cate_src) {data.cate_parent = 0};
		
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
		var forms = getforms();
		var data = {};
		data.id = Number(forms.id);
		data.cate_parent = Number(forms.parent);

		categoryPromise.save(data);
		
		msg.success = true;
		msg.message = '保存分类成功';
	}catch(e){
		msg.message = e.message;
	}

	return msg;
});

category.add('setsort', function(querys, getforms, categoryPromise){
	var msg = { success: false, message: '保存分类失败' };
	
	try {
		var forms = getforms();

		var cate = {}, sons = [], orders = JSON.parse(forms.orders);
		for (var i=0; i<orders.length; i++) {
			cate = {id: Number(orders[i].id), cate_order: Number(orders[i].order)};
			categoryPromise.save(cate);
			sons = orders[i].children ? orders[i].children[0] : [];
			for (var j=0; j<sons.length; j++) {
				cate = {id: Number(sons[j].id), cate_order: Number(sons[j].order)};
				categoryPromise.save(cate);
			}
		}
		
		msg.success = true;
		msg.message = '保存分类成功';
	}catch(e){
		msg.message = e.message;
	}

	return msg;
});

category.add('seticon', function(querys, getforms, categoryPromise){
	var msg = { success: false, message: '保存图标失败' };
	
	try {
		var forms = getforms();
		var data = {};
		data.id = Number(forms.id);
		data.cate_icon = forms.icon;

		categoryPromise.save(data);
		
		msg.success = true;
		msg.message = '保存图标成功';
	}catch(e){
		msg.message = e.message;
	}

	return msg;	
});

category.add('deldata', function(querys, getforms, categoryPromise){
	var msg = { success: false, message: '删除分类失败' };
	
	try {
		var id = getforms().id;
		id = Number(id);
		if ( categoryPromise.removeCategory(id)	){
			msg.success = true;
			msg.message = '删除分类成功';
		}
	}catch(e){
		msg.message = e.message;
	}

	return msg;	
});

module.exports = category;