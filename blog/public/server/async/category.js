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

module.exports = category;