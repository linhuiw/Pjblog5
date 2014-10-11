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

CategoryModule.add('add', function( params ){
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
	
	this.RebuildCacheFile();
		
	return id;
});

CategoryModule.add('addor', function( params ){	
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

CategoryModule.add('SaveIcon', function( params ){
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
	
	this.RebuildCacheFile();
	
	return { success: true, message: '保存ICON成功!' };
});

CategoryModule.add('remover', function( params ){
	return this.remove(params.query.id);
})

CategoryModule.add('remove', function(id){
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
	
	this.RebuildCacheFile();
	
	return { success: true, message: '删除分类成功' };
});

CategoryModule.add('removeCons', function(id, blog_articlecut){
	var rec = new this.dbo.RecordSet(this.conn);
	if ( blog_articlecut === 0 ){
		rec.sql('Select * From blog_articles Where art_category=' + id).open(3).update({art_category: 0}).close();
	}else{
		rec.sql('Select * From blog_articles Where art_category=' + id).open(3).remove().close();
	}
});

CategoryModule.add('removeSelf', function(id, blog_articlecut){
	var rec = new this.dbo.RecordSet(this.conn);
	rec.sql('Select * From blog_categorys Where id=' + id).open(3).remove().close();
	this.removeCons(id, blog_articlecut);
});

CategoryModule.add('UpdateSelf', function(id, blog_categoryremovechild, blog_articlecut){
	var rec = new this.dbo.RecordSet(this.conn);
	if ( blog_categoryremovechild === 0 ){
		rec.sql('Select * From blog_categorys Where id=' + id).open(3).update({cate_parent: 0}).close();
	}else{
		rec.sql('Select * From blog_categorys Where id=' + id).open(3).remove().close();
		this.removeCons(id, blog_articlecut);
	}
});

CategoryModule.add('getMessage', function( params ){
	var id = params.query.id,
		rec = new this.dbo.RecordSet(this.conn),
		rets = { success: true, message: '获取数据成功', data: {} };
		
	rec
		.sql('Select * From blog_categorys Where id=' + id)
		.process(function(object){
			rets.data.id = Number(id);
			rets.data.cate_name = object('cate_name').value;
			rets.data.cate_des = object('cate_des').value;
			rets.data.cate_parent = object('cate_parent').value;
			rets.data.cate_src = object('cate_src').value;
			rets.data.cate_outlink = object('cate_outlink').value;
			rets.data.cate_isroot = object('cate_isroot').value;
		});
		
	return rets;
});

CategoryModule.add('modify', function( params ){
	var id = params.form.id,
		cate_name = params.form.cate_name,
		cate_src = params.form.cate_src,
		cate_des = params.form.cate_des;
	
	var data = { cate_name: cate_name, cate_des: cate_des, cate_src: cate_src };
	
	if ( cate_src && cate_src.length > 0 ){
		data.cate_outlink = true;
	}else{
		data.cate_outlink = false;
	}
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_categorys Where id=' + id)
		.open(3)
		.update(data)
		.close();
	
	this.RebuildCacheFile();
		
	return { success: true, message: '修改分类信息成功', data: data };
});

CategoryModule.add('sort', function( params ){
	var data = JSON.parse(params.form.data.replace(/\&\#34\;/g, '"')),
		rec,
		j = 0;
	
	for ( var i = 0 ; i < data.length ; i++ ){
		var param = data[i],
			id = param.id,
			childs = param.childs;
		
		j++;
		
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_categorys Where id=' + id)
			.process(function(object){
				var cate_outlink = object('cate_outlink').value,
					cate_isroot = false,
					cate_order = j;

				if ( childs.length > 0 ){
					cate_isroot = true;
				}else{
					cate_isroot = false;
				};
				
				if ( cate_outlink ){
					cate_isroot = true;
				};
				
				object('cate_isroot') = cate_isroot;
				object('cate_order') = cate_order;
				object('cate_parent') = 0;
				object.Update();
			}, 3);
			
		this.SortChilds(childs, id);
	}
	
	this.RebuildCacheFile();
	
	return {success: true, message: '排序成功', data: data};
});

CategoryModule.add('SortChilds', function(arrays, parent){
	var rec, j = 0;
	for ( var i = 0 ; i < arrays.length ; i++ ){
		j++;
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_categorys Where id=' + arrays[i])
			.open(3)
			.update({
				cate_isroot: false,
				cate_order: j,
				cate_parent: parent
			})
			.close();
	}
});

CategoryModule.add('list', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		keep = {},
		list = {};
	
	rec
		.sql('Select * From blog_categorys Where cate_outlink=0')
		.open(1)
		.each(function(object){
			var id = object('id').value,
				parent = object('cate_parent').value,
				name = object('cate_name').value;
			
			list[id + ''] = name;
				
			if ( parent === 0 ){
				if ( !keep[id + ''] ){
					keep[id + ''] = {
						name: name,
						items: {}
					};
				}else{
					keep[id + ''].name = name;
					if ( !keep[id + ''].items ){
						keep[id + ''].items = {};
					}
				}
			}else{
				if ( !keep[parent + ''] ){
					keep[parent + ''] = {
						items: {}
					}
				}
				
				keep[parent + ''].items[id + ''] = name;
			}
		})
		.close();
	
	return {
		s: keep,
		k: list
	};
});

CategoryModule.add('RebuildCacheFile', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		indexs = {},
		queen = {};
		
	rec
		.sql('Select * From blog_categorys')
		.open()
		.each(function( object ){
			indexs[object('id').value + ''] = {
				id: object('id').value,
				cate_name: object('cate_name').value,
				cate_des: object('cate_des').value,
				cate_count: object('cate_count').value,
				cate_src: object('cate_src').value,
				cate_outlink: object('cate_outlink').value,
				cate_icon: object('cate_icon').value,
				cate_parent: object('cate_parent').value
			};
			//////////////////////////////////////////////////
			var parents = object('cate_parent').value,
				id = object('id').value;
				
			if ( parents === 0 ){
				if ( !queen[id + ''] ){
					queen[id + ''] = {
						id: object('id').value,
						cate_name: object('cate_name').value,
						cate_des: object('cate_des').value,
						cate_count: object('cate_count').value,
						cate_src: object('cate_src').value,
						cate_outlink: object('cate_outlink').value,
						cate_icon: object('cate_icon').value,
						cate_order: object('cate_order').value,
						cate_parent: object('cate_parent').value,
						items: []
					};
				}else{
					queen[id + ''].id = object('id').value;
					queen[id + ''].cate_name = object('cate_name').value;
					queen[id + ''].cate_des = object('cate_des').value;
					queen[id + ''].cate_count = object('cate_count').value;
					queen[id + ''].cate_src = object('cate_src').value;
					queen[id + ''].cate_outlink = object('cate_outlink').value;
					queen[id + ''].cate_icon = object('cate_icon').value;
					queen[id + ''].cate_order = object('cate_order').value;
					queen[id + ''].cate_parent = object('cate_parent').value;
					if ( !queen[id + ''].items ){
						queen[id + ''].items = [];
					};
				};
			}else{
				if ( !queen[parents + ''] ){
					queen[parents + ''] = {
						items: []
					}
				}
				
				queen[parents + ''].items.push({
					id: object('id').value,
					cate_name: object('cate_name').value,
					cate_des: object('cate_des').value,
					cate_count: object('cate_count').value,
					cate_src: object('cate_src').value,
					cate_outlink: object('cate_outlink').value,
					cate_icon: object('cate_icon').value,
					cate_order: object('cate_order').value,
					cate_parent: object('cate_parent').value
				});
			};
		})
		.close();
		
	var keo = [];
	(function(){
		for ( var i in queen ){
			var items = queen[i].items;
			if ( items && items.length > 0 ){
				var _items = queen[i].items.sort(function( a, b ){
					return a.cate_order - b.cate_order;
				});
				queen[i].items = _items;
			}
			keo.push(queen[i]);
		}
		keo = keo.sort(function( a, b ){
			return a.cate_order - b.cate_order;
		});
	})();
	
	var h = '';
	h += 'exports.indexs = ' + JSON.stringify(indexs) + ';\n';
	h += 'exports.queens = ' + JSON.stringify(keo) + ';';
	this.fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.categorys'), h);
});

return CategoryModule;