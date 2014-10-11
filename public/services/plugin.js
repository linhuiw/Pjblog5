// JavaScript Document
var PluginModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

PluginModule.add('remove', function( params ){
	var id = params.query.id;
	if ( id && id.length > 0 && this.fs.clean(contrast('private/plugins/' + id), true) ){
		return { success: true, message: '删除插件成功' };
	}else{
		return { success: false, message: '删除插件失败' };
	}
});

PluginModule.add('install', function( params ){
	var id = params.query.id,
		plugins = require('../library/plugin'),
		pid = 0,
		rets = { success: false, message: '安装插件失败' };
	
	if ( !( id && id.length > 0 ) ){ return rets; };

	if ( this.fs.exist(resolve('private/plugins/' + id + '/config')) ){
		var plus = require('private/plugins/' + id + '/config');
		
		// 增加插件mark的判断
		var hasInstalled = (function(mark, dbo, conn){
			var rec = new dbo.RecordSet(conn), ints = false;
			rec
				.sql("Select id From blog_plugins Where plu_mark='" + mark + "'")
				.process(function(object){
					if ( !object.Bof && !object.Eof ){
						ints = true;
					}
				});
			
			return ints;
		})(plus.mark, this.dbo, this.conn);
		
		if ( hasInstalled ){
			rets.message = '此插件已安装';
			return rets;
		}
		
		plugins.add('dbo', this.dbo);
		plugins.add('conn', this.conn);
		plugins.add('fs', this.fs);
		plugins.add('fso', this.fso);
		plugins.add('fns', this.fns);
		var plugin = new plugins(id);

		try{
			// 插件数据库安装
			plugin.InstallSQL(id, 'install.sql');	
			// 插件信息写入数据库	
			pid = plugin.setup(plus);
			
			if ( pid > 0 ){
				plus.id = pid;
				// 插件缓存
				plugin.AddPluginCacheFile(plus);				
				// 插件导航
				plugin.AddPluginNavFile(plus);				
				// 参数加载
				plugin.AddSettingValue(pid, id);				
				// 首页导航插入
				plugin.AddAssetsNav(pid, plus);				
				// 自定义安装文件
				plugin.InstallBySelf(id, pid, plus, 'install');				
				rets.success = true;
				rets.message = '安装插件成功';
			}
			
		}catch(e){}
		
	}
	
	return rets;
});

PluginModule.add('unInstall', function( params ){
	var id = params.query.id,
		plugins = require('../library/plugin'),
		rets = { success: false, message: '卸载插件失败' };
	
	var plugin = new plugins(id);
		plugin.dbo = this.dbo;
		plugin.conn = this.conn;
		plugin.fs = this.fs;
		plugin.fso = this.fso;
		plugin.fns = this.fns;
	
	try{
		plugin.DeletePluginCacheFile(id);
		plugin.DeletePluginNavFile(id);
		plugin.DeleteSettingValue(id);
		plugin.uninstall(id);
		
		rets.success = true;
		rets.message = '插件卸载成功';
		
	}catch(e){}
	
	return rets;
});

PluginModule.add('RunTheplugin', function( params ){
	var id = params.query.id,
		plugins = require('../library/plugin'),
		rec = new this.dbo.RecordSet(this.conn),
		mark;
		
	rec
		.sql('Select * From blog_plugins Where id=' + id)
		.process(function(object){
			mark = object('plu_mark').value;
			object('plu_stop') = false;
			object.Update();
		}, 3);
		
	var plugin = new plugins();
	plugin.fs = this.fs;
	plugin.ReBuildPluginCacheFileByStatus(mark, false);
	
	return { success: true, message: '插件已成功启动' };
});

PluginModule.add('StopThePlugin', function( params ){
	var id = params.query.id,
		plugins = require('../library/plugin'),
		rec = new this.dbo.RecordSet(this.conn),
		mark;
		
	rec
		.sql('Select * From blog_plugins Where id=' + id)
		.process(function(object){
			mark = object('plu_mark').value;
			object('plu_stop') = true;
			object.Update();
		}, 3);
		
	var plugin = new plugins();
	plugin.fs = this.fs;
	plugin.ReBuildPluginCacheFileByStatus(mark, true);
	
	return { success: true, message: '插件已成功停用' };
});

PluginModule.add('getPluginSettingMessage', function( params ){
	var id = params.query.id,
		rets = { success: false, message: '获取插件配置信息失败', data: {} };
		
	if ( !isNaN(id) ){
		var rec = new this.dbo.RecordSet(this.conn),
			uri = require('private/chips/' + blog.cache + 'blog.uri.plugins');
			
		rets.folder = uri.queens[uri.indexs[id + '']].folder;
		
		rec
			.sql('Select * From blog_params Where par_pid=' + id + ' And par_hide=0')
			.open(1)
			.each(function(object){ rets.data[object('par_keyword').value] = { value: object('par_keyvalue').value, id: object('id').value }; })
			.close();
		
		rets.success = true;
		rets.message = '获取插件配置信息成功';
	}
	
	return rets;
});

PluginModule.add('getPluginSettingTemplate', function(params){
	var f = params.query.folder,
		rets = { success: false, message: '获取模板失败' };
		
	if ( f && f.length > 0 && this.fs.exist(resolve('private/plugins/' + f + '/setting')) ){
		var setor = require('private/plugins/' + f + '/setting');
		rets.data = setor;
		rets.success = true;
		rets.message = '获取模板成功';
	}
	
	return rets;
});

PluginModule.add('SavePluginSetting', function( params ){
	var keys = params.form.par_id,
		values = params.form.par_keyvalue,
		rec;
	
	if ( !Library.type(keys, 'array') ){
		keys = [keys];
		values = [values];
	};
	
	for ( var i = 0 ; i < keys.length ; i++ ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_params Where id=' + keys[i])
			.open(3)
			.update({
				par_keyvalue: values[i]
			})
			.close();
	}
	
	return { success: true, message: '保存信息成功' };
});

return PluginModule;