var setting = new Class(function(querys, getforms){
	
	if ( blog.user.status < 2 ){
		return { success: false, message: '非法操作' };
	}
	
	var forms = getforms();
	
	var rec = new dbo(blog.tb + 'global', blog.conn);
	
	try{
		rec.top(1).selectAll().open(3).set(forms).save().close();
		
		var caches = require(':public/library/cache');
		var cache = new caches();
		cache.global();
		
		return { success: true };
	}catch(e){
		return { success: false, message: e.message };
	}
});

module.exports = setting;
