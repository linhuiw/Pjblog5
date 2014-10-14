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

MemberModule.add('adminStatus', function( callback ){
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

MemberModule.add("OauthLogin", function( params ){
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
					object('member_group') = 2;
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

MemberModule.add('logout', function(){
	var cookie = require('cookie');
	cookie.clear(blog.cookie + "_user");
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
		
	var hooks = require('public/library/hook'),
		hook = new hooks();
		
	hook.get('ECM_USER_REMOVE').proxy(this).compile(id);
	
	return ret;
});

MemberModule.add('change', function( params ){
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
				
			var hooks = require('public/library/hook'),
				hook = new hooks();
				
			hook.get('ECM_USER_GROUPCHANGE').proxy(this).compile();
			
			return { success: true, message: '操作成功', gid: gid };
		}catch(e){
			return { success: false, message: e.message };
		}
	}
});

MemberModule.add('searchMembers', function( params ){
	var nick = params.form.nick || '',
		page = params.form.page || 1;
		
	page = Number(page);
	if ( page < 1 ){ page = 1; };
	
	var date = require('date');
	var rec = new this.dbo.RecordSet(this.conn);
	var arrays = [],
	fnCallback = function( object ){
		arrays.push({
			avatar: object("member_avatar").value,
			id: object("id").value,
			group: object("member_group").value,
			nick: object("member_nick").value,
			forbit: object("member_forbit").value,
			sex: object("member_sex").value === 0 ? "保密" : object("member_sex").value === 1 ? "男" : "女",
			mail: object("member_mail").value,
			web: !object("member_website").value ? "" : object("member_website").value,
			logindate: new Date(object("member_logindate").value).getTime() > 0 ? date.format(new Date(object("member_logindate").value), "y-m-d h:i:s") : "",
			birthday: new Date(object("member_birthday").value).getTime() > 0 ? date.format(new Date(object("member_birthday").value), "y-m-d h:i:s") : "",
			address: !object("member_address").value ? "" : object("member_address").value
		});
	};
	
	if ( nick.length > 0 ){
		ac = rec.DualTopPage("blog_members", "*", "member_nick like '%" + nick + "%'", "member_logindate DESC", "member_logindate ASC", 40, page, fnCallback);
	}
	else{
		ac = rec.DualTopPage("blog_members", "*", null, "member_logindate DESC", "member_logindate ASC", 40, page, fnCallback);
	};
	
	return {
		success: true,
		arrays: arrays,
		pages: rec.BuildPage(ac.pageindex, ac.pageCount)
	}
});

return MemberModule;