var Limits = new Class();

Limits.add('getCacheData', function(){
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
	
	return {
		indexs: indexs,
		queens: queens
	};
});

Limits.add('saveCacheFile', function(){
	var status = false;
	fs(contrast(':private/caches/limits.json')).create(JSON.stringify(this.getCacheData())).then(function(){status = true}).fail(function(){status = false;}).stop();
	return status;
});

module.exports = Limits;