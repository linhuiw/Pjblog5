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

ThemeModule.extend('setup', function( params ){
	var id = params.query.id;
	
	if ( !id || id.length === 0 ){
		return { success: false, message: '参数错误' };
	};

	return this.install(id);
});

ThemeModule.extend('install', function( folder ){
	var ret = { success: false, message: '安装失败' };
	
	if ( this.fs.exist(contrast('private/themes/' + folder), true) ){
		if ( this.fs.exist(resolve('private/themes/' + folder + '/config')) ){
			var mode = require('private/themes/' + folder + '/config'),
				install = { success: true, message: '可以安装' };
			///////////////////////////////////////
			// 检测插件情况
			///////////////////////////////////////
			(function( mode, rec ){
				var marks = mode.plugins,
					mark = [];
					
				for ( var i = 0 ; i < marks.length ; i++ ){
					mark.push("plu_mark='" + marks[i] + "'")
				};
				
				if ( mark.length > 0 ){
					rec.sql("Select id From blog_plugins Where " + mark.join(" Or ")).process(function( object ){
						if ( object.RecordCount !== marks.length ){
							install.success = false;
							install.message = '缺少必要的插件，无法安装主题';
						};
					});
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
				SetFile.extend('dbo', this.dbo);
				SetFile.extend('conn', this.conn);
				SetFile.extend('fs', this.fs);
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

ThemeModule.extend('remove', function( params ){
	var id = params.query.id;
	
	if ( !id || id.length === 0 ){
		return { success: false, message: '参数错误' };
	};
	
	this.fs.clean('private/themes/' + id, true);
	
	return { success: true, message: '删除主题成功' };
});

ThemeModule.extend('GetSettingValue', function(){
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

ThemeModule.extend('SaveThemesSettingValue', function( params ){
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
	
	return { success: true, message: '保存成功' };
});

return ThemeModule;