// JavaScript Document
var LinkModule = new Class({
	initialize: function(){
		if ( !this.dbo ){
			var connect = require('public/library/connect');
			this.dbo = connect.dbo;
			this.conn = connect.conn;
		};
	}
});

LinkModule.extend('post', function( params ){
	var link_name = params.form.link_name,
		link_src = params.form.link_src,
		link_icon = params.form.link_icon,
		link_des = params.form.link_des,
		data = {}, id;
		
	if ( link_name.length === 0 ){
		return { success: false, message: '请填写网站名称' };
	};
	
	if ( link_src.length === 0 ){
		return { success: false, message: '请填写网站链接' };
	};

	data.link_name = link_name;
	data.link_src = link_src;
	if ( link_icon.length > 0 && link_icon.toLowerCase() === 'http://' ){
		data.link_icon = '';
	}else{
		data.link_icon = link_icon;
	};
	data.link_des = link_des;
	if ( link_icon.length === 0 || (link_icon.length > 0 && link_icon.toLowerCase() === 'http://') ){
		data.link_type = 0;
	}else{
		data.link_type = 1;
	}
	
	data.link_hide = true;
	
	var rec = new this.dbo.RecordSet(this.conn), 
		id = 0;
		
	rec
		.sql('Select * From blog_links')
		.on('add', function( object ){
			id = object('id').value;
		})
		.open(2)
		.add(data)
		.close();
		
	if ( id && id > 0 ){
		data.id = id;
		return { success: true, message: '申请友情链接成功', msg: data };
	}else{
		return { success: false, message: '申请友情链接失败' };
	}
});

LinkModule.extend('pass', function(params){
	var id = params.query.id,
		ret = { success: false, message: '通过链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_links Where id=' + id)
		.open(3)
		.update({
			link_hide: false
		})
		.close();
	
	ret.success = true;
	ret.message = '通过链接成功';
	
	return ret;
});

LinkModule.extend('unpass', function(params){
	var id = params.query.id,
		ret = { success: false, message: '取消链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_links Where id=' + id)
		.open(3)
		.update({
			link_hide: true
		})
		.close();
	
	ret.success = true;
	ret.message = '取消链接成功';
	
	return ret;
});

LinkModule.extend('remove', function(params){
	var id = params.query.id,
		ret = { success: false, message: '删除失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_links Where id=' + id)
		.open(3)
		.remove()
		.close();
	
	ret.success = true;
	ret.message = '删除成功';
	
	return ret;
});

return LinkModule;