// methods for plugin install, such as adding groups, categorys
// you can use all these methods in install.js without require

var methods = new Class();

/* 
	data is json format, contains: 
	mark: mark of the user's limit
	name: name of the user's limit
	des: description of the user's limit
*/
methods.add('AddUserLimit', function( data ){
	var ins = {};
	ins.code_name = data.name;
	ins.code_mark = data.mark;
	ins.code_des = data.des;
	
	var modlimit = require('limits');
	var objlimit = new modlimit();	
	var id = modlimit.inst(ins);
	return id;
});

/* 
	gid: the id of the group
	ids: (array) the ids of the limits
*/
methods.add('AddGroupLimit', function( gid, ids ){
	var rec = new dbo(blog.tb + 'groups', blog.conn);
		rec.selectAll().and('id', gid).open().exec(function(object){
			var codes = object('group_code').value;
			codes = JSON.parse(codes);
			
			for (var i=0; i<codes.length; i++) {
				if (!ids.contains(codes[i])) {
					ids.push(codes[i])
				}
			}
			
		}).close();
	
	var data = {id: gid, group_code: JSON.stringify(ids)};
	
	var modgroup = require('groups');
	var objgroup = new modgroup();	
	modgroup.save(data);
});

/*
	files: (array) file name list
*/
methods.add('CopyToTheme', function( files ) {
	var global = require(':private/caches/global.json');
	var theme = global.blog_theme;
	
	for (var i=0; i<files.length; i++) {
		var source = contrast(':private/plugins/' + this.pfolder + files[i]);
		var target = contrast(':private/themes/' + theme + '/' + files[i]);
		fs(source).copy(target).stop();
	}
});

module.exports = methods;