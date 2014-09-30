var LinkModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('public/library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
		if ( !this.setting ){
			this.getSettingValue();
		}
	}
});

LinkModule.extend('getSettingValue', function(){
	var plugins = require("public/library/plugin");
		plugins.extend("dbo", this.dbo);
		plugins.extend("conn", this.conn);
	var plugin = new plugins();
	
	this.setting = plugin.getSettingParams(this.pid);
});

LinkModule.extend('getList', function( perpage, page ){
	var rec = new this.dbo.RecordSet(this.conn),
		data = [];
		
	rec
		.sql('Select * From blog_links Where link_hide=0')
		.open()
		.each(function(object){
			data.push({
				id: object('id').value,
				link_name: object('link_name').value,
				link_des: object('link_des').value,
				link_src: /^http\:\/\//i.test(object('link_src').value) ? object('link_src').value : 'http://' + object('link_src').value,
				link_type: object('link_type').value,
				link_icon: object('link_icon').value
			});
		})
		.close();
		
	return data;
});

LinkModule.extend('getSideValue', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		data = [];
	
	var sql = 'Select top ' + this.setting.discount + ' * From blog_links Where link_hide=0 And link_index=1';
	if (this.setting.distype != 2) {
		sql += ' And link_type=' + this.setting.distype;
	}
	
	rec
		.sql(sql)
		.open()
		.each(function(object){
			data.push({
				id: object('id').value,
				link_name: object('link_name').value,
				link_des: object('link_des').value,
				link_src: /^http\:\/\//i.test(object('link_src').value) ? object('link_src').value : 'http://' + object('link_src').value,
				link_type: object('link_type').value,
				link_icon: object('link_icon').value
			});
		})
		.close();
		
	return data;
});

return LinkModule;