// JavaScript Document
var LevelModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

LevelModule.extend('getLevelMessage', function( params ){
	var id = params.query.id,
		rec = new this.dbo.RecordSet(this.conn),
		rets = { success: true, message: '获取数据成功' };
	
	rec
		.sql('Select * From blog_code Where id=' + id)
		.process(function( object ){
			rets.name = object('code_name').value;
			rets.des = object('code_des').value;
			rets.id = id;
		});
		
	return rets;
});

LevelModule.extend('addLevelByForm', function( params ){
	var code_name = params.form.code_name,
		code_des = params.form.code_des;
		
	if ( code_name && code_name.length > 0 ){
		return this.addLevel(code_name, code_des);
	}else{
		return { success: false, message: '操作失败' };
	}
});

LevelModule.extend('addLevelByAuto', function(){
	return this.addLevel('NewLevel' + new Date().getTime(), '新建权限名称' + new Date().getTime());
});

LevelModule.extend('addLevel', function( name, des ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '操作失败', data: {} };
		
	rec
		.sql("Select * From blog_code Where code_name='" + name + "'")
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				rets.message = '权限名称已存在，创建失败';
			}else{
				object.AddNew();
				object('code_name') = name;
				object('code_des') = des;
				object.Update();
				rets.data.id = object('id').value;
				rets.success = true;
				rets.message = '添加权限成功';
			};
		}, 3);
	
	rets.data.name = name;
	rets.data.des = des;
	
	this.AddLevelForAddGroupCode(name);
		
	return rets;
});

LevelModule.extend('AddLevelForAddGroupCode', function( mark, oldName ){
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_groups')
		.open(3)
		.each(function(object){
			var code = JSON.parse(object('group_code').value);
			if ( oldName ){
				if ( mark !== oldName && code[oldName] ){
					code[mark] = code[oldName];
					delete code[oldName];
				}
			}else{
				code[mark] = false;
			}
			object('group_code') = JSON.stringify(code);
			object.Update();
		})
		.close();
});

LevelModule.extend('modifyLevelByForm', function( params ){
	var id = params.form.id,
		code_name = params.form.code_name,
		code_des = params.form.code_des;
	
	if ( code_name && code_name.length > 0 ){
		return this.modifyLevel(id, code_name, code_des);
	}else{
		return { success: false, message: '操作失败' };
	}
});

LevelModule.extend('modifyLevel', function( id, name, des ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '操作失败' },
		exist = false;
		
	rec
		.sql("Select * From blog_code Where code_name='" + name + "'")
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				if ( object('id').value !== Number(id) ){
					exist = true;
				};
			}
		});
		
	if ( !exist ){
		var oldName;
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_code Where id=' + id)
			.process(function(object){
				oldName = object('code_name').value;
				object('code_name') = name;
				object.Update();
			},3);
			
		if ( oldName ){
			this.AddLevelForAddGroupCode(name, oldName);
		};
			
		rets.success = true;
		rets.message = '修改权限成功';
	}else{
		rets.message = '权限名称已存在';
	}
	
	return rets;
});

LevelModule.extend('DeleteLevel', function( id ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: true, message: '删除权限成功' },
		name;
		
	rec
		.sql('Select * From blog_code Where id=' + id)
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				name = object('code_name').value;
				object.Delete();
			};
		}, 3);
		
	if ( name ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_groups')
			.open(3)
			.each(function(object){
				var group_code = object('group_code').value;
				var code = JSON.parse(group_code);
				if ( code[name] ){ delete code[name]; };
				object('group_code') = JSON.stringify(code);
				object.Update();
			})
			.close();
	};
	
	return rets;
});

LevelModule.extend('SaveGroupRights', function( params ){
	var j = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.j)),
		rec = new this.dbo.RecordSet(this.conn),
		id = params.query.id;
		
	rec
		.sql('Select * From blog_groups Where id=' + id)
		.open(3)
		.update({
			group_code: j
		})
		.close();
	
	return { success: true, message: '保存权限成功' };
});

return LevelModule;