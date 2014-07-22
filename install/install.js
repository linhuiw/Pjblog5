// JavaScript Document
var plat = 'http://app.webkits.cn';
function randoms(l){
	var x = "123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
 	var tmp="";
 	for( var i = 0 ; i < l; i++ ) {
 		tmp += x.charAt(Math.ceil(Math.random()*100000000) % x.length);
 	}
 	return tmp;
};

exports.submit = function( http ){
	var folder = http.form("folder").replace(/\\$/, '').replace(/^\\/, '').replace(/\\/g, '/'),
		name = http.form("name"),
		dbname = http.form("dbname"),
		dbip = http.form("dbip"),
		dbusername = http.form("dbusername"),
		dbpassword = http.form("dbpassword"),
		appid = http.form("appid"),
		appkey = http.form("appkey"),
		web = http.form("web").replace(/\/$/, '');
		
	var fso = require('../appjs/service/tron.fso');
	var fs = new fso();

	var jsons = {};
	jsons.folder = folder;
	jsons.name = name;
	jsons.dbname = dbname;
	jsons.dbusername = dbusername;
	jsons.dbpassword = dbpassword;
	jsons.dbip = dbip;
	jsons.appid = appid;
	jsons.appkey = appkey;
	jsons.web = web;
	
	var h = '';
	for ( var i in jsons ){
		h += 'exports.' + i + ' = ' + JSON.stringify(jsons[i]) + ';\n';
	};
	fs.saveFile(resolve('./data'), h);
};

exports.setup = function(){
	var data = require('./data');
	var fso = require('../appjs/service/tron.fso');
	var fs = new fso();
	
	blog.base = data.folder;
	blog.connection = {"netserver": data.dbip,"access":data.dbname,"username":data.dbusername,"password":data.dbpassword};
	blog.cookie = randoms(10);
	blog.cache = randoms(10) + '.';
	blog.AppPlatForm = plat;
	blog.web = data.web + '/' + blog.base;
	blog.version = 1;
	
	var assets = ';var blog = {};\n', service = ';var blog = {};\n', ps = '%';
	
	assets += 'blog.version = ' + blog.version + ';\n';
	assets += 'blog.web = "' + blog.web + '";\n';
	assets += 'blog.AppPlatForm = "' + blog.AppPlatForm + '";\n';
	assets += 'Library.setBase("' + blog.base + '");'
	fs.saveFile(resolve('../private/configs/assets'), assets);
	
	for ( var i in blog ){
		service += 'blog.' + i + ' = ' + JSON.stringify(blog[i]) + ';\n';
	}
	
	service = '<' + ps + '\n' + service + ps + '>';
	
	fs.saveFile(contrast('../private/configs/configure.asp'), service);
};

exports.dbexcute = function(){
	var data = require('./data');
	var connect = require('public/library/connect');
	var dbo = connect.dbo;
	var conn = connect.conn;
	
	var ret = { success: false, message: '数据操作失败' },
		content;
	
	var o = new ActiveXObject(Library.com_stream);
		o.Type = 2; o.Mode = 3; 
		o.Open(); 
		o.LoadFromFile(contrast('./sql/install.sql'));
		content = o.ReadText;
		o.Close;
		
	try{
		conn.Execute(content);
		ret.success = true;
		ret.message = '生成数据库成功';
	}catch(e){
		ret.message = e.message;
	}
	
	conn.Execute("Update blog_global Set blog_name='" + data.name + "', blog_title='" + data.name + "', blog_appid=" + data.appid + ",blog_appkey='" + data.appkey + "' Where id=1");
	
	var id = conn.Execute('Select top 1 id From blog_categorys Where cate_outlink=0 And cate_isroot=1')(0).value;
	conn.Execute('Update blog_articles Set art_category=' + id);
	
	conn.Close();
	return ret;
};

exports.buildCacheFile = function(){
	var data = require('./data');
	var connect = require('public/library/connect');
	var dbo = connect.dbo;
	var conn = connect.conn;
	
	var fso = require('../appjs/service/tron.fso');
	var fs = new fso();
	var fns = require('fns');
	
	var list = [
		{
			file: 'category.js',
			method: 'RebuildCacheFile'
		},
		{
			file: 'level.js',
			method: 'ReBuildLevelsCacheFile'
		},
		{
			file: 'level.js',
			method: 'ReBuildGroupsCacheFile'
		},
		{
			file: 'setting.js',
			method: 'ReBuildCacheFile'
		},
		{
			file: 'tag.js',
			method: 'SaveCacheFile'
		}
	];
	
	for ( var i = 0 ; i < list.length ; i++ ){
		var mos = require('public/services/' + list[i].file);
		mos.extend('dbo', dbo);
		mos.extend('conn', conn);
		mos.extend('fs', fs);
		mos.extend('fns', fns);
		var m = new mos();
		m[list[i].method]();
	};
	
	conn.Close();
	
	fs.saveFile(contrast('./data.lock'), 'locked');
	
	var editorconfig = fs.getFileContent(contrast("appjs/assets/ueditor/asp/config.json"));
	var ec = JSON.parse(editorconfig);
	var arrays = ["imageUrlPrefix", "scrawlUrlPrefix", "snapscreenUrlPrefix", "catcherUrlPrefix", "videoUrlPrefix", "fileUrlPrefix", "imageManagerUrlPrefix", "fileManagerUrlPrefix"];
	var arrays2 = ['catcherPathFormat', 'filePathFormat', 'imagePathFormat', 'scrawlPathFormat', 'snapscreenPathFormat', 'videoPathFormat'];
	for ( var i = 0 ; i < arrays.length ; i++ ){
		if ( ec[arrays[i]] ){
			ec[arrays[i]] = "";
		}
	}
	
	for ( var j = 0 ; j < arrays2.length ; j++ ){
		if ( ec[arrays2[j]] ){
			ec[arrays2[j]] = data.folder.length > 0 ? "/" + data.folder + "/private/uploads/{yyyy}{mm}{dd}/{time}{rand:6}" : "/private/uploads/{yyyy}{mm}{dd}/{time}{rand:6}";
		}
	}
	
	fs.saveFile(contrast("appjs/assets/ueditor/asp/config.json"), JSON.stringify(ec));
};

exports.setLevel = function(){
	var connect = require('public/library/connect');
	var dbo = connect.dbo;
	var conn = connect.conn;
	var id = 0;
	
	var rec = new dbo.RecordSet(conn);
	rec.sql("Select * From blog_groups Where group_name='超级管理员'")
	.process(function(object){
		if ( !object.Bof && !object.Eof ){
			id = object('id').value;
		};
	});
	
	if ( id > 0 ){
		conn.Execute('Update blog_members Set member_group=' + id);
	}
	
	conn.Close();
	
	var fso = require('../appjs/service/tron.fso');
	var fs = new fso();
	fs.saveFile(contrast('./complete.lock'), 'locked');
}

exports.local = function(){
	var connect = require('public/library/connect');
	var dbo = connect.dbo;
	var conn = connect.conn;
	var id = 0, gid = 2;
	var fns = require('appjs/service/tron.fns');
	var hashkey = fns.randoms(40);
	
	var rec = new dbo.RecordSet(conn);
	rec.sql("Select * From blog_groups Where group_name='超级管理员'")
	.process(function(object){
		if ( !object.Bof && !object.Eof ){
			gid = object('id').value;
		};
	});
	
	rec = new dbo.RecordSet(conn);
	rec
		.sql('Select * From blog_members')
		.on('add', function(object){
			id = object('id').value;
		})
		.open(2)
		.add({
			member_mark: '',
			member_nick: 'admin',
			member_hashkey: hashkey,
			member_mail: '',
			member_group: gid,
			member_forbit: false,
			member_avatar: ''
		})
		.close();
	
	if ( id > 0 ){
		var cookie = require('appjs/service/tron.cookie');
		cookie.set(blog.cookie + "_user", "id", id);
		cookie.set(blog.cookie + "_user", "hashkey", hashkey);
		cookie.expire(blog.cookie + "_user", 365 * 24 * 60 * 60 * 1000);
	}
	
	var fso = require('../appjs/service/tron.fso');
	var fs = new fso();
	fs.saveFile(contrast('./complete.lock'), 'locked');
}