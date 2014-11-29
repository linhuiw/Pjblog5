var setting = new Class(function(querys, getforms){
	
	var forms = getforms();
	
	var rec = new dbo(blog.tb + 'global', blog.conn);
	
	try{
		rec.top(1).selectAll().open(3).set(forms).save().close();
		
		return { success: true };
	}catch(e){
		return { success: false, message: e.message };
	}
});

module.exports = setting;
