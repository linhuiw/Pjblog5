// JavaScript Document
var LayoutModule = new Class({
	initialize: function(){
		var Member = require("public/services/user"),
			fns = require('fns'),
			http = require('http').http,
			member = new Member(),
			dbo = member.dbo,
			conn = member.conn;
		
		this.dbo = dbo;
		this.conn = conn;
		this.fns = fns;
		this.http = http;
		this.params = {};
		
		this.Globaltion();
		this.state(member);
	}
});

LayoutModule.extend('add', function( key, value ){
	this.params[key] = value;
});

LayoutModule.extend('state', function( member ){
	var that = this,
		param = {},
		State = member.loginStatus(function(rets, object){
			param.id = object('id').value;
			param.nick = object('member_nick').value;
			param.mail = object('member_mail').value;
			param.group = that.GroupLevel(Number(object('member_group').value));
			param.forbit = object('member_forbit').value;
			param.birthday = new Date(object('member_birthday').value).getTime();
			param.address = object('member_address').value;
			param.sex = object('member_sex').value;
			param.avatar = object('member_avatar').value;
			param.openid = object('member_openid').value;
		});
		
	param.login = State.login;
	this.add('user', param);
});

LayoutModule.extend('GroupLevel', function( id ){
	var GroupCache = require('private/chips/' + blog.cache + 'blog.groups'),
		LevelCache = require('private/chips/' + blog.cache + 'blog.levels'),
		_id = id + '',
		param = [];
		
	if ( GroupCache[_id] ){
		for ( var i = 0 ; i < GroupCache[_id].length ; i++ ){
			var t = GroupCache[_id][i] + '';
			if ( LevelCache[t] ){
				param.push(LevelCache[t]);
			}
		}
	};
	
	return param;
});

LayoutModule.extend('destroy', function(){
	try{
		this.conn.Close();
	}catch(e){}
});

LayoutModule.extend('Globaltion', function(){
	this.add('global', require('private/chips/' + blog.cache + 'blog.global'));
});

LayoutModule.extend('navigation', function(){
	
});

LayoutModule.extend('CheckUrlArguments', function( str ){
	 return this.fns.HTMLStr(this.fns.SQLStr(str));
});

LayoutModule.extend('createServer', function( callback ){
	var that = this;
	if ( this.params.global.blog_status === 0 ){
		this.http.createServer(function( req ){ typeof callback === 'function' && callback.call(that, req); }, Library.proxy(this.CheckUrlArguments, this));
		this.destroy();
	}else{
		this.destroy();
		Response.Redirect("close.asp");
	}
});

return LayoutModule;