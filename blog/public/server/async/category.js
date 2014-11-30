var category = new Class(function(querys, getforms){
	querys.m = querys.m || '';
	
	if ( querys.m.length > 0 && this[querys.m] ){
		return this[querys.m](querys, getforms);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

module.exports = category;