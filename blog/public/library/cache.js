var cache = new Class();

cache.add('all', function(){
	this.groups();
	this.limits();
	this.global();
	this.categorys();
	this.plugins();
	this.pluNavs();
	this.themes();
	this.tags();
});

// 用户组
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

// 权限
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

// 整站设置
cache.add('global', function(){
	var rec = new dbo(blog.tb + 'global', blog.conn);
	var json = rec.selectAll().and('id', 1).toJSON()[0];
	var data = JSON.stringify(json);
	var success = false;
	fs(contrast(':private/caches/global.json')).create(data).then(function(){success = true}).fail(function(){success = false;}).stop();
	return success;
});

// 分类导航
cache.add('categorys', function(){
	var libcate = require('category');
	var modcate = new libcate();
	
	var data = modcate.gets();
	var success = false;
	fs(contrast(':private/caches/categorys.json')).create(data).then(function(){success = true}).fail(function(){success = false;}).stop();
	return success;
});

// 日志标签
cache.add('tags', function(){
	var json = {};
	var rec = new dbo(blog.tb + 'tags', blog.conn);
	rec.selectAll().asc('id').open().each(function(object){
		json[id] = {
			id: object('id').value,
			tag_name: object('tag_name').value,
			tag_count: object('tag_count').value
		};
	}).close();
	
	var data = JSON.stringify(json);
	var success = false;
	fs(contrast(':private/caches/tags.json')).create(data).then(function(){success = true}).fail(function(){success = false;}).stop();
	return success;
});

module.exports = cache;
