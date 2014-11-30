var category = new Class(function(querys, getforms){
	querys.m = querys.m || '';
	
	var categoryPromise = require(':public/library/category');
	
	if ( querys.m.length > 0 && this[querys.m] ){
		return this[querys.m](querys, getforms, categoryPromise);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

module.exports = category;