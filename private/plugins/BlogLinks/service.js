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
		
	if ( !/^http\:\/\//i.test(link_src) ){
		link_src = 'http://' + link_src;
	};
		
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

// 小影添加，增加编辑功能
LinkModule.extend('edit', function( params ){
	var link_name = params.form.link_name,
		link_src = params.form.link_src,
		link_icon = params.form.link_icon,
		link_des = params.form.link_des,
		link_id = params.form.link_id;
		
	if ( !/^http\:\/\//i.test(link_src) ){
		link_src = 'http://' + link_src;
	};
		
	if ( link_name.length === 0 ){
		return { success: false, message: '请填写网站名称' };
	};
	
	if ( link_src.length === 0 ){
		return { success: false, message: '请填写网站链接' };
	};

	if ( link_icon.length > 0 && link_icon.toLowerCase() === 'http://' ){
		link_icon = '';
	};

	if ( link_icon.length === 0 ){
		link_type = 0;
	}else{
		link_type = 1;
	}
	
	link_hide = 0;
	
	try{ 
		var sql = "Update blog_links Set link_name='" + link_name + "',link_src='" + link_src + "',link_icon='" + link_icon + "', link_des='" + link_des + "',link_type=" + link_type + ",link_hide=" + link_hide + " Where id=" + link_id;
		this.conn.Execute(sql);
		return { success: true, message: '编辑友情链接成功' };
	}catch(e){ 
		return { success: false, message: '失败：' + e.message };
	}
});

// 小影添加，通过前台显示链接
LinkModule.extend('index', function(params){
	var id = params.query.id,
		ret = { success: false, message: '前台显示链接链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_links Where id=' + id)
		.open(3)
		.update({
			link_index: true
		})
		.close();
	
	ret.success = true;
	ret.message = '前台显示链接成功';
	
	return ret;
});

LinkModule.extend('unindex', function(params){
	var id = params.query.id,
		ret = { success: false, message: '取消前台显示链接链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_links Where id=' + id)
		.open(3)
		.update({
			link_index: false
		})
		.close();
	
	ret.success = true;
	ret.message = '取消前台显示链接成功';
	
	return ret;
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