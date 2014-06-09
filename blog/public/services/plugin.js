// JavaScript Document// JavaScript Document
var PluginModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

PluginModule.extend('remove', function( params ){
	var id = params.query.id;
	if ( id && id.length > 0 && this.fs.clean(contrast('private/plugins/' + id), true) ){
		return { success: true, message: '删除插件成功' };
	}else{
		return { success: false, message: '删除插件失败' };
	}
});

PluginModule.extend('install', function( params ){
	var id = params.query.id;
	if ( id && id.length > 0 ){
		return { success: true, message: '安装插件成功' };
	}else{
		return { success: false, message: '安装插件失败' };
	}
});

return PluginModule;