// JavaScript Document
var PluginModule = new Class({
	initialize: function( folder ){
		this.folder = folder;
	}
});

// 插件信息入库
PluginModule.extend('setup', function( params ){
	var rec = new this.dbo.RecordSet(this.conn),
		id = 0,
		installed = false;

	rec.sql("Select * From blog_plugins Where plu_mark='" + params.mark + "'").process(function(object){
		if ( !object.Bof && !object.Eof ){
			installed = true;
		}
	});
	
	if ( !installed ){
		rec = new this.dbo.RecordSet(this.conn);
		
		rec
			.on('add', function(object){ id = object('id').value; })
			.sql('Select * From blog_plugins')
			.open(2)
			.add({
				plu_mark: params.mark,
				plu_name: params.name,
				plu_des: params.des,
				plu_author: params.author,
				plu_mail: params.mail,
				plu_web: params.site,
				plu_icon: params.icon,
				plu_folder: this.folder,
				plu_stop: true
			})
			.close();
	}
	
	return id;
});

PluginModule.extend('uninstall', function( id ){
	var rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_plugins Where id=' + id)
			.open(3)
			.remove()
			.close();
});

// 插件缓存
PluginModule.extend('AddPluginCacheFile', function( params ){
	var BlogControlPluginCaches = require('private/chips/blog.uri.plugins');
	if ( !BlogControlPluginCaches.indexs ){ BlogControlPluginCaches.indexs = {}; };
	if ( !BlogControlPluginCaches.queens ){ BlogControlPluginCaches.queens = {}; };
	BlogControlPluginCaches.indexs[params.id + ''] = params.mark;
	BlogControlPluginCaches.queens[params.mark] = {
		name: params.name,
		icon: params.icon,
		folder: this.folder,
		stop: true
	};
	
	var text = '';
	for ( var i in BlogControlPluginCaches ){
		text += 'exports.' + i + ' = ' + JSON.stringify(BlogControlPluginCaches[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/blog.uri.plugins'), text);
});

PluginModule.extend('DeletePluginCacheFile', function( id ){
	var BlogControlPluginCaches = require('private/chips/blog.uri.plugins');
	if ( !BlogControlPluginCaches.indexs ){ BlogControlPluginCaches.indexs = {}; };
	if ( !BlogControlPluginCaches.queens ){ BlogControlPluginCaches.queens = {}; };
	var mark = BlogControlPluginCaches.indexs[id + ''];
	if ( BlogControlPluginCaches.queens[mark] ) { delete BlogControlPluginCaches.queens[mark]; };
	if ( BlogControlPluginCaches.indexs[id + ''] ) { delete BlogControlPluginCaches.indexs[id + '']; };
	
	var text = '';
	for ( var i in BlogControlPluginCaches ){
		text += 'exports.' + i + ' = ' + JSON.stringify(BlogControlPluginCaches[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/blog.uri.plugins'), text);
});

// 插件导航
PluginModule.extend('AddPluginNavFile', function( params ){
	if ( params.navs ){
		var BlogControlPluginNavs = require('private/chips/blog.control.plugin.navs'),
			text = '';
			
		BlogControlPluginNavs[params.id + ''] = params.navs;
		for ( var i in BlogControlPluginNavs ){
			text += 'exports["' + i + '"] = ' + JSON.stringify(BlogControlPluginNavs[i]) + ';\n';
		}
		this.fs.saveFile(resolve('private/chips/blog.control.plugin.navs'), text);
	}
});

PluginModule.extend('DeletePluginNavFile', function( id ){
	var BlogControlPluginNavs = require('private/chips/blog.control.plugin.navs'),
		text = '';
		
	if ( BlogControlPluginNavs[id + ''] ) { delete BlogControlPluginNavs[id + '']; };
	for ( var i in BlogControlPluginNavs ){
		text += 'exports["' + i + '"] = ' + JSON.stringify(BlogControlPluginNavs[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/blog.control.plugin.navs'), text);
});

PluginModule.extend('ReBuildPluginCacheFileByStatus', function( mark, status ){
	var BlogControlPluginCaches = require('private/chips/blog.uri.plugins'),
		text = '';
		
	if ( BlogControlPluginCaches.queens && BlogControlPluginCaches.queens[mark] ){
		BlogControlPluginCaches.queens[mark].stop = status;
	}
	
	for ( var i in BlogControlPluginCaches ){
		text += 'exports.' + i + ' = ' + JSON.stringify(BlogControlPluginCaches[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/blog.uri.plugins'), text);
});

PluginModule.extend('AddSettingValue', function(id, folder){
	var setFile = 'private/plugins/' + folder + '/setting.js';
	if ( this.fs.exist(resolve(setFile)) ){
		var setor = require(setFile),
			rec;
			
		for ( var i in setor ){
			rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql('Select * From blog_params')
				.open(2)
				.add({
					par_keyword: i,
					par_keyvalue: setor[i].value,
					par_pid: Number(id)
				})
				.close();
		};
	}
});

PluginModule.extend('DeleteSettingValue', function(id){
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_params Where par_pid=' + id)
		.open(2)
		.remove()
		.close();
});

return PluginModule;