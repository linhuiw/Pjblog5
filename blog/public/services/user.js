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

return MemberModule;