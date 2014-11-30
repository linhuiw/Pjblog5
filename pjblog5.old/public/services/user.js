// JavaScript Document// JavaScript Document
var MemberModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	},
	__allows__: ['adminStatus', 'logout', 'searchMembers']
});

MemberModule.add('loginStatus', function( callback ){
	return this._loginStatus(callback);
});

MemberModule.add('adminStatus', function( callback ){
	return this._adminStatus(callback);
});

MemberModule.add('logout', function(){
	this._logout();
	return { success: true, message: '退出登录成功' };
});

MemberModule.add('ChangeStatus', function( params ){
	var id = params.query.id,
		ret = { success: false, message: '操作失败' };
		
	if ( !id || id.length === 0 ){
		return ret;
	};
	
	if ( this.uid === Number(id) ){
		ret.message = '不能操作自己';
		return ret;
	};
	
	var o = this._changeStatus(id);
	ret.success = o.success;
	if ( o.success ) { ret.message = '操作成功'; };
	ret.status = o.status;
	
	return ret;
});

MemberModule.add('RemoveUser', function( params ){
	var id = params.query.id,
		ret = { success: false, message: '操作失败' },
		rec;
		
	if ( !id || id.length === 0 ){
		return ret;
	};
	
	if ( this.uid === Number(id) ){
		ret.message = '不能操作自己';
		return ret;
	};
	
	var o = this._removeUser(id);
	ret.success = o;
	if ( o ){
		ret.message = '操作成功';
	}
	
	return ret;
});

MemberModule.add('change', function( params ){
	var uid = params.query.uid,
		gid = params.query.gid;
		
	if ( isNaN(uid) || isNaN(gid) ){
		return { success: false, message: '参数错误' };
	}else{
		if ( this.uid === Number(uid) ){
			return { success: false, message: '不能操作自己' };
		};
		return this._changeGroup(uid, gid);
	}
});

MemberModule.add('searchMembers', function( params ){
	var nick = params.form.nick || '',
		page = params.form.page || 1;
		
	page = Number(page);
	if ( page < 1 ){ page = 1; };
	
	var o = this._searchMembers(nick, page, 40);
	
	return {
		success: true,
		arrays: o.arrays,
		pages: o.pages
	}
});

MemberModule.extend(require('../modules/_user'));

return MemberModule;