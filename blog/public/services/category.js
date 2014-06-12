// JavaScript Document
var CategoryModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

CategoryModule.extend('add', function( params ){
	var rec = new this.dbo.RecordSet(this.conn),
		id = 0;
		
	rec
		.on('add', function(object){
			id = object('id').value;
		})
		.sql('Select * From blog_categorys')
		.open(2)
		.add(params)
		.close();
		
	return id;
});

CategoryModule.extend('addor', function( params ){	
	var categorys = {
		cate_icon: params.form.cate_icon,
		cate_name: params.form.cate_name,
		cate_des: params.form.cate_des,
		cate_parent: Number(params.form.cate_parent),
		cate_src: params.form.cate_src
	},
	rets = { success: false, message: '添加分类失败' };
	
	if ( categorys.cate_src && categorys.cate_src.length > 0 ){
		categorys.cate_outlink = true;
	}else{
		categorys.cate_outlink = false;
	}
	
	var id = this.add(categorys);
	if ( id > 0 ){
		rets.success = true;
		rets.message = '添加分类成功';
		rets.id = id;
	};
	
	return rets;
});

CategoryModule.extend('SaveIcon', function( params ){
	var id = params.query.id,
		icon = params.query.icon,
		rec = new this.dbo.RecordSet(this.conn);
		
	rec
		.sql('Select * From blog_categorys Where id=' + id)
		.open(3)
		.update({
			cate_icon: icon
		})
		.close();
	
	return { success: true, message: '保存ICON成功!' };
});

CategoryModule.extend('remover', function( params ){
	return this.remove(params.query.id);
})

CategoryModule.extend('remove', function(id){
	var rec = new this.dbo.RecordSet(this.conn),
		childs = [],
		blog_articlecut,
		blog_categoryremovechild,
		i;
	
	rec
		.sql('Select * From blog_categorys Where cate_parent=' + id)
		.open(1)
		.each(function(object){ childs.push(object('id').value); })
		.close();
	
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_global Where id=1')
		.process(function(object){
			blog_articlecut = object('blog_articlecut').value;
			blog_categoryremovechild = object('blog_categoryremovechild').value;
		});
	
	// 删除自身
	this.removeSelf(id, blog_articlecut);
	
	for ( var i = 0 ; i < childs.length ; i++ ){
		this.UpdateSelf(childs[i], blog_categoryremovechild, blog_articlecut);
	}
	
	return { success: true, message: '删除分类成功' };
});

CategoryModule.extend('removeCons', function(id, blog_articlecut){
	var rec = new this.dbo.RecordSet(this.conn);
	if ( blog_articlecut === 0 ){
		rec.sql('Select * From blog_articles Where art_category=' + id).open(3).update({art_category: 0}).close();
	}else{
		rec.sql('Select * From blog_articles Where art_category=' + id).open(3).remove().close();
	}
});

CategoryModule.extend('removeSelf', function(id, blog_articlecut){
	var rec = new this.dbo.RecordSet(this.conn);
	rec.sql('Select * From blog_categorys Where id=' + id).open(3).remove().close();
	this.removeCons(id, blog_articlecut);
});

CategoryModule.extend('UpdateSelf', function(id, blog_categoryremovechild, blog_articlecut){
	var rec = new this.dbo.RecordSet(this.conn);
	if ( blog_categoryremovechild === 0 ){
		rec.sql('Select * From blog_categorys Where id=' + id).open(3).update({cate_parent: 0}).close();
	}else{
		rec.sql('Select * From blog_categorys Where id=' + id).open(3).remove().close();
		this.removeCons(id, blog_articlecut);
	}
});

return CategoryModule;