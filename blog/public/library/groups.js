var group = new Class();

group.add('getCacheData', function(){
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

group.add('saveCacheFile', function(){
	var status = false;
	fs(contrast(':private/caches/groups.json')).create(JSON.stringify(this.getCacheData())).then(function(){status = true}).fail(function(){status = false;}).stop();
	return status;
});

module.exports = group;
