var plugin = new Class(function(querys, getforms){
	querys.m = querys.m || '';

	if ( querys.m.length > 0 && this[querys.m] ){
		var Promise = require(':public/library/plugin');
		var BuildPromise = new Promise();
		return this[querys.m](querys, getforms, BuildPromise);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

plugin.add('install', function(querys, getforms, Promise){
	var folder = querys.f;
	return Promise.install(folder);
});

plugin.add('uninstall', function(querys, getforms, Promise){
	var id = querys.id;
	return Promise.uninstall(Number(id));
});

module.exports = plugin;