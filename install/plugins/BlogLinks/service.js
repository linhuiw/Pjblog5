// JavaScript Document
var LinkModule = new Class({});

LinkModule.add('post', function( reqs, post ){
	if (!this.CheckUser()) return { success: false, message: '只有登录用户方能提交友情链接' };

	var form = post();
	var link_name = form.link_name,
		link_src = form.link_src,
		link_icon = form.link_icon,
		link_des = form.link_des,
		data = {}, id;

	if ( link_name.length === 0 ){
		return { success: false, message: '请填写网站名称' };
	};
	
	if ( link_src.length === 0 || link_src.length > 200 ){
		return { success: false, message: '请填写网站链接' };
	};
	
	if ( !/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/i.test(link_src) ){
		return { success: false, message: '错误的链接地址' };
	}	
	
	if ( !/^http\:\/\//i.test(link_src) ){
		link_src = 'http://' + link_src;
	};
	
	if ( !/\/$/i.test(link_src) ){
		link_src = link_src + '/';
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
	
	data.link_hide = this.CheckUser('ControlSystem') ? true : false;
	
	var rec = new dbo(blog.tb + 'links', blog.conn), 
		id = 0, exist = false;
		
	rec.selectAll().and('link_src', data.link_src, ' like ').open().exec(function(object){ exist = true }).close();
	
	if (exist) return { success: false, message: '请不要重复提交友情链接' };
	
	rec.resetSQL().create().set(data).save().exec(function(object){
			id = object('id').value;
		}).close();
		
	if ( id && id > 0 ){
		data.id = id;
		return { success: true, message: '申请友情链接成功', msg: data };
	}else{
		return { success: false, message: '申请友情链接失败' };
	}
});

// 小影添加，增加编辑功能
LinkModule.add('edit', function( reqs, post ){
	if (!this.CheckUser('ControlSystem')) return { success: false, message: '非法操作' };
	
	var form = post();
	var link_name = form.link_name,
		link_src = form.link_src,
		link_icon = form.link_icon,
		link_des = form.link_des,
		link_id = form.link_id;
		
	if ( link_name.length === 0 ){
		return { success: false, message: '请填写网站名称' };
	};
	
	if ( link_src.length === 0 || link_src.length > 200 ){
		return { success: false, message: '请填写网站链接' };
	};
	
	if ( !/^http\:\/\//i.test(link_src) ){
		link_src = 'http://' + link_src;
	};
	
	if ( !/\/$/i.test(link_src) ){
		link_src = link_src + '/';
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
		var sql = "Update " + blog.tb + "links Set link_name='" + link_name + "',link_src='" + link_src + "',link_icon='" + link_icon + "', link_des='" + link_des + "',link_type=" + link_type + ",link_hide=" + link_hide + " Where id=" + link_id;
		blog.conn.Execute(sql);
		return { success: true, message: '编辑友情链接成功' };
	}catch(e){ 
		return { success: false, message: '失败：' + e.message };
	}
});

// 小影添加，通过前台显示链接
LinkModule.add('index', function(reqs, post){
	if (!this.CheckUser('ControlSystem')) return { success: false, message: '非法操作' };
	
	var input = post();
	var id = input.id,
		ret = { success: false, message: '前台显示链接链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new dbo(blog.tb + 'links', blog.conn);
	rec.selectAll().and('id', id).open(3).exec(function(object){
			object('link_index') = true;
			object.Update();
		}).close();
	
	ret.success = true;
	ret.message = '设置链接成功';
	
	return ret;
});

LinkModule.add('unindex', function(reqs, post){
	if (!this.CheckUser('ControlSystem')) return { success: false, message: '非法操作' };
	
	var input = post();
	var id = input.id,
		ret = { success: false, message: '取消前台显示链接链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new dbo(blog.tb + 'links', blog.conn);
	rec.selectAll().and('id', id).open(3).exec(function(object){
			object('link_index') = false;
			object.Update();
		}).close();
	
	ret.success = true;
	ret.message = '取消前台显示链接成功';
	
	return ret;
});

LinkModule.add('pass', function(reqs, post){
	if (!this.CheckUser('ControlSystem')) return { success: false, message: '非法操作' };
	
	var input = post();
	var id = input.id,
		ret = { success: false, message: '通过链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new dbo(blog.tb + 'links', blog.conn);
	rec.selectAll().and('id', id).open(3).exec(function(object){
			object('link_hide') = false;
			object.Update();
		}).close();
	
	ret.success = true;
	ret.message = '通过链接成功';
	
	return ret;
});

LinkModule.add('unpass', function(reqs, post){
	if (!this.CheckUser('ControlSystem')) return { success: false, message: '非法操作' };
	
	var input = post();
	var id = input.id,
		ret = { success: false, message: '取消链接失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new dbo(blog.tb + 'links', blog.conn);
	rec.selectAll().and('id', id).open(3).exec(function(object){
			object('link_hide') = true;
			object.Update();
		}).close();
	
	ret.success = true;
	ret.message = '取消链接成功';
	
	return ret;
});

LinkModule.add('remove', function(reqs, post){
	if (!this.CheckUser('ControlSystem')) return { success: false, message: '非法操作' };
	
	var input = post();
	var id = input.id,
		ret = { success: false, message: '删除失败' };
		
	if ( !id || id.length === 0 ){
		ret.message = 'ID不存在';
		return ret;
	};
	
	var rec = new dbo(blog.tb + 'groups', blog.conn);
		rec.selectAll().and('id', id).open(3).exec(function(object){
			object.Delete();
		}).close();
	
	ret.success = true;
	ret.message = '删除成功';
	
	return ret;
});

module.exports = LinkModule;