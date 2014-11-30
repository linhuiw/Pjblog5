// JavaScript Document
var PluginModule = new Class({
	initialize: function( folder ){
		this.folder = folder;
	}
});

// 插件信息入库
PluginModule.add('setup', function( params ){
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

PluginModule.add('uninstall', function( id ){
	var rec = new this.dbo.RecordSet(this.conn),
		folder,
		msg = {};
		rec
			.sql('Select * From blog_plugins Where id=' + id)
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					folder = object("plu_folder").value;
					msg.mark = object('plu_mark').value;
					this.remove();
				}
			}, 3);
			
	if ( folder && folder.length > 0 ){
		this.InstallSQL(folder, 'uninstall.sql');
		this.InstallBySelf(folder, id, msg, 'uninstall');
	}
});

// 插件缓存
PluginModule.add('AddPluginCacheFile', function( params ){
	var BlogControlPluginCaches = require('private/chips/' + blog.cache + 'blog.uri.plugins');
	if ( !BlogControlPluginCaches.indexs ){ BlogControlPluginCaches.indexs = {}; };
	if ( !BlogControlPluginCaches.queens ){ BlogControlPluginCaches.queens = {}; };
	BlogControlPluginCaches.indexs[params.id + ''] = params.mark;
	BlogControlPluginCaches.queens[params.mark] = {
		id: params.id,
		name: params.name,
		icon: params.icon,
		folder: this.folder,
		stop: true
	};
	
	var text = '';
	for ( var i in BlogControlPluginCaches ){
		text += 'exports.' + i + ' = ' + JSON.stringify(BlogControlPluginCaches[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.uri.plugins'), text);
});

PluginModule.add('DeletePluginCacheFile', function( id ){
	var BlogControlPluginCaches = require('private/chips/' + blog.cache + 'blog.uri.plugins');
	if ( !BlogControlPluginCaches.indexs ){ BlogControlPluginCaches.indexs = {}; };
	if ( !BlogControlPluginCaches.queens ){ BlogControlPluginCaches.queens = {}; };
	var mark = BlogControlPluginCaches.indexs[id + ''];
	if ( BlogControlPluginCaches.queens[mark] ) { delete BlogControlPluginCaches.queens[mark]; };
	if ( BlogControlPluginCaches.indexs[id + ''] ) { delete BlogControlPluginCaches.indexs[id + '']; };
	
	var text = '';
	for ( var i in BlogControlPluginCaches ){
		text += 'exports.' + i + ' = ' + JSON.stringify(BlogControlPluginCaches[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.uri.plugins'), text);
});

// 插件导航
PluginModule.add('AddPluginNavFile', function( params ){
	if ( params.ControlNavs ){
		var BlogControlPluginNavs = require('private/chips/' + blog.cache + 'blog.control.plugin.navs'),
			text = '';
			
		BlogControlPluginNavs[params.id + ''] = params.ControlNavs;
		for ( var i in BlogControlPluginNavs ){
			text += 'exports["' + i + '"] = ' + JSON.stringify(BlogControlPluginNavs[i]) + ';\n';
		}
		this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.control.plugin.navs'), text);
	}
});

PluginModule.add('DeletePluginNavFile', function( id ){
	var BlogControlPluginNavs = require('private/chips/' + blog.cache + 'blog.control.plugin.navs'),
		text = '';
		
	if ( BlogControlPluginNavs[id + ''] ) { delete BlogControlPluginNavs[id + '']; };
	for ( var i in BlogControlPluginNavs ){
		text += 'exports["' + i + '"] = ' + JSON.stringify(BlogControlPluginNavs[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.control.plugin.navs'), text);
});

PluginModule.add('ReBuildPluginCacheFileByStatus', function( mark, status ){
	var BlogControlPluginCaches = require('private/chips/' + blog.cache + 'blog.uri.plugins'),
		text = '';
		
	if ( BlogControlPluginCaches.queens && BlogControlPluginCaches.queens[mark] ){
		BlogControlPluginCaches.queens[mark].stop = status;
	}
	
	for ( var i in BlogControlPluginCaches ){
		text += 'exports.' + i + ' = ' + JSON.stringify(BlogControlPluginCaches[i]) + ';\n';
	}
	this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.uri.plugins'), text);
});

PluginModule.add('AddSettingValue', function(id, folder){
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

PluginModule.add('DeleteSettingValue', function(id){
	var rec = new this.dbo.RecordSet(this.conn),
		nid;
		
	rec
		.sql('Select * From blog_params Where par_pid=' + id)
		.open(3)
		.each(function(object){
			if ( object('par_hide').value && object('par_keyword').value === 'SYSTEMASSETNAV' ){
				nid = Number(object('par_keyvalue').value);
			};
			object.Delete();
		})
		.close();
		
	if ( nid && nid > 0 ){
		var AssetNav = require('../services/category');
		AssetNav.add('dbo', this.dbo);
		AssetNav.add('conn', this.conn);
		AssetNav.add('fs', this.fs);
		var cate = new AssetNav();
		cate.remove(nid);
	};
});

PluginModule.add('AddAssetsNav', function(id, plus){
	if ( plus.AssetNav ){
		var AssetNav = require('../services/category');
		AssetNav.add('dbo', this.dbo);
		AssetNav.add('conn', this.conn);
		AssetNav.add('fs', this.fs);
		var cate = new AssetNav();

		var cid = cate.add({
			cate_name: plus.AssetNav.name,
			cate_des: plus.AssetNav.des,
			cate_parent: 0,
			cate_src: 'plugin.asp?id=' + id,
			cate_outlink: true,
			cate_isroot: 0,
			cate_order: 99,
			cate_icon: '1.gif'
		});

		if ( cid > 0 ){
			var rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql('Select * From blog_params')
				.open(2)
				.add({
					par_keyword: 'SYSTEMASSETNAV',
					par_keyvalue: cid + '',
					par_pid: id,
					par_hide: true
				})
				.close();
		};
	};
});

PluginModule.add('getSettingParams', function(id){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = {};
		
	rec
		.sql('Select * From blog_params Where par_pid=' + id + ' And par_hide=0')
		.open(1)
		.each(function(object){ rets[object('par_keyword').value] = object('par_keyvalue').value; })
		.close();
		
	return rets;
});

PluginModule.add('InstallSQL', function(folder, file){
	var path = contrast('private/plugins/' + folder + '/' + file);
	if ( this.fs.exist(path) ){
		var content = Library.loader(path);
			
		if ( content.length > 0 ){
			try{
				this.conn.Execute(content);
			}catch(e){}
		}
	}
});

PluginModule.add('InstallBySelf', function(folder, pid, msg, file){
	var path = resolve('private/plugins/' + folder + '/' + file);
	if ( this.fs.exist(path) ){
		var code = require(path);
		code.add('dbo', this.dbo);
		code.add('conn', this.conn);
		code.add('fs', this.fs);
		code.add('fso', this.fso);
		code.add('fns', this.fns);
		try{ new code(folder, pid, msg); }catch(e){}
	}
});

PluginModule.add('hookPort', function(plus, folder, id){
	if ( plus.hook ){
		if ( this.fs.exist(resolve('private/plugins/' + folder + '/hook')) ){
			var m = require('private/plugins/' + folder + '/hook');
			var hooks = require('public/library/hook');
			var hook = new hooks();
			hook.set(id, m);
		}
	}
});

PluginModule.add('hookPop', function(id){
	var BlogControlPluginCaches = require('private/chips/' + blog.cache + 'blog.uri.plugins');
	if ( BlogControlPluginCaches.indexs && BlogControlPluginCaches.indexs[id + ''] ){
		var param = BlogControlPluginCaches.queens[BlogControlPluginCaches.indexs[id + '']];
		if ( param ){
			var folder = param.folder;
			var configs = require('private/plugins/' + folder + '/config');
			if ( configs.hook ){
				if ( this.fs.exist(resolve('private/plugins/' + folder + '/hook')) ){
					var m = require('private/plugins/' + folder + '/hook');
					var hooks = require('public/library/hook');
					var hook = new hooks();
					hook.remove(id, m);
				}
			}
		}
	}
});

return PluginModule;