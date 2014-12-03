var tag = new Class();

tag.add('create', function(data){
	if ( !readVariableType(data, 'array') ){
		data = [data];
	};
	try{
		data.forEach(function( o ){
			var rec = new dbo(blog.tb + 'tags', blog.conn);
			var success = function(object){
				var i = object('tag_count').value;
				this.set({ tag_count: ++i });
			};
			var failure = function(){
				this.create().set({
					tag_name: o,
					tag_count: 1
				});
			};
			rec.selectAll().and('tag_name', o).open(3).exec(success, failure).save().close();
		});
		this.buildCacheFile();
		return true;
	}catch(e){ return false; };
});

tag.add('remove', function(data){
	if ( !readVariableType(data, 'array') ){
		data = [data];
	};
	try{
		var ids = [];
		data.forEach(function( o ){
			if ( !isNaN(o) ){
				ids.push(Number(o));
			}
		});
		var rec = new dbo(blog.tb + 'tags', blog.conn);
		rec.selectAll().and('id', ids, 'in').open(3).each(function(object){
			var count = object('tag_count').value;
			if ( count > 1 ){
				count = count - 1;
				object('tag_count') = count;
				this.save();
			}else{
				this.remove();
			}
		}).close();
		this.buildCacheFile();
		return true;
	}catch(e){ return false; };
});

tag.add('get', function(data){
	if ( !readVariableType(data, 'array') ){
		data = [data];
	};
	var cacheData = require(':private/caches/tags.json');
	var arr = [];
	data.forEach(function( o ){
		if ( cacheData[o + ''] ){
			arr.push(cacheData[o + '']);
		};
	});
	
	return arr;
});

tag.add('buildCacheFile', function(){
	var cacheModules = require(':public/library/cache'),
		cacheModule = new cacheModules();
		cacheModule.tags();
});

module.exports = tag;