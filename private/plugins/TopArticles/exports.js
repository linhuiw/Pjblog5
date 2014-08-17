// JavaScript Document
var TopArticlesModule = new Class({});

TopArticlesModule.extend('getPluginCache', function(){
	var cachefile = require('private/chips/' + blog.cache + 'blog.uri.plugins'),
		outs = {};
	
	try{
		outs = cachefile.queens[this.pmark];
	}catch(e){};
	
	return outs;
});

TopArticlesModule.extend('getSettingValue', function(){
	var plugins = require("public/library/plugin");
		plugins.extend("dbo", this.dbo);
		plugins.extend("conn", this.conn);
	var plugin = new plugins(),
		setting = plugin.getSettingParams(this.getPluginCache().id);
		
	return setting;
});

TopArticlesModule.extend('getSideValue', function(){
	var setting = this.getSettingValue();
	var rec = new this.dbo.RecordSet(this.conn);
	var outs = [];
	var date = require('date');
	
	rec
		.sql('Select top ' + setting.tops + ' * From blog_articles Order By art_postdate DESC')
		.open()
		.each(function( object ){
			outs.push({
				id: object("id").value,
				title: object('art_title').value,
				time: date.format(new Date(object('art_postdate').value), 'y-m/d h:i:s')
			})
		})
		.close();
		
	return outs;
});

return TopArticlesModule;