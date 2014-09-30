// JavaScript Document
var SetModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

SetModule.extend('save', function( params ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '保存数据库时候出错' };
		
	try{
		rec
			.sql('Select * From blog_global Where id=1')
			.open(3)
			.update(params.form)
			.close();
		
		this.ReBuildCacheFile();
		
		rets.success = true;
		rets.message = '保存数据成功';	
	}catch(e){
		rets.message = e.message;
	};
		
	return rets;
});

SetModule.extend('ReBuildCacheFile', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		params = {},
		h = '';
		
	rec
		.sql('Select * From blog_global Where id=1')
		
		// 自动获取字段名并换成为文件
		.process(function(object){
			for ( var i = 0 ; i < object.fields.count; i++ ){
				params[object.fields(i).name] = object(object.fields(i).name).value;
			}
		});

		for ( var i in params ){
			h += 'exports.' + i + ' = ' + JSON.stringify(params[i]) + ';\n';
		};
	
		this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.global'), h);
});

return SetModule;