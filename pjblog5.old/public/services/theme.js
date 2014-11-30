// JavaScript Document
var ThemeModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

ThemeModule.add('setup', function( params ){
	var id = params.query.id;
	
	if ( !id || id.length === 0 ){
		return { success: false, message: '参数错误' };
	};

	return this.install(id);
});

ThemeModule.add('downloadFromCloud', function(mark){
	var installer = new Class();
		installer.add('dbo', this.dbo);
		installer.add('conn', this.conn);
		installer.add('fs', this.fs);
		installer.add('fns', this.fns);
		installer.add('utoken', this.utoken);
		installer.add('uopenid', this.uopenid);
		installer.extend(require('./plugin'));
		
		var pluginInstaller = new installer();
		
		var downloaded = pluginInstaller.download({query: {mark: mark}});
		if ( downloaded.success ){
			downloaded = pluginInstaller.unpackpbd({query: {mark: mark}});
			if ( downloaded.success ){
				downloaded = pluginInstaller.install({ query: { id: mark } });
			}
		}
	
	return downloaded;
});

ThemeModule.add('install', function( folder ){
	var ret = { success: false, message: '安装失败' },
		that = this;
	
	if ( this.fs.exist(contrast('private/themes/' + folder), true) ){
		if ( this.fs.exist(resolve('private/themes/' + folder + '/config')) ){
			var mode = require('private/themes/' + folder + '/config'),
				install = { success: true, message: '可以安装' };
			///////////////////////////////////////
			// 检测插件情况
			///////////////////////////////////////
			(function( mode, rec ){
				var marks = mode.plugins;
					
				for ( var i in marks ){
					rec
						.sql("Select id From blog_plugins Where plu_mark='" + marks[i].mark + "'")
						.process(function( object ){
							if ( !object.Bof && !object.Eof ){}else{
								var myinstaller = that.downloadFromCloud(marks[i].mark);
								if ( !myinstaller.success ){
									install.success = false;
									install.message = '缺少插件: ' + marks[i].des + '，且无法从云平台下载';
								}
							}
						});
						
					if ( !install.success ){ break; };
				};
			})( mode, new this.dbo.RecordSet(this.conn) );
			
			// 如果插件没安装齐全
			if ( !install.success ){
				ret.message = install.message;
			}else{
				(function( fs, dbo, conn ){
					if ( fs.exist(resolve('private/themes/' + folder + '/setting')) ){
						var configs = require('private/themes/' + folder + '/setting');
						conn.Execute('Delete From blog_themes');
						for ( var i in configs ){
							var rec = new dbo.RecordSet(conn);
							rec
								.sql('Select * From blog_themes')
								.open(2)
								.add({
									tm_key: i,
									tm_value: configs[i].value
								})
								.close();
						}
						
						that.SaveThemesSettingCacheFile();
					}
				})( this.fs, this.dbo, this.conn );
				///////////////////////////////////////
				// 安装主题到数据库
				///////////////////////////////////////
				(function( mode, rec ){
					rec
						.sql('Select * From blog_global Where id=1')
						.open(3)
						.update({
							blog_theme: folder,
							blog_themename: mode.name,
							blog_thememail: mode.mail,
							blog_themeweb: mode.site
						})
						.close();
						
					ret.success = true;
					ret.message = '安装主题成功';
				})( mode, new this.dbo.RecordSet(this.conn) );
			};
			
			///////////////////////////////////////
			// 更新缓存列表
			///////////////////////////////////////
			if ( ret.success ){
				var SetFile = require('./setting');
				SetFile.add('dbo', this.dbo);
				SetFile.add('conn', this.conn);
				SetFile.add('fs', this.fs);
				var setFileModule = new SetFile();
				setFileModule.ReBuildCacheFile();
			}
		}else{
			ret.message = '安装配置文件不存在';
		}
	}else{
		ret.message = '文件夹[ private/themes/' + folder + ' ]不存在';
	}
	
	return ret;
});

ThemeModule.add('remove', function( params ){
	var id = params.query.id;
	
	if ( !id || id.length === 0 ){
		return { success: false, message: '参数错误' };
	};
	
	var de = this.fs.clean(contrast('private/themes/' + id), true);
	if ( !de ){
		de = this.fs.clean(contrast('private/themes/' + id), true);
	}
	
	if ( de ){
		return { success: true, message: '删除主题成功' };
	}else{
		return { success: false, message: '删除主题失败，可能服务器没有删除文件夹权限！' };
	}
});

ThemeModule.add('GetSettingValue', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		folder,
		ret = { success: false, message: '获取资源失败' };
		
	rec.sql("Select blog_theme From blog_global Where id=1").process(function( object ){ folder = object("blog_theme").value; });
	
	if ( folder && folder.length > 0 ){
		if ( this.fs.exist(contrast('private/themes/' + folder), true) ){
			if ( this.fs.exist(resolve('private/themes/' + folder + '/setting')) ){
				var setting = require('private/themes/' + folder + '/setting'),
					doze = {};
				ret.template = setting;
				
				(function( red ){
					red.sql('Select * From blog_themes').open().each(function( object ){
						doze[object('tm_key').value] = object('tm_value').value;
					}).close();
					ret.data = doze;
				})( new this.dbo.RecordSet(this.conn) );
				
				ret.success = true;
				ret.message = '获取数据成功';
				
			}else{
				ret.message = '主题配置参数文件不存在';
			};
		}else{
			ret.message = '主题文件夹不存在';
		};
	}else{
		ret.message = '参数错误';
	};
	
	return ret;
});

ThemeModule.add('SaveThemesSettingValue', function( params ){
	for ( var i in params.form ){
		var rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql("Select * From blog_themes Where tm_key='" + i + "'")
			.open(3)
			.update({
				tm_key: i,
				tm_value: params.form[i]
			})
			.close();
	}
	
	this.SaveThemesSettingCacheFile();
	
	return { success: true, message: '保存成功' };
});

ThemeModule.add('getSettingContent', function(params){
	var fo = params.query.fo;
	if ( fo && fo.length > 0 ){
		var html = this.fs.getFileContent(resolve('private/themes/' + fo + '/setting'));
		if ( html.length > 0 ){
			return { success: true, message: '获取代码成功', html: html };
		}else{
			return { success: true, message: '获取代码失败' };
		}
	}else{
		return { success: false, message: '参数错误' };
	}
});

ThemeModule.add('SaveThemesSettingCacheFile', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		keys = '\n';
		
	rec
		.sql("Select * From blog_themes")
		.open(3)
		.each(function(object){
			keys += 'exports["' + object('tm_key').value + '"] = ' + JSON.stringify(object('tm_value').value) + ';\n';
		})
		.close();
	
	this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.themes'), keys);
});

ThemeModule.add('saveSettingContent', function(params){
	var code = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.code));
	if ( !code ){ code = ''; };
	var global = require("private/chips/" + blog.cache + "blog.global");
	this.fs.saveFile(resolve('private/themes/' + global.blog_theme + '/setting'), code);
	var configs = require('private/themes/' + global.blog_theme + '/setting');
	
	var rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql("Select * From blog_themes")
			.open(3)
			.each(function(object){
				var name = object('tm_key').value,
					value = object('tm_value').value;
					
				if ( !configs[name] ){
					object.Delete();
				}else{
					delete configs[name];
				}
			})
			.close();
			
	for ( var i in configs ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_themes')
			.open(2)
			.add({
				tm_key: i,
				tm_value: configs[i].value
			})
			.close();
	};
	
	this.SaveThemesSettingCacheFile();
	return { success: true, message: '更新成功' };
});

ThemeModule.add('getThemes', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		ChoosedFolder = "",
		locals = {};
		rec.sql("Select top 1 blog_theme From blog_global").process(function( object ){ ChoosedFolder = object("blog_theme").value; });
	
	var fso = require('fso'),
		fs = new fso();
	
	fs.dirList(contrast("private/themes"), function( name ){
		if ( fs.exist(contrast("private/themes/" + name + "/config.js")) ){
			var mode = require("private/themes/" + name + "/config");
				var local = { folder: name };
				local.name = mode.name;
				local.author = mode.author;
				local.mail = mode.mail;
				local.site = mode.site;
				local.des = mode.des;
				local.icon = mode.icon;
				local.mark = mode.mark;
				local.plugins = mode.plugins;
				local.setting = fs.exist(contrast("private/themes/" + name + "/setting.js"));
				locals[name] = local;
		};
	});
	
	return {themes: locals, current: ChoosedFolder};
});

ThemeModule.add('download', function(params){
	var mark = params.query.mark;
	var global = require("private/chips/" + blog.cache + "blog.global");
	var OAUTH = require('public/library/oauth2');
	var oAuth = new OAUTH(global.blog_appid, global.blog_appkey);
	return oAuth.downloadApplications(mark, this.utoken, this.uopenid, 'themes');
});

ThemeModule.add('unpackpbd', function(params){
	var mark = params.query.mark;
	var fso = require('fso');
	var fs = new fso();
	
	if ( fs.exist(contrast('private/themes/' + mark + '.pbd')) ){
		var ClsPack = require('package');
		var package = new ClsPack();
		fs.createFolder(contrast('private/themes/' + mark))
		package.unPack(contrast('private/themes/' + mark + '.pbd'), contrast('private/themes/' + mark));
		fs.clean(contrast('private/themes/' + mark + '.pbd'));
		return { success: true, message: '解压成功' };
	}else{
		return { success: false, message: '找不到指定的资源文件' };
	}
});

return ThemeModule;