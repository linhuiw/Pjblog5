var group = new Class();

group.add('saveCacheFile', function(){
	var caches = require(':public/library/cache');
	var cache = new cache();
	return cache.groups();
});

module.exports = group;