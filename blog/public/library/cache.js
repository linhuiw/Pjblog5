var cache = new Class();

cache.add('all', function(){
	this.groups();
	this.limits();
});

cache.add('groups', function(){
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
	
	var data = JSON.stringify(indexs);
	var success = false;
	fs(contrast(':private/caches/groups.json')).create(data).then(function(){success = true}).fail(function(){success = false;}).stop();
	return success;
});

cache.add('limits', function(){
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
	
	var data = JSON.stringify({indexs: indexs, queens: queens});
	var success = false;
	fs(contrast(':private/caches/limits.json')).create(data).then(function(){success = true}).fail(function(){success = false;}).stop();
	return success;
});

module.exports = cache;
