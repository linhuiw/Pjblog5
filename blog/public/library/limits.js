var Limits = new Class();

Limits.add('gets', function(){
	var rec = new dbo(blog.tb + 'levels', blog.conn);
	var indexs = {}, queens = {};
	rec.select('id', 'code_name', 'code_des', 'code_isystem', 'code_mark').open().each(function(object){
		var id = object('id').value,
			name = object('code_name').value,
			des = object('code_des').value,
			sys = object('code_isystem').value,
			mark = object('code_mark').value;
			
		indexs[id + ''] = mark;
		queens[mark] = {
			id: id,
			code_name: name,
			code_des: des,
			code_isystem: sys,
			code_mark: mark
		}
	}).close();
	
	return {indexs: indexs, queens: queens};
});

Limits.add('inst', function(data){
	var id = 0, exist = false;
	var rec = new dbo(blog.tb + 'levels', blog.conn);
		rec.selectAll().and('code_name', data.code_name).or('code_mark', data.code_mark).open().each(function(object){
			exist = true;
		}).close();
		
	if (!exist) {
		data.code_isystem = false;

		rec.resetSQL().create().set(data).save().exec(function(object){
			id = object('id').value;
		}).close();
		
		var caches = require(':public/library/cache');
		var cache = new caches();
		cache.limits();	
	}
	
	return id;
});

Limits.add('save', function(data){
	var success = true, message = '不存在的权限';
	var rec = new dbo(blog.tb + 'levels', blog.conn);
		rec.selectAll().and('id', data.id).open(3).each(function(object){
			if (object('code_isystem').value) {
				success = false;
				message = '系统权限不能修改';
			}else{
				object('code_name') = data.code_name;
				object('code_des') = data.code_des;
				//object('code_mark') = data.code_mark;	// mark不能够改
				object.Update();
				
				message = '修改权限成功';
			}
		}).close();
		
	if (success) {
		var caches = require(':public/library/cache');
		var cache = new caches();
		cache.limits();	
	}
	
	return message;
});

Limits.add('remove', function(id){
	var success = true, message = '不存在的权限';
	var rec = new dbo(blog.tb + 'levels', blog.conn);
		rec.selectAll().and('id', data.id).open(3).each(function(object){
			if (object('code_isystem').value) {
				success = false;
				message = '系统权限不能删除';
			}else{
				object.Delete();
					
				message = '删除权限成功';
			}
		}).close();
		
	if (success) {
		var res = new dbo(blog.tb + 'groups', blog.conn);
		res.selectAll().open(3).each(function(object){
			var ls = object('group_code').value;
			ls = JSON.parse(ls);
			var index = ls.indexOf(id);
			if (index > -1) {
				ls.splice(index, 1);
				
				object('group_code').value = JSON.stringify(ls);
				object.Update();
			}
		}).close();
		
		var caches = require(':public/library/cache');
		var cache = new caches();
		cache.limits();	
		cache.groups();
	}
	
	return message;
});

module.exports = Limits;