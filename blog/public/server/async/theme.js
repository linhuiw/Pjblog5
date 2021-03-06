﻿var theme = new Class(function(querys, getforms){
	
	if ( blog.user.status < 2 ){
		return { success: false, message: '非法操作' };
	}
	
	querys.m = querys.m || '';

	if ( querys.m.length > 0 && this[querys.m] ){
		var Promise = require(':public/library/theme');
		var BuildPromise = new Promise();
		return this[querys.m](querys, getforms, BuildPromise);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

theme.add('install', function(querys, getforms, Promise){
	var id = getforms().id;
	return Promise.install(id);
});

theme.add('remove', function(querys, getforms, Promise){
    var id = getforms().id;
	if ( !id || id.length === 0 ){
		return { success: false, message: '删除主题失败' };
	};
	if ( Promise.remove(id) ){
		return { success: true, message: '删除主题成功' };
	}else{
		return { success: false, message: '删除主题失败' };
	}
});

theme.add('setParams', function(querys, getforms, Promise){
	var forms = getforms();
	if ( Promise.saveSetting(forms) ){
		return { success: true, message: '保存自定义参数成功' };
	}else{
		return { success: false, message: '保存自定义参数失败' };
	}
});

module.exports = theme;