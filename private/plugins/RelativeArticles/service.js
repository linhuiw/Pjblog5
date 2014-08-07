// JavaScript Document
var RelativeArticlesModule = new Class({
	initialize: function(mark){
		if ( !this.dbo ){
			var connect = require('public/library/connect');
			this.dbo = connect.dbo;
			this.conn = connect.conn;
		};
	}
});

RelativeArticlesModule.extend('getSettingValue', function(){
	var plugins = require('public/library/plugin');
	
	plugins.extend('dbo', this.dbo);
	plugins.extend('conn', this.conn);

	var plugin = new plugins(),
		setting = plugin.getSettingParams(this.pid);
	
	return setting;
});

RelativeArticlesModule.extend('getValue', function(params){
	var id = params.query.id,
		tags = params.form.tags,
		z = [];
	
	if ( tags.length === 0 ){
		return { success: true, message: '获取相关日志成功', data: [] };
	};	
	
	tags = tags.split(',');
	
	for ( var i = 0 ; i < tags.length ; i++ ){
		z.push("art_tags like '%{" + tags[i] + "}%'");
	}
	
	var outs = [];
	if ( z.length > 0 ){
		var setting = this.getSettingValue();
		var tops = setting.tops && Number(setting.tops) > 0 ? setting.tops : 10;
		var rec = new this.dbo.RecordSet(this.conn);
		try{
			rec
				.sql("Select top " + tops + " * From blog_articles Where id<>" + id + " And (" + z.join(" Or ") + ") Order By art_postdate DESC")
				.open()
				.each(function(object){
					outs.push({
						id: object('id').value,
						title: object('art_title').value,
						time: new Date(object('art_postdate').value).getTime(),
						cover: object('art_cover').value,
						href: 'article.asp?id=' + object('id').value
					});
				})
				.close();
		}catch(e){
			return { success: false, message: e.message };
		}
	};
	
	return { success: true, message: '获取相关日志成功', data: outs };
});

return RelativeArticlesModule;