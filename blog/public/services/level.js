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
		.sql('Select * From blog_levels Where id=' + id)
		.process(function( object ){
			rets.name = object('code_name').value;
			rets.des = object('code_des').value;
			rets.id = id;
			rets.mark = object('code_mark').value;
		});
		
	return rets;
});

LevelModule.extend('addLevelByAuto', function(){
	return this.addLevel("新建权限", '新建权限名称' + new Date().getTime() + " 描述", 'NewLevel');
});

LevelModule.extend('addLevel', function( name, des, mark ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '操作失败', data: {} };
		
	rec
		.sql("Select * From blog_levels Where code_mark='" + mark + "'")
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				rets.message = '权限名称[' + mark + ']已存在，创建失败';
			}else{
				object.AddNew();
				object('code_name') = name;
				object('code_des') = des;
				object('code_mark') = mark;
				object.Update();
				rets.data.id = object('id').value;
				rets.success = true;
				rets.message = '添加权限成功';
			};
		}, 3);
	
	this.ReBuildLevelsCacheFile();
		
	return rets;
});

LevelModule.extend('modifyLevelByForm', function( params ){
	var id = params.form.id,
		code_name = params.form.code_name,
		code_des = params.form.code_des,
		code_mark = params.form.code_mark;
	
	if ( code_mark && code_mark.length > 0 ){
		return this.modifyLevel(id, code_name, code_des, code_mark);
	}else{
		return { success: false, message: '操作失败' };
	}
});

LevelModule.extend('modifyLevel', function( id, name, des, mark ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '操作失败' },
		exist = false;
		
	rec
		.sql("Select * From blog_levels Where code_mark='" + mark + "'")
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
			.sql('Select * From blog_levels Where id=' + id)
			.process(function(object){
				if ( !object('code_isystem').value ){
					oldName = object('code_name').value;
					object('code_name') = name;
					object('code_des') = des;
					object('code_mark') = mark;
					object.Update();
					rets.success = true;
					rets.message = '修改权限成功';
				}else{
					rets.message = '系统权限不能修改';
				}
			},3);
		if ( rets.success ){
			this.ReBuildLevelsCacheFile();
		}
	}else{
		rets.message = '权限名称已存在';
	}
	
	return rets;
});

LevelModule.extend('ReBuildLevelsCacheFile', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		ret = {};
		
	rec
		.sql('Select * From blog_levels')
		.open(1)
		.each(function(object){
			ret[object('id').value + ''] = object('code_mark').value;
		})
		.close();
	
	this.DepartMentCacheFile(ret, resolve('private/chips/blog.levels'));
});

LevelModule.extend('ReBuildGroupsCacheFile', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		ret = {};
		
	rec
		.sql('Select * From blog_groups')
		.open(1)
		.each(function(object){
			ret[object('id').value + ''] = JSON.parse(object('group_code').value);
		})
		.close();
	
	this.DepartMentCacheFile(ret, resolve('private/chips/blog.groups'));
});

LevelModule.extend('DepartMentCacheFile', function( params, file ){
	var h = '';
	for ( var i in params ){
		h += 'exports["' + i + '"] = ' + JSON.stringify(params[i]) + ';\n';
	}
	var fso = require('fso'),
		fs = new fso();
		
	fs.saveFile(file, h);
});

LevelModule.extend('SaveGroupRights', function( params ){
	var j = this.fns.unSQLStr(this.fns.unHTMLStr(params.query.j)),
		rec = new this.dbo.RecordSet(this.conn),
		id = params.query.id;
		
	rec
		.sql('Select * From blog_groups Where id=' + id)
		.open(3)
		.update({
			group_code: j
		})
		.close();
		
	this.ReBuildGroupsCacheFile();
	
	return { success: true, message: '保存权限成功' };
});

LevelModule.extend('LevelRemove', function( params ){
	var id = params.query.id,
		rec = new this.dbo.RecordSet(this.conn),
		mark,
		rets = { success: false, message: '删除权限失败' };
	
	rec
		.sql('Select * From blog_levels Where id=' + id)
		.process(function( object ){
			if ( !object('code_isystem').value ){
				object.Delete();
				rets.success = true;
				rets.message = '删除权限成功';
			}else{
				rets.message = '系统权限不能删除';
			}
		}, 3);
	
	rets.success && this.ReBuildLevelsCacheFile();
		
	return rets;
});

LevelModule.extend('addGroupByAuto', function(){
	return this.addGroup('新建组群', '[]');
});

LevelModule.extend('addGroup', function( name, code ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '操作失败' };
		
	rec
		.sql("Select * From blog_groups")
		.open(2)
		.add({
			group_name: name,
			group_code: code,
			group_isystem: false
		})
		.close();
	
	rets.success = true;
	rets.message = '新增组群成功';
	
	this.ReBuildGroupsCacheFile();
		
	return rets;
});

LevelModule.extend('RemoveGroup', function( params ){
	var rec = new this.dbo.RecordSet(this.conn);
	var id = params.query.id;
	rec.sql('Select * From blog_groups Where id=' + id)
	.open(3)
	.remove()
	.close();
	this.ReBuildGroupsCacheFile();
	return { success: true, message: '删除成功' };
});

LevelModule.extend('getGroupMessage', function( params ){
	var id = params.query.id,
		rec = new this.dbo.RecordSet(this.conn),
		rets = { success: true, message: '获取数据成功' };
	
	rec
		.sql('Select * From blog_groups Where id=' + id)
		.process(function( object ){
			rets.name = object('group_name').value;
			rets.id = id;
		});
		
	return rets;
});

LevelModule.extend('modifyGroupByForm', function( params ){
	var id = params.form.id,
		Group_name = params.form.code_name;
	
	if ( Group_name && Group_name.length > 0 ){
		return this.modifyGroup(id, Group_name);
	}else{
		return { success: false, message: '操作失败' };
	}
});

LevelModule.extend('modifyGroup', function( id, name ){
	var rec = new this.dbo.RecordSet(this.conn),
		rets = { success: false, message: '操作失败' },
		exist = false;

	rec
		.sql('Select * From blog_groups Where id=' + id)
		.process(function(object){
			if ( !object('group_isystem').value ){
				object('group_name') = name;
				object.Update();
				rets.success = true;
				rets.message = '修改组群成功';
			}else{
				rets.message = '系统组群不能修改';
			}
		},3);

	this.ReBuildGroupsCacheFile();
	return rets;
});

return LevelModule;