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

OnLineModule.extend('getNewFile', function( params ){
	var id = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.id)),
		crc = this.fns.unSQLStr(this.fns.unHTMLStr(params.form.crc));
	
	var CRCIN = require('../library/crcin');
	var CN = new CRCIN();
	return { success: CN.singleCheck(id, crc) };
});

OnLineModule.extend('download', function( params ){
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

return OnLineModule