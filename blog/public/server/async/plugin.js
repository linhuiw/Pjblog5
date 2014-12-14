var plugin = new Class(function(querys, getforms){

	if ( blog.user.status < 2 ){
		return { success: false, message: '非法操作' };
	}

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
	var id = getforms().id;
	return Promise.install(id);
});

plugin.add('uninstall', function(querys, getforms, Promise){
	var id = getforms().id;
	return Promise.uninstall(Number(id));
});

plugin.add('change', function(querys, getforms, Promise){
	var id = getforms().id;
	if ( Promise.changeStatus(Number(id)) ){
		return { success: true, message: '修改状态成功' };
	}else{
		return { success: false, message: '修改状态失败' };
	}
});

plugin.add('remove', function(querys, getforms, Promise){
    var id = getforms().id;
	if ( !id || id.length === 0 ){
		return { success: false, message: '删除插件失败' };
	};
	if ( Promise.remove(id) ){
		return { success: true, message: '删除插件成功' };
	}else{
		return { success: false, message: '删除插件失败' };
	}
});

plugin.add('setParams', function(querys, getforms, Promise){
	var forms = getforms();
	var id = forms.id;
	
	if ( !id || id.length === 0 ){
		return { success: false, message: '保存自定义参数失败' };
	};
	
	id = Number(id);
	
	if ( id < 1 ){
		return { success: false, message: '保存自定义参数失败' };
	}
	
	delete forms.id;
	
	if ( Promise.setParams(id, forms) ){
		return { success: true, message: '保存自定义参数成功' };
	}else{
		return { success: false, message: '保存自定义参数失败' };
	}
});

module.exports = plugin;