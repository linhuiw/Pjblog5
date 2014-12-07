var Groups = new Class();

Groups.add('gets', function(){
	var rec = new dbo(blog.tb + 'groups', blog.conn);
	var indexs = {};
	rec.select('id', 'group_name', 'group_code', 'group_isystem').open().each(function(object){
		var id = object('id').value,
			name = object('group_name').value,
			code = JSON.parse(object('group_code').value),
			sys = object('group_isystem').value;
			
		indexs[id + ''] = {
			id: id,
			group_name: name,
			group_code: code,
			group_isystem: sys
		};
	}).close();
	
	return indexs;
});

Groups.add('inst', function(data){
	var id = 0, exist = false;
	var rec = new dbo(blog.tb + 'groups', blog.conn);
		rec.selectAll().and('group_name', data.group_name).open().each(function(object){
			exist = true;
		}).close();
		
	if (!exist) {
		data.group_isystem = false;

		rec.resetSQL().create().set(data).save().exec(function(object){
			id = object('id').value;
		}).close();
		
		var caches = require(':public/library/cache');
		var cache = new caches();
		cache.groups();	
	}
	
	return id;
});

Groups.add('save', function(data){
	var success = true, message = '不存在的分组';
	var rec = new dbo(blog.tb + 'groups', blog.conn);
		rec.selectAll().and('id', data.id).open(3).exec(function(object){
			object('group_name') = data.group_name;
			object('group_code') = data.group_code;
			object.Update();
			
			message = '修改分组成功';
		}).close();
		
	if (success) {
		var caches = require(':public/library/cache');
		var cache = new caches();
		cache.groups();	
	}
	
	return message;
});

Groups.add('remove', function(id){
	var success = true, message = '不存在的分组';
	var rec = new dbo(blog.tb + 'groups', blog.conn);
		rec.selectAll().and('id', id).open(3).exec(function(object){
			if (object('group_isystem').value) {
				success = false;
				message = '系统分组不能删除';
			}else{
				object.Delete();
					
				message = '删除分组成功';
			}
		}).close();
		
	if (success) {	
		var caches = require(':public/library/cache');
		var cache = new caches();
		cache.groups();
	}
	
	return message;
});

module.exports = Groups;