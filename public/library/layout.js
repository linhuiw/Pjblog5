// JavaScript Document
var LayoutModule = new Class({
	initialize: function(){
		var Member = require("public/services/user"),
			fns = require('fns'),
			http = require('http').http,
			fso = require('fso'),
			fs = new fso(),
			member = new Member(),
			dbo = member.dbo,
			conn = member.conn;
		
		this.dbo = dbo;
		this.conn = conn;
		this.fns = fns;
		this.http = http;
		this.fs = fs;
		this.params = {};
		this.traste = {};
		this.params.error = 0;
		
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

	if ( !State.login ){
		var OAUTH = require('./oauth2');		
		param.href = OAUTH.GetAuthorizeURL(this.params.global.blog_appid, "default.asp");
		param.group = that.GroupLevel(1);
		param.id = 0;
		param.nick = '';
		param.mail = '';
		param.forbit = false;
		param.openid = '';
		param.avatar = '';
	}else{
		if ( param.forbit ){
			this.params.error = 11;
		};
		param.logout = blog.web + "/public/logout.asp";
	};
	
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
	var navs = require('private/chips/' + blog.cache + 'blog.categorys');
	this.add('categorys', navs.queens);
	this.traste.categorys = navs.indexs;
});

LayoutModule.extend('getCategory', function( id ){
	if ( this.traste.categorys && this.traste.categorys[id + ''] ){
		return this.traste.categorys[id + ''];
	};
});

LayoutModule.extend('loadTags', function(){
	var tags = require('private/chips/' + blog.cache + 'blog.tags');
	this.traste.tags = tags;
});

LayoutModule.extend('getTag', function( id ){
	if ( this.traste.tags && this.traste.tags[id + ''] ){
		this.traste.tags[id + ''].href = blog.web + '/default.asp?tag=' + id;
		return this.traste.tags[id + ''];
	};
});

LayoutModule.extend('getTags', function( str ){
	if ( !str || str.length === 0 ){
		return [];
	};
	var ret = [];
	str = str.replace(/^\{/, '').replace(/\}$/, '').split('}{');
	for ( var i = 0 ; i < str.length ; i++ ){
		ret.push(this.getTag(str[i]))
	}
	return ret;
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

LayoutModule.extend('load', function( mark, callback ){
	var PluginCache = require('private/chips/' + blog.cache + 'blog.uri.plugins');
	if ( PluginCache['queens'][mark] ){
		var folder = PluginCache['queens'][mark]['folder'];
		if ( this.fs.exist(resolve('private/plugins/' + folder + '/exports')) ){
			var mode = require('private/plugins/' + folder + '/exports');
			try{
				mode.extend("dbo", this.dbo);
				mode.extend("conn", this.conn);
				mode.extend("fs", this.fs);
				mode.extend("fns", this.fns);
				mode.extend("http", this.http);
			}catch(e){}
			if ( typeof callback === 'function' ){
				var m = callback.call(this, mode);
				if ( m ){
					return m;
				}else{
					return mode;
				}
			}else{
				return mode;
			}
		}
	}
});

LayoutModule.extend('render', function( file ){
	var theme = 'private/themes/' + this.params.global.blog_theme + '/' + file;
	if ( this.fs.exist(contrast(theme)) ){
		include(theme, {
			data: this.params,
			load: Library.proxy(this.load, this),
			dbo: this.dbo,
			conn: this.conn,
			fs: this.fs,
			fns: this.fns
		});
	};
});

return LayoutModule;