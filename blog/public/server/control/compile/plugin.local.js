var plugin = new Class(function(){
	this.data = {};
	
	this.getInstallPlugins();
	this.getAllPlugins();
	
	return this.data;
});

plugin.add('getInstallPlugins', function(){
	var rec = new dbo(blog.tb + 'plugins', blog.conn);
	var that = this;
	this.data.installs = {};
	rec.selectAll().open().each(function(object){
		that.data.installs[object('plu_mark').value] = { status: object('plu_stop').value };
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
			that.data.plugins.push(data);
		});
	});
});

module.exports = plugin;