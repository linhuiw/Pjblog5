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

MemberModule.extend('registor', function( params ){
	var mark = params.form.member_mark,
		nick = params.form.member_nick,
		mail = params.form.member_mail,
		pass = params.form.password,
		rpas = params.form.repeat_password;
		
	if ( !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(mail) ){
		return { success: false, message: '邮箱格式不正确' };
	};
	
	if ( !mark || mark.length < 4 ){
		return { success: false, message: '登入ID必须大于等于4个字' };
	};
	
	if ( !nick || nick.length < 4 ){
		return { success: false, message: '昵称必须大于等于4个字' };
	};
	
	if ( !pass || pass.length < 6 ){
		return { success: false, message: '密码必须大于6个字符串' };
	};
	
	if ( !rpas || rpas.length === 0 ){
		return { success: false, message: '请重复密码' };
	};
	
	if ( pass !== rpas ){
		return { success: false, message: '两次输入的密码不相同' };
	};
	
	return this.regist(mark, nick, mail, pass);
});

MemberModule.extend('regist', function( mark, nick, mail, password ){
	var rec = new this.dbo.RecordSet(this.conn),
		canRegist = true;
	
	rec
		.sql("Select id From blog_members Where member_mark='" + mark + "'")
		.process(function(object){
			if ( !object.Eof && !object.Bof ){
				canRegist = false;
			}
		});
		
	if ( canRegist ){
		var salt = this.fns.randoms(10),
			sha1 = require('sha1'),
			date = require('date'),
			hashkey = sha1.make(password + salt),
			registParams = {
				member_mark: mark,
				member_nick: nick,
				member_salt: salt,
				member_hashkey: hashkey,
				member_mail: mail,
				member_group: 1,
				member_comments: 0,
				member_messages: 0,
				member_forbit: false,
				member_logindate: date.format(new Date(), 'y/m/d h:i:s')
			};
			
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_members')
			.open(2)
			.add(registParams)
			.close();
			
		return { success: true, message: '注册用户成功' };
	}else{
		return { success: false, message: '用户登入ID已被注册' };
	}
});

MemberModule.extend('loginor', function( params ){
	var mark = params.form.UserName,
		pass = params.form.PassWord;
		
	if ( !mark || mark.length < 4 ){
		return { success: false, message: '登入ID必须大于等于4个字' };
	};
	
	if ( !pass || pass.length < 6 ){
		return { success: false, message: '密码必须大于6个字符串' };
	};
	
	return this.login(mark, pass);
});

MemberModule.extend('login', function( mark, pass ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '登入过程出错' },
		that = this;
	
	rec
		.sql("Select * From blog_members Where member_mark='" + mark + "'")
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				var salt = object('member_salt').value,
					hashkey = object('member_hashkey').value,
					id = object('id').value,
					sha1 = require('sha1'),
					date = require('date');
					
				if ( sha1.make(pass + salt) === hashkey ){
					rets.success = true;
					rets.message = '登录成功';
					
					salt = that.fns.randoms(10);
					hashkey = sha1.make(pass + salt);
					object('member_salt') = salt;
					object('member_hashkey') = hashkey;
					object('member_logindate') = date.format(new Date(), 'y/m/d h:i:s');
					object.Update();
					
					(function( cookie ){
						cookie.set(blog.cookie + "_user", "id", id);
						cookie.set(blog.cookie + "_user", "hashkey", hashkey);
						cookie.expire(blog.cookie + "_user", 30 * 24 * 60 * 60 * 1000);
					})( require('cookie') );
				}else{
					rets.message = "密码错误";
				}
					
			}else{
				rets.message = '找不到该用户';
			}
		}, 3);
		
	return rets;
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
		ret = { success: false, message: '登录失败' };
		
	rec
		.sql("Select * From blog_members Where member_openid='" + params.openid + "'")
		.process(function(object){
			var fns = require('fns'),
				sha1 = require('sha1'),
				date = require('date'),
				hashkey = sha1.make(fns.randoms(10) + "-" + (new Date().getTime()));
				
			if ( object.Bof || object.Eof ){ 
				object.AddNew(); 
				object('member_group') = 1;
			};
			
			object('member_hashkey') = hashkey;
			object('member_nick') = params.nick;
			object('member_mail') = params.mail;
			object('member_logindate') = date.format(new Date(), 'y/m/d h:i:s');
			object('member_birthday') = date.format(new Date(params.birthday), 'y/m/d h:i:s');
			object('member_address') = params.address;
			object('member_website') = params.website;
			object('member_sex') = params.sex;
			object('member_avatar') = params.avatar;
			object('member_token') = params.token;
			object('member_openid') = params.openid;
			
			object.Update();
			
			var id = object('id').value;
			
			(function( cookie ){
				cookie.set(blog.cookie + "_user", "id", id);
				cookie.set(blog.cookie + "_user", "hashkey", hashkey);
				cookie.expire(blog.cookie + "_user", 30 * 24 * 60 * 60 * 1000);
			})( require('cookie') );
			
			ret.success = true;
			ret.message = '登录成功';
			
		}, 3);
		
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

return MemberModule;