var plugin = new Class(function(){
	this.data = {};
	
	this.getInstallPlugins();
	this.getAllPlugins();
	
	var iSets = require('iSet');
	var plugins = require(':public/library/plugin.js');
	var _ = new plugins();
	
	this.data.formatParams = function(id, folder){
		var html = '模板解析错误';
		fs(contrast(':private/plugins/' + folder + '/setting.json')).exist().then(function(){
			var template = require(':private/plugins/' + folder + '/setting.json');
			var data = _.getConfigs(id);
			var _data = {};
			for ( var i in template ){
				if ( data[i] ){
					template[i].value = data[i];
					_data[i] = template[i];
				}
			}
			var iSet = new iSets(_data);
			html = iSet.toHTML();
		});
		return html;
	}
	
	return this.data;
});

plugin.add('getInstallPlugins', function(){
	var rec = new dbo(blog.tb + 'plugins', blog.conn);
	var that = this;
	this.data.installs = {};
	rec.selectAll().open().each(function(object){
		that.data.installs[object('plu_mark').value] = { status: object('plu_stop').value, id: object('id').value };
	}).close();
});

plugin.add('getAllPlugins', function(){
	this.data.plugins = [];
	var that = this;
	fs(contrast(':private/plugins'), true).dirs().value().forEach(function(o){
		var configPath = contrast(':private/plugins/' + o + '/config.json');
		fs(configPath).exist().then(function(){
			var data = require(configPath);
			data.folder = o;
			fs(contrast(':private/plugins/' + o + '/setting.json')).exist().then(function(){ data.setExist = true });
			that.data.plugins.push(data);
		});
	});
});

module.exports = plugin;