var user = new Class(function(querys, getforms){

	if ( blog.user.status < 2 ){
		return { success: false, message: '非法操作' };
	}

	querys.m = querys.m || '';

	if ( querys.m.length > 0 && this[querys.m] ){
		var Promise = require(':public/library/user');
		var BuildPromise = new Promise();
		return this[querys.m](querys, getforms, BuildPromise);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

user.add('changeGroup', function(querys, getforms, BuildPromise){
	var forms = getforms(),
		msg = { success: false, message: '操作失败' };
		
	if ( forms.uid && forms.uid.length > 0 && !isNaN(forms.uid) && !isNaN(forms.gid) ){
		msg.success = BuildPromise.save(Number(forms.uid), { member_group: Number(forms.gid) });
		if ( msg.success ){
			msg.message = '操作成功';
		}
	};
	
	return msg;
});

user.add('changeStatus', function(querys, getforms, BuildPromise){
	var forms = getforms(),
		msg = { success: false, message: '操作失败' };
		
	if ( forms.uid && forms.uid.length > 0 && !isNaN(forms.uid) ){
		msg.success = BuildPromise.save(Number(forms.uid), function(object){
			var status = object('member_forbit').value;
			this.set('member_forbit', !status);
			if ( status ){
				msg.word = '正常访问';
			}else{
				msg.word = '拒绝登陆';
			}
		});
		if ( msg.success ){
			msg.message = '操作成功';
		}
	};
	
	return msg;
})

module.exports = user;