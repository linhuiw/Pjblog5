// JavaScript Document
var Setup = new Class({
	initialize: function(){
		this.fs = new this.fso();
		this.folder = contrast("../").replace(contrast("/"), "");
		this.step = Number(this.http.query('step') || "1");
		this.step = this.step < 1 ? 1 : this.step;
		this.plats = 'http://app.webkits.cn';
		this.version = 6;
		
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

Setup.add('go', function( url ){
	try{
		this.conn.Close();
	}catch(e){};
	
	Response.Redirect(url);
});

Setup.add('render', function(){ 
	include('./views/' + this.step + '.asp', this); 
});

Setup.add('step2', function(){
	this.fs.saveFile(contrast('./step.lock'), '?step=2');
});
Setup.add('step3', function(){
	var t = this.http.query("t") || "local";
	this.fs.saveFile(contrast('./step.lock'), '?step=3&t=' + t);
});
Setup.add('step4', function(){
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
		
	dbip = !dbip || dbip.length === 0 || dbip.toLowerCase() === "localhost" ? '.' : dbip;
	
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
		
		var Ajax = require('../appjs/service/tron.http').ajax;
		var ajax = new Ajax();
		try{
			var msg = ajax.getJSON('http://app.webkits.cn/oauth/setup', {
				oauth_consumer_key: appid,
				oauth_consumer_url: web.replace(/^http\:\/\//, '')
			});
			
			if ( msg && msg.error > 0 ){
				this.error = "网站域名未授权，无法安装，请先在官方平台的授权中心提交你的授权域名";
			}
		}catch(e){
			this.error = "验证网站域名授权失败，无法安装，请联系官方平台管理员";
		}
		
	}else{
		params.folder = folder;
		params.name = name;
		params.dbname = dbname;
		params.dbusername = dbusername;
		params.dbpassword = dbpassword;
		params.dbip = dbip;
		params.web = web;
		params.t = 'local';
	};
	
	var h = '';
	for ( var i in params ){
		h += 'exports.' + i + ' = ' + JSON.stringify(params[i]) + ';\n';
	};
	
	this.fs.saveFile(resolve('./data'), h);
	!this.error && this.go('?step=5');
});

Setup.add('step5', function(){
	var params = require('./data');
	var connected = false;
	try{
		var connect = require('appjs/service/tron.dbo').Connection;
		var conns = new connect();
		this.conn = conns.connect({ 
			"netserver": params.dbip, 
			"access": params.dbname, 
			"username": params.dbusername, 
			"password": params.dbpassword 
		});
		if ( this.conn ){
			connected = true;
		};
	}catch(e){};
	params.connected = connected;
	
	var h = '';
	
	for ( var i in params ){
		h += 'exports.' + i + ' = ' + JSON.stringify(params[i]) + ';\n';
	};
	
	this.fs.saveFile(resolve('./data'), h);
	if ( !connected ){
		this.fs.saveFile(contrast('./step.lock'), '?step=3&t=' + params.t);
	}else{
		this.conn.Close();
		this.fs.saveFile(contrast('./step.lock'), '?step=5');
	}
});

// 创建信息网站配置文件
Setup.add('step6', function(){
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
	this.fs.saveFile(resolve('../private/configs/assets'), assets);
	
	for ( var i in blog ){
		service += 'blog.' + i + ' = ' + JSON.stringify(blog[i]) + ';\n';
	}
	
	service = '<' + ps + '\n' + service + ps + '>';
	
	this.fs.saveFile(contrast('../private/configs/configure.asp'), service);
	
	Response.Redirect('?step=7');
});

// 删除已存在表
Setup.add('step7', function(){
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
	
	for ( var i = 0 ; i < tables.length ; i++ ){
		try{
			this.conn.Execute('DROP TABLE ' + tables[i]);
		}catch(e){}
	};

	
	this.conn.Close();
	
	this.go('?step=8');
});

Setup.add('step8', function(){
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
			this.doSQL();
		}else{
			this.error = '打开install.sql失败';
		}
	}catch(e){
		this.error = '第8步操作失败。' + e.message;
	};
	
	this.conn.Close();
	
	!this.error && this.go('?step=9');
});

Setup.add('step9', function(){
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
		mos.add('dbo', this.dbo);
		mos.add('conn', this.conn);
		mos.add('fs', this.fs);
		mos.add('fns', this.fns);
		var m = new mos();
		m[list[i].method]();
	};
	
	this.conn.Close();

	this.go('?step=10');
});

Setup.add('step10', function(){
	var data = require('./data');
	var editorconfig = this.fs.getFileContent(contrast("appjs/assets/ueditor/asp/config.json"));
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
	this.go('?step=11');
});

Setup.add('step11', function(){
	this.fs.saveFile(contrast('./step.lock'), '?step=11');
});

Setup.add('step12', function(){
	var data = require('./data'), id = 0;
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql("Select * From blog_groups Where group_name='超级管理员'")
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				id = object('id').value;
			};
		});
		
	if ( id > 0 ){	
		if ( data.t === 'online' ){
			this.conn.Execute('Update blog_members Set member_group=' + id);
		}else{
			var nid = 0;
			var hashkey = this.fns.randoms(40);
			rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql('Select * From blog_members')
				.on('add', function(object){
					nid = object('id').value;
				})
				.open(2)
				.add({
					member_mark: '',
					member_nick: 'admin',
					member_hashkey: hashkey,
					member_mail: '',
					member_group: id,
					member_forbit: false,
					member_avatar: ''
				})
				.close();
			
			if ( nid > 0 ){
				var cookie = require('appjs/service/tron.cookie');
				cookie.set(blog.cookie + "_user", "id", nid);
				cookie.set(blog.cookie + "_user", "hashkey", hashkey);
				cookie.expire(blog.cookie + "_user", 365 * 24 * 60 * 60 * 1000);
			}
		}
	}else{
		this.error = '在线安装设置管理员失败';
	}
});

Setup.add('doSQL', function(){
	var data = require('./data');
	
	// 写入全局变量表初始化信息
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_global')
		.on('add', function(object){
			global_id = object('id').value;
		})
		.open(2)
		.add({
			blog_name: data.name,
			blog_title: data.name,
			blog_des: data.name,
			blog_mail: 'puterjam@gmail.com',
			blog_copyright: '',
			blog_keywords: 'PJBlog5,webkits.cn,cloud blog',
			blog_description: 'A cloud blog',
			blog_status: 0,
			blog_message: 'website closed!',
			blog_categoryremove: 0,
			blog_articlecut: 300,
			blog_categoryremovechild: 0,
			blog_appid: !data.appid || data.appid.length === 0 ? 0 : data.appid,
			blog_appkey: data.appkey || '',
			blog_articlepage: 10,
			blog_article_cloud_notice: false
		})
		.close();

	// 写入分类分类初始化变量
	rec = new this.dbo.RecordSet(this.conn);
	var id = 0;
	rec
		.sql('Select * From blog_categorys')
		.open(2)
		.add({
			cate_name: '首页',
			cate_des: '网站首页',
			cate_count: 0,
			cate_parent: 0,
			cate_src: 'default.asp',
			cate_outlink: true,
			cate_isroot: true,
			cate_order: 1,
			cate_icon: 'fa-bug'
		})
		.close();
	
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_categorys')
		.on('add', function(object){
			id = object('id').value;
		})
		.open(2)
		.add({
			cate_name: '默认根分类',
			cate_des: '默认根分类',
			cate_count: 0,
			cate_parent: 0,
			cate_src: '',
			cate_outlink: false,
			cate_isroot: true,
			cate_order: 2,
			cate_icon: 'fa-bug'
		})
		.close();
	
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_categorys')
		.on('add', function(object){
			id = object('id').value;
		})
		.open(2)
		.add({
			cate_name: '默认二级分类',
			cate_des: '默认二级分类',
			cate_count: 0,
			cate_parent: id,
			cate_src: '',
			cate_outlink: false,
			cate_isroot: false,
			cate_order: 1,
			cate_icon: 'fa-bug'
		})
		.close();
		
	// 写入默认文章数据
	var date = require('appjs/service/tron.date');
	var html = Library.loader(contrast('./article.html'));
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_articles')
		.open(2)
		.add({
			art_title: '第一次使用PJBlog5，请先看看程序说明吧！',
			art_des: '非常感谢您使用PJBlog5独立博客管理系统。本程序采用非复古式ASP语法，放弃VBscri&#112;t，选用Jscri&#112;t脚本，实现前后台一统。PJBlog5基于TRONASP框架而得以运行，解决了ASP中一些难以突破的限制。比如说，动态include，模块之间的require。但是可惜的是，我们还是无法解决sleep或者setTimeout这些问题。无法突破不代表我们的ASP程序不能实现对以往语言的超越。我相信，PJBlog5作为TRONASP的代表作，一定会厚积薄发，史无前例地为创造用户体验而努力！让时间证明一切吧。',
			art_category: id,
			art_content: html,
			art_tags: '',
			art_draft: false,
			art_tname: '',
			art_postdate: date.format(new Date(), 'y/m/d h:i:s'),
			art_modifydate: date.format(new Date(), 'y/m/d h:i:s'),
			art_comment_count: 0,
			art_cover: '',
			art_tdes: ''
		})
		.close();
	
	// 写入用户限制级权限的初始化数据
	var member = [], supadmin = [];
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_levels')
		.on('add', function(object){
			member.push(object('id').value);
			supadmin.push(object('id').value);
		})
		.open(2)
		.add({ 
			code_name: '查看文章', 
			code_des: '用户具有查看文章权限', 
			code_isystem: true, 
			code_mark: 'ViewArticles' 
		})
		.close();

	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_levels')
		.on('add', function(object){
			supadmin.push(object('id').value);
		})
		.open(2)
		.add({ 
			code_name: '后台管理', 
			code_des: '用户具有进入后台并控制后台功能的权限，是超级管理员的标志。', 
			code_isystem: true, 
			code_mark: 'ControlSystem' 
		})
		.close();
	
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_levels')
		.on('add', function(object){
			supadmin.push(object('id').value);
		})
		.open(2)
		.add({ 
			code_name: '日志编辑', 
			code_des: '用户具有前台日志编辑的功能。', 
			code_isystem: true, 
			code_mark: 'ModifyArticles' 
		})
		.close();
	
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_levels')
		.on('add', function(object){
			supadmin.push(object('id').value);
		})
		.open(2)
		.add({ 
			code_name: '日志删除', 
			code_des: '用户具有前台日志删除的功能。', 
			code_isystem: true, 
			code_mark: 'RemoveArticles' 
		})
		.close();
	
	// 写入用户权限组初始化数据
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_groups')
		.open(2)
		.add({ 
			group_name: '游客', 
			group_code: JSON.stringify([member[0]]), 
			group_isystem: true
		})
		.close();
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_groups')
		.open(2)
		.add({ 
			group_name: '普通会员', 
			group_code: JSON.stringify([member[0]]), 
			group_isystem: true
		})
		.close();
		
	rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_groups')
		.open(2)
		.add({ 
			group_name: '超级管理员', 
			group_code: JSON.stringify(supadmin), 
			group_isystem: true
		})
		.close();
});

return Setup;