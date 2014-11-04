// JavaScript Document
var LayoutModule = new Class(),
	error = require('public/library/error'),
	MemberModule = require("public/services/user"),
	fso = require('fso'),
	http = require('http').http,
	fns = require('fns'),
	member = new MemberModule(),
	fs = new fso();
	
var stop = false;
var value = null;

LayoutModule.add('initialize', function(){
	this.NameSpace = {};
	
	this.NameSpace.reqs = {};
	this.NameSpace.coms = {};
	this.NameSpace.data = {};
	this.NameSpace.sups = {};
	this.error = 0;
	
	this.NameSpace.coms.dbo = member.dbo;
	this.NameSpace.coms.conn = member.conn;
	this.NameSpace.coms.fns = fns;
	this.NameSpace.coms.http = http;
	this.NameSpace.coms.fs = fs;
	
	this.NameSpace.data.theme = { configs: {}, setting: {} };
	this.NameSpace.data.user = {};
	
	this.Globaltion();
	
	if ( this.NameSpace.data.global.blog_status !== 0 ){
		this.destroy();
		Response.Redirect('close.asp');
	}
	
	this.ThemeConfigs();
	this.ThemeSetting();
	this.state(member);
	this.categories();
	this.include();
	this.SupportStatus();
	this.MakePlugin();
	this.position();
	this.loadPlugins();
});

LayoutModule.add('filterRequests', function( str ){
	return this.NameSpace.coms.fns.HTMLStr(this.NameSpace.coms.fns.SQLStr(str));
});

LayoutModule.add('createServer', function( callback ){
	var that = this;

	this.NameSpace.coms.http.createServer(function(reqs){
		that.NameSpace.reqs = reqs;
		typeof callback === 'function' && callback.call(that, this.NameSpace);
	}, Library.proxy(this.filterRequests, this));

	return this;
});

LayoutModule.add('Globaltion', function(){
	this.NameSpace.data.global = require('private/chips/' + blog.cache + 'blog.global');
});

LayoutModule.add('ThemeConfigs', function(){
	var configs = {};
	configs.folder = this.NameSpace.data.global.blog_theme;
	var ThemeModule = require('private/themes/' + configs.folder + '/config');
	if ( ThemeModule ){
		configs.name = ThemeModule.name;
		configs.author = ThemeModule.author;
		configs.mail = ThemeModule.mail;
		configs.site = ThemeModule.site;
		configs.des = ThemeModule.des;
		configs.icon = blog.web.replace(/\/$/, '') + '/private/themes/' + configs.folder + '/' + ThemeModule.icon;
		configs.mark = ThemeModule.mark;
		configs.plugins = ThemeModule.plugins;
	};

	this.NameSpace.data.theme.configs = configs;
	this.NameSpace.data.theme.dir = 'private/themes/' + configs.folder;
});

LayoutModule.add('ThemeSetting', function(){
	this.NameSpace.data.theme.setting = require('private/chips/' + blog.cache + 'blog.themes');
});

LayoutModule.add('state', function( member ){
	var param = {},
		State = member.loginStatus(function(rets, object){
			param.id = object('id').value;
			param.nick = object('member_nick').value;
			param.mail = object('member_mail').value;
			param.group = Number(object('member_group').value);
			param.forbit = object('member_forbit').value;
			param.birthday = new Date(object('member_birthday').value).getTime();
			param.address = object('member_address').value;
			param.sex = object('member_sex').value;
			param.avatar = object('member_avatar').value;
			param.openid = object('member_openid').value;
			param.token = object('member_token').value;
		});
	
	param.login = State.login;

	if ( !State.login ){		
		param.href = blog.web + '/jump.asp?timestrap=' + new Date().getTime();
		param.group = this.GroupLevel(1);
		param.id = 0;
		param.nick = '';
		param.mail = '';
		param.forbit = false;
		param.openid = '';
		param.token = '';
		param.avatar = '';
	}else{
		if ( param.forbit ){ this.params.error = 20001; };
		param.group = this.GroupLevel(param.group);
		param.logout = blog.web + "/public/logout.asp";
	};
	
	this.NameSpace.data.user = param;
});

LayoutModule.add('GroupLevel', function( id ){
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

LayoutModule.add('destroy', function(){
	try{
		this.NameSpace.coms.conn.Close();
	}catch(e){}
});

LayoutModule.add('checkStatus', function( mark ){
	return this.NameSpace.data.user.group.indexOf(mark) > -1;
});
LayoutModule.add('SupportStatus', function(){
	var that = this;
	this.NameSpace.sups.checkStatus = function(mark){
		return that.NameSpace.data.user.group.indexOf(mark) > -1;
	}
});

LayoutModule.add('categories', function(){
	var navs = require('private/chips/' + blog.cache + 'blog.categorys');
	this.NameSpace.data.categories = {};
	this.NameSpace.data.categories.indexs = navs.indexs;
	this.NameSpace.data.categories.queens = navs.queens;
});

LayoutModule.add('getCategoryItem', function( id ){
	if ( !this.NameSpace.data.categories ){
		this.categories();
	};
	
	if ( this.NameSpace.data.categories && this.NameSpace.data.categories.indexs && this.NameSpace.data.categories.indexs[id + ''] ){
		return this.NameSpace.data.categories.indexs[id + ''];
	}
});

LayoutModule.add('tags', function(){
	var tags = require('private/chips/' + blog.cache + 'blog.tags');
	this.NameSpace.data.tags = tags;
});

LayoutModule.add('getTagByID', function( id ){
	if ( !this.NameSpace.data.tags ){
		this.tags();
	};
	
	if ( this.NameSpace.data.tags && this.NameSpace.data.tags[id + ''] ){
		this.NameSpace.data.tags[id + ''].href = blog.web + '/default.asp?tag=' + id;
		return this.NameSpace.data.tags[id + ''];
	};
});

LayoutModule.add('getTagsByArray', function( str ){
	if ( !str || str.length === 0 ){
		return [];
	};

	var ret = [];
	str = str.replace(/^\{/, '').replace(/\}$/, '').split('}{');
	
	for ( var i = 0 ; i < str.length ; i++ ){
		var z = this.getTagByID(str[i]);
		z && ret.push(z);
	}
	
	return ret;
});

LayoutModule.add('then', function( callback ){
	if ( stop ){ return this; };
	
	if ( this.error === 0 ){
		if ( typeof callback === 'function' ){
			value = callback.call(this, value) || null;
		}
	}else{
		if ( this.ErrorCallback && typeof this.ErrorCallback === 'function' ){
			this.ErrorCallback.call(this, error[this.error + ''] || '未找到错误信息', this.error);
			stop = true;
		}
	}
	
	return this;
});

LayoutModule.add('reject', function( callback ){
	if ( typeof callback === 'function' ){
		this.ErrorCallback = callback;
	}
	
	return this;
});

LayoutModule.add('include', function(){
	var that = this;
	this.NameSpace.sups.include = function(file){
		var theme = 'private/themes/' + that.NameSpace.data.global.blog_theme + '/' + file;
		if ( that.NameSpace.coms.fs.exist(contrast(theme)) ){
			include(theme, {
				reqs: that.NameSpace.reqs,
				coms: that.NameSpace.coms,
				data: that.NameSpace.data,
				sups: that.NameSpace.sups
			});
		};
	}
});

LayoutModule.add('render', function(file){
	return this.then(function(){ this.NameSpace.sups.include(file); });
});

LayoutModule.add('errorender', function(file){
	var theme = 'private/themes/' + this.NameSpace.data.global.blog_theme + '/' + file;
	if ( this.NameSpace.coms.fs.exist(contrast(theme)) ){
		include(theme, {
			reqs: this.NameSpace.reqs,
			coms: this.NameSpace.coms,
			data: this.NameSpace.data,
			sups: this.NameSpace.sups,
			error: error[this.error + ''] || '未找到错误信息',
			errorid: this.error
		});
	};
	return this;
});

LayoutModule.add('loadPlugins', function(){
	var that = this;
	var PluginCache = require('private/chips/' + blog.cache + 'blog.uri.plugins');
	this.NameSpace.sups.plugins = function(args){
		var pmark = that.NameSpace.data.plugin.mark;
		var pfolder = PluginCache['queens'][pmark]['folder'];
		var pid = PluginCache['queens'][pmark]['id'];
		
		if ( !PluginCache['queens'][pmark].stop ){
			var plugin = new Class();
				plugin.add("dbo", that.NameSpace.coms.dbo);
				plugin.add("conn", that.NameSpace.coms.conn);
				plugin.add("fs", that.NameSpace.coms.fs);
				plugin.add("fns", that.NameSpace.coms.fns);
				plugin.add("http", that.NameSpace.coms.http);
				plugin.add("pid", pid);
				plugin.add("pmark", pmark);
				plugin.add("pfolder", pfolder);
				
			var packages = new Class();
				packages.extend(require("public/library/plugin")).extend(plugin);
			
			if ( that.NameSpace.coms.fs.exist(resolve('private/plugins/' + pfolder + '/exports')) ){
				plugin.extend(require('private/plugins/' + pfolder + '/exports'));
			}

			var package = new packages(),
				setting = package.getSettingParams(Number(pid));
			
			var plus = new plugin();
			
			var params = {
				package: plus,
				setting: setting || {}
			};
			
			if ( args ){
				for ( var i in args ){
					if ( !params[i] ){
						params[i] = args[i];
					}
				}
			}

			return params;
			
		};
	};
});

LayoutModule.add('MakePlugin', function(){
	var that = this;
	var PluginCache = require('private/chips/' + blog.cache + 'blog.uri.plugins');
	this.NameSpace.sups.plugin = function(mark, args){
		var data = that.NameSpace.data;
		if ( data.theme.configs.plugins && data.theme.configs.plugins[mark] ){
			var pmark = data.theme.configs.plugins[mark].mark;
			var pfile = data.theme.dir + '/' + data.theme.configs.plugins[mark].file;
			if ( PluginCache['queens'][pmark] ){
				var pfolder = PluginCache['queens'][pmark]['folder'];
				var pid = PluginCache['queens'][pmark]['id'];
				if ( !PluginCache['queens'][pmark].stop ){
					var plugin = new Class();
						plugin.add("dbo", that.NameSpace.coms.dbo);
						plugin.add("conn", that.NameSpace.coms.conn);
						plugin.add("fs", that.NameSpace.coms.fs);
						plugin.add("fns", that.NameSpace.coms.fns);
						plugin.add("http", that.NameSpace.coms.http);
						plugin.add("pid", pid);
						plugin.add("pmark", pmark);
						plugin.add("pfolder", pfolder);
						
					var packages = new Class();
						packages.extend(require("public/library/plugin")).extend(plugin);
					
					if ( that.NameSpace.coms.fs.exist(resolve('private/plugins/' + pfolder + '/exports')) ){
						plugin.extend(require('private/plugins/' + pfolder + '/exports'));
					}

					var package = new packages(),
						setting = package.getSettingParams(Number(pid));
					
					var plus = new plugin();
					
					var params = {
						package: plus,
						setting: setting || {}
					};
					
					if ( args ){
						for ( var i in args ){
							if ( !params[i] ){
								params[i] = args[i];
							}
						}
					}
		
					include(pfile, params);
					
				};
			};
		};
	};
});

LayoutModule.add('position', function(){
	var that = this;
	this.NameSpace.sups.position = function(pos){
		if ( pos === 'home' ){
			return that.NameSpace.data.actives && that.NameSpace.data.actives.category && that.NameSpace.reqs.query.cate && that.NameSpace.reqs.query.cate === -1 ? true : false;
		}
		else if ( pos === 'category' ){
			return that.NameSpace.data.actives && that.NameSpace.data.actives.category && that.NameSpace.reqs.query.cate && that.NameSpace.reqs.query.cate > 0 ? true : false;
		}
		else if ( pos === 'undercategory' ){
			return that.NameSpace.data.actives && that.NameSpace.data.actives.category && that.NameSpace.reqs.query.cate && that.NameSpace.reqs.query.cate === 0 ? true : false;
		}
		else if ( pos === 'draft' ){
			return that.NameSpace.data.actives && that.NameSpace.data.actives.category && that.NameSpace.reqs.query.cate && that.NameSpace.reqs.query.cate === -2 ? true : false;
		}
		else if ( pos === 'tag' ){
			return that.NameSpace.data.actives && that.NameSpace.data.actives.tag ? true : false;
		}
		else if ( pos === 'article' ){
			return that.NameSpace.data.article ? true : false;
		}
		else if ( pos === 'plugin' ){
			return that.NameSpace.data.plugin ? true : false;
		}
		else if ( pos === 'close' ){
			return that.NameSpace.data.global.blog_status !== 0 ? true : false;
		}
		else if ( pos === 'error' ){
			return that.error !== 0 ? true : false;
		}
		else{
			return false;
		}
	}
});

return LayoutModule;