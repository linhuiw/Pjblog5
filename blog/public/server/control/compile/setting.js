var setting = new Class(function(querys, forms){
	
	this.data = {};
	
	// your code here.
	this.gets();
	
	return this.data;
	
});

// 获取数据
setting.add('gets', function(){
	var rec = new dbo(blog.tb + 'global', blog.conn);
	var json = rec.selectAll().and('id', 1).toJSON()[0];
	this.data.gets = json;
});

// 提交数据
setting.add('sets', function(){
	
});

module.exports = setting;