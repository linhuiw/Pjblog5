var Limits = new Class();

Limits.add('saveCacheFile', function(){
	var caches = require(':public/library/cache');
	var cache = new cache();
	return cache.limits();
});

module.exports = Limits;