var LinkModule = new Class({
	initialize: function(){}
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
		
	rec
		.sql('Select top 10 * From blog_links Where link_hide=0')
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