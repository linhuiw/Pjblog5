// JavaScript Document
var OnLineModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

OnLineModule.add('getNewFile', function( params ){
	var id = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.id)),
		crc = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.crc));
	
	var CRCIN = require('../library/crcin');
	var CN = new CRCIN();
	return { success: CN.singleCheck(id, crc) };
});

OnLineModule.add('download', function( params ){
	try{
		var id = this.fns.unSQLStr(this.fns.unHTMLStr(params.query.id));
		var http = require("http"),
			AJAX = http.ajax,
			ajax = new AJAX();

		var fso = require('fso'),
			fs = new fso(),
			n = id,
			m = contrast(n);
				
		fs.autoCreateFolder(m.split('\\').slice(0, -1).join('\\'));
		
		ajax.getBinary(blog.AppPlatForm + '/compile/download.asp?file=' + id, {}, function( ret ){
			var obj = new ActiveXObject(Library.com_stream);
				obj.Type = 1;
				obj.Mode = 3;
				obj.Open();
				obj.Write(ret);
				obj.SaveToFile(m, 2);
				obj.Close();
				obj = null;
		});

		return { success: true };
	}catch(e){
		return { success: false };
	};
});

OnLineModule.add('dosql', function(params){
	var id = params.query.id;
	var AJAX = require('http').ajax;
	var ajax = new AJAX();
	var ret = { success: false, message: '更新失败' };
	try{
		var content = ajax.get(blog.AppPlatForm + '/upgrades/sqls/' + id + '.js', {});
		var wrapper = ['return function (dbo, conn, fs, fns, require) { ', content, '};'].join("\n"),
			__module = (new Function(wrapper))();
		__module(
			this.dbo,
			this.conn,
			this.fs,
			this.fns,
			Library.proxy(require, this)
		);
		blog.version = Number(id);
		var z = '%';
		var h = '<' + z + '\n;var blog = {};\n';
		for ( var i in blog ){
			h += 'blog.' + i + ' = ' + JSON.stringify(blog[i]) + ';\n';
		}
		h += z + '>';
		this.fs.saveFile(contrast('private/configs/configure.asp'), h);
		var m = ';var blog = {};\n';
		m += 'blog.version = ' + blog.version + ';\n';
		m += 'blog.web = "' + blog.web + '";\n';
		m += 'blog.AppPlatForm = "' + blog.AppPlatForm + '";\n';
		m += 'blog.base = "' + blog.base + '";\n';
		m += 'Library.setBase(blog.base);';
		this.fs.saveFile(contrast('private/configs/assets.js'), m);
		ret.success = true;
		ret.message = '更新成功';
	}catch(e){
		ret.message = e.message;
	};
	return ret;
});

return OnLineModule