// JavaScript Document
var Setup = new Class({
	initialize: function(){
		this.fs = new this.fso();
		this.folder = contrast("../").replace(contrast("/"), "");
		this.step = Number(this.http.query('step') || "1");
		this.step = this.step < 1 ? 1 : this.step;
		this.plats = 'http://app.webkits.cn';
		this.version = 3;
		
		if ( this.step > 6 ){
			var connect = require('public/library/connect');
			this.dbo = connect.dbo;
			this.conn = connect.conn;
		};
		
		if ( this['step' + this.step] && typeof this['step' + this.step] === 'function' ){
			this['step' + this.step]();
		};
		
		try{ this.conn && this.conn.Close(); }catch(e){};
	},
	http: require("../appjs/service/tron.http").http,
	fns: require("../appjs/service/tron.fns"),
	fso: require("../appjs/service/tron.fso")
});

Setup.extend('render', function(){ 
	include('./views/' + this.step + '.asp', this); 
});

Setup.extend('step2', function(){
	this.fs.saveFile(contrast('./step.lock'), '?step=2');
});
Setup.extend('step3', function(){
	var t = this.http.query("t") || "local";
	this.fs.saveFile(contrast('./step.lock'), '?step=3&t=' + t);
});
Setup.extend('step4', function(){
	var t = this.http.query("t") || "local",
		folder = this.http.form("folder").replace(/\\$/, '').replace(/^\\/, '').replace(/\\/g, '/'),
		name = this.http.form("name"),
		dbname = this.http.form("dbname"),
		dbip = this.http.form("dbip"),
		dbusername = this.http.form("dbusername"),
		dbpassword = this.http.form("dbpassword"),
		appid = this.http.form("appid"),
		appkey = this.http.form("appkey"),
		web = this.http.form("web").replace(/\/$/, '');
	
	var params = {};
	
	if ( t === 'online' ){
		params.folder = folder;
		params.name = name;
		params.dbname = dbname;
		params.dbusername = dbusername;
		params.dbpassword = dbpassword;
		params.dbip = dbip;
		params.appid = appid;
		params.appkey = appkey;
		params.web = web;
		params.t = 'online';
	}else{
		params.folder = folder;
		params.name = name;
		params.dbname = dbname;
		params.dbusername = dbusername;
		params.dbpassword = dbpassword;
		params.dbip = dbip;
		params.web = web;
		params.t = 'online';
	};
	
	var h = '';
	for ( var i in params ){
		h += 'exports.' + i + ' = ' + JSON.stringify(params[i]) + ';\n';
	};
	
	this.fs.saveFile(resolve('./data'), h);
	Response.Redirect('?step=5');
});

Setup.extend('step5', function(){
	this.fs.saveFile(contrast('./step.lock'), '?step=5');
});

// 创建信息网站配置文件
Setup.extend('step6', function(){
	var data = require('./data');
	
	blog.base = data.folder;
	blog.connection = { "netserver": data.dbip, "access": data.dbname, "username": data.dbusername, "password": data.dbpassword };
	blog.cookie = this.fns.randoms(10);
	blog.cache = this.fns.randoms(10) + '.';
	blog.AppPlatForm = this.plats;
	blog.web = blog.base && blog.base.length > 0 ? data.web + '/' + blog.base : data.web;
	blog.version = this.version;
	
	var assets = ';var blog = {};\n', service = ';var blog = {};\n', ps = '%';
	
	assets += 'blog.version = ' + blog.version + ';\n';
	assets += 'blog.web = "' + blog.web + '";\n';
	assets += 'blog.AppPlatForm = "' + blog.AppPlatForm + '";\n';
	assets += 'blog.base = "' + blog.base + '";\n';
	assets += 'Library.setBase(blog.base);';
	fs.saveFile(resolve('../private/configs/assets'), assets);
	
	for ( var i in blog ){
		service += 'blog.' + i + ' = ' + JSON.stringify(blog[i]) + ';\n';
	}
	
	service = '<' + ps + '\n' + service + ps + '>';
	
	fs.saveFile(contrast('../private/configs/configure.asp'), service);
	
	Response.Redirect('?step=7');
});

// 删除已存在表
Setup.extend('step7', function(){
	var tables = [
		"blog_themes",
		"blog_tags",
		"blog_plugins",
		"blog_params",
		"blog_messages",
		"blog_members",
		"blog_links",
		"blog_levels",
		"blog_groups",
		"blog_global",
		"blog_comments",
		"blog_categorys",
		"blog_attments",
		"blog_articles"
	];
	try{
		for ( var i = 0 ; i < tables.length ; i++ ){
			this.conn.Execute('DROP TABLE ' + tables[i]);
		};
	}catch(e){
		this.error = '第7步操作失败。' + e.message;
	}
	
	this.conn.Close();
	
	!this.error && Response.Redirect('?step=8');
});

Setup.extend('step8', function(){
	var data = require('./data');
	var content,
		o = new ActiveXObject(Library.com_stream);
		o.Type = 2; o.Mode = 3; 
		o.Open(); 
		o.LoadFromFile(contrast('./install.sql'));
		content = o.ReadText;
		o.Close;
	try{
		if ( content.length > 0 ){	
			this.conn.Execute(content);
			if ( data.t === 'online' ){
				this.conn.Execute("Update blog_global Set blog_name='" + data.name + "', blog_title='" + data.name + "', blog_appid=" + data.appid + ",blog_appkey='" + data.appkey + "' Where id=1");
			}else{
				this.conn.Execute("Update blog_global Set blog_name='" + data.name + "', blog_title='" + data.name + "' Where id=1");
			}
			var id = conn.Execute('Select top 1 id From blog_categorys Where cate_outlink=0 And cate_isroot=1')(0).value;
			this.conn.Execute('Update blog_articles Set art_category=' + id);
			
		}else{
			
		}
	}catch(e){
		this.error = '第8步操作失败。' + e.message;
	};
	
	this.conn.Close();
	
	!this.error && Response.Redirect('?step=9');
});

Setup.extend('step9', function(){
	var data = require('./data');
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
		mos.extend('dbo', this.dbo);
		mos.extend('conn', this.conn);
		mos.extend('fs', this.fs);
		mos.extend('fns', this.fns);
		var m = new mos();
		m[list[i].method]();
	};
	
	this.conn.Close();
	
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
	
	this.fs.saveFile(contrast("appjs/assets/ueditor/asp/config.json"), JSON.stringify(ec));
});

return Setup;