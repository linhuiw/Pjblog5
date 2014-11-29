var setting = new Class(function(querys, forms){
	
	this.data = {};
	
	// your code here.
	this.data.gets = this.gets();
	
	return this.data;
	
});

// 获取数据
setting.add('gets', function(){
	var rec = new dbo(blog.tb + 'global', blog.conn);
	var json = rec.top(1).selectAll().and('id', 1).toJSON()[0];
	
	return json;
});

// 提交数据
setting.add('sets', function(){
	
});

module.exports = setting;