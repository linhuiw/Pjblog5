// JavaScript Document
var GuestBookModule = new Class({
	initialize: function(){
		var MEMBER = require('public/services/user');
		if ( this.dbo ){
			MEMBER.extend("dbo", this.dbo);
		};
		if ( this.conn ){
			MEMBER.extend("conn", this.conn);
		};
		var member = new MEMBER(),
			uid;
			
		var user = member.loginStatus(function( ret, object ){
			uid = object('id').value;
		});
		
		this.login = user.login;
		this.dbo = member.dbo;
		this.conn = member.conn;
		if ( uid && uid > 0 ){
			this.uid = uid;
		};
	}
});

GuestBookModule.extend('post', function( params ){
	var nick = params.form.nick,
		mail = params.form.mail,
		content = params.form.content,
		data = {},
		date = require('date'),
		nows = date.format(new Date(), 'y/m/d h:i:s');
		
	if ( content.length === 0 ){
		return { success: false, message: '发表留言内容不为空' };
	};
		
	if ( this.login ){
		data.msg_member_id = this.uid;
		data.msg_content = content;
		data.msg_postdate = nows;
		data.msg_reply = '';
		data.msg_username = '';
		data.msg_usermail = '';
	}else{
		data.msg_member_id = 0;
		data.msg_content = content;
		data.msg_postdate = nows;
		data.msg_reply = '';
		data.msg_username = nick;
		data.msg_usermail = mail;
	};
	
	var plugins = require('public/library/plugin');
	
	plugins.extend('dbo', this.dbo);
	plugins.extend('conn', this.conn);

	var plugin = new plugins(),
		setting = plugin.getSettingParams(this.pid);
		
	var delay = setting.delay;

	if ( delay ){
		var time = Number(Session(blog.cache + "_delay")) || 0;
		if ( new Date().getTime() - time < delay ){
			return { success: false, message: '发表留言间隔是' + (delay / 1000) + '秒，请稍后再发表!' };
		}
	};
	
	var rec = new this.dbo.RecordSet(this.conn), 
		id = 0;
		
	rec
		.sql('Select * From blog_messages')
		.on('add', function( object ){
			id = object('id').value;
		})
		.open(2)
		.add(data)
		.close();
		
	if ( id && id > 0 ){
		Session(blog.cache + "_delay") = new Date().getTime();
		return { success: true, message: '发表留言成功', msg: data };
	}else{
		return { success: false, message: '发表留言失败' };
	}
});

GuestBookModule.extend('reply', function(params){
	var id = params.form.id,
		reply = params.form.reply,
		ret = { success: false, message: '回复失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_messages Where id=' + id)
		.open(3)
		.update({
			msg_reply: reply	
		})
		.close();
	
	ret.success = true;
	ret.message = '回复成功';
	
	return ret;
});

GuestBookModule.extend('remove', function(params){
	var id = params.query.id,
		ret = { success: false, message: '删除失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_messages Where id=' + id)
		.open(3)
		.remove()
		.close();
	
	ret.success = true;
	ret.message = '删除成功';
	
	return ret;
});

return GuestBookModule;