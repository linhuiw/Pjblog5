// JavaScript Document
var TopArticlesModule = new Class(function( id, mark, folder ){
	this.setting = this.getSetting(id);
});

TopArticlesModule.add('getSetting', function(id){
	var PluginModules = require(':public/library/plugin'),
		PluginModule = new PluginModules();
	
	return PluginModule.getConfigs(id);
});

TopArticlesModule.add('getModuleData', function(){
	var rec = new dbo(blog.tb + 'articles', blog.conn), data = [], that = this;
	rec.selectAll().top(this.setting.tops).and('art_draft', 0).desc('art_postdate').open().each(function(object){
		var _ = {};
		_.id = object('id').value;
		_.art_title = object('art_title').value;
		_.art_postdate = date.format(new Date(object('art_postdate').value), that.setting.datetype);
		_.src = iPress.setURL('page', 'article', { id: object('id').value });
		data.push(_);
	}).close();
	
	return data;
});

module.exports = TopArticlesModule;