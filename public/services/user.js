// JavaScript Document// JavaScript Document
var MemberModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

MemberModule.extend('loginStatus', function( callback ){
	var rec,
		cookie = require('cookie'),
		id = cookie.get(blog.cookie + "_user", "id"),
		hashkey = cookie.get(blog.cookie + "_user", "hashkey"),
		hasdata = true,
		rets = { login: false };
	
	if ( !id || id.length === 0 || isNaN(id) ){
		hasdata = false;
	};
	
	if ( !hashkey || hashkey.length !== 40 ){
		hasdata = false;
	};
	
	if ( hasdata ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_members Where id=' + id)
			.process(function(object){
				if ( !object.Bof && !object.Eof && object('member_hashkey').value === hashkey ){
					rets.login = true;
					typeof callback === 'function' && callback(rets, object);
				}
			});
	}
	
	return rets;
});

MemberModule.extend('adminStatus', function( callback ){
	var logs = this.loginStatus(function(rets, object){ rets.group = object('member_group').value; typeof callback === 'function' && callback(rets, object); });
	
	logs.admin = false;
	
	if ( logs.login ){
		var GroupCache = require('private/chips/' + blog.cache + 'blog.groups'),
			LevelCache = require('Private/chips/' + blog.cache + 'blog.levels');
		
		if ( GroupCache[logs.group + ""] ){
			var levels = GroupCache[logs.group + ""],
				LevelsMarks = [];
				
			for ( var i = 0 ; i < levels.length ; i++ ){
				if ( LevelCache[levels[i] + ""] ){
					LevelsMarks.push(LevelCache[levels[i] + ""]);	
				}
			}
			
			if ( LevelsMarks.indexOf('ControlSystem') > -1 ){
				logs.admin = true;
			}
		}
	}

	return logs;
});

MemberModule.extend("OauthLogin", function( params ){
	var rec = new this.dbo.RecordSet(this.conn),
		ret = { success: false, message: '登录失败' },
		fns = require('fns'),
		sha1 = require('sha1'),
		date = require('date'),
		cookie = require('cookie'),
		id = 0,
		hashkey = sha1.make(fns.randoms(10) + "-" + (new Date().getTime()));
		
	rec
		.sql("Select * From blog_members Where member_openid='" + params.openid + "'")
		.process(function(object){
				if ( object.Bof || object.Eof ){ 
					object.AddNew(); 
					object('member_group') = 1;
				};
				
				object('member_hashkey') = params.hashkey;
				object('member_nick') = params.nick;
				object('member_mail') = params.mail || '';
				object('member_logindate') = date.format(new Date(), 'y/m/d h:i:s');
				object('member_birthday') = date.format(new Date(params.birthday || 0), 'y/m/d h:i:s');
				object('member_address') = params.address || '';
				object('member_website') = params.website || '';
				object('member_sex') = params.sex || 0;
				object('member_avatar') = params.avatar;
				object('member_token') = params.token;
				object('member_openid') = params.openid;
				object.Update();
				
				id = object('id').value;
				hashkey = object('member_hashkey').value;
				ret.success = true;
				ret.message = '登录成功';
		}, 3);

	if ( ret.success ){	
		cookie.set(blog.cookie + "_user", "id", id);
		cookie.set(blog.cookie + "_user", "hashkey", params.hashkey);
		cookie.expire(blog.cookie + "_user", params.expires_in);
	};
		
	return ret;
});

MemberModule.extend('logout', function(){
	var cookie = require('cookie');
	cookie.clear(blog.cookie + "_user");
	return { success: true, message: '退出登录成功' };
});

MemberModule.extend('ChangeStatus', function( params ){
	var id = params.query.id,
		ret = { success: false, message: '操作失败' };
		
	if ( !id || id.length === 0 ){
		return ret;
	};
	
	if ( this.uid === Number(id) ){
		ret.message = '不能操作自己';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_members Where id=' + id)
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				var x = false;
				if ( object('member_forbit').value ){
					this.update({ member_forbit: false });
					x = false;
				}else{
					this.update({ member_forbit: true });
					x = true;
				};
				ret.success = true;
				ret.message = '操作成功';
				ret.status = x;
			}
		}, 3);
	
	return ret;
});

MemberModule.extend('RemoveUser', function( params ){
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
	
	rec = new this.dbo.RecordSet(this.conn);
	rec.sql('Select * From blog_comments Where com_member_id=' + id)
	.open(3).remove().close();
	
	rec = new this.dbo.RecordSet(this.conn);
	rec.sql('Select * From blog_messages Where msg_member_id=' + id)
	.open(3).remove().close();
	
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_members Where id=' + id)
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				this.remove();
				ret.success = true;
				ret.message = '操作成功';
			}
		}, 3);
	
	return ret;
});

MemberModule.extend('change', function( params ){
	var uid = params.query.uid,
		gid = params.query.gid;
		
	if ( isNaN(uid) || isNaN(gid) ){
		return { success: false, message: '参数错误' };
	}else{
		try{
			var rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql('Select * From blog_members Where id=' + uid)
				.open(3)
				.update({
					member_group: gid
				})
				.close();
			return { success: true, message: '操作成功', gid: gid };
		}catch(e){
			return { success: false, message: e.message };
		}
	}
});

return MemberModule;