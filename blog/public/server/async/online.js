var online = new Class(function(querys, getforms){
	
	if ( blog.user.status < 2 ){
		return { success: false, message: '非法操作' };
	}
	
	querys.m = querys.m || '';

	if ( querys.m.length > 0 && this[querys.m] ){
		var Promise = require(':public/library/oauth');
		var BuildPromise = new Promise();
		return this[querys.m](querys, getforms, BuildPromise);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

online.add('wifi', function(querys, getforms, Promise){
	var forms = getforms();
	var name = forms.name;
	var value = forms.value;
	var status = Promise.check(name, value);
	if ( status ){
		return { success: true, message: '文件需要被更新' };
	}else{
		return { success: false, message: '文件已是最新' };
	}
});

online.add('download', function(querys, getforms, Promise){
	var forms = getforms();
	var name = forms.name;
	var status = Promise.repair(name);
	if ( status ){
		return { success: true, message: '文件更新成功' };
	}else{
		return { success: false, message: '文件更新失败' };
	}
});

online.add('UpdateVersion', function(){
	var forms = getforms();
	var id = forms.id;
	var status = Promise.updateVersion(id);
	if ( status ){
		return { success: true, message: '升级成功' };
	}else{
		return { success: false, message: '升级失败' };
	}
});

module.exports = online;