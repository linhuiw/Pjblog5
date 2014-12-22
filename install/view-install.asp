<%
	var form = require("./data.json");
	var error = "";
	var version = 1;
	
	var configs = {
			netserver: form.dbip,
			access: form.dbname,
			username: form.dbusername,
			password: form.dbpassword
		};
	
	var conn = new connect("mssql", configs);
		
	try{
		
		var tables = [
			form.tb + "themes",
			form.tb + "tags",
			form.tb + "plugins",
			form.tb + "params",
			form.tb + "messages",
			form.tb + "members",
			form.tb + "links",
			form.tb + "levels",
			form.tb + "groups",
			form.tb + "global",
			form.tb + "comments",
			form.tb + "categorys",
			form.tb + "attments",
			form.tb + "articles"
		];
		
		for ( var i = 0 ; i < tables.length ; i++ ){
			try{
				conn.Execute("DROP TABLE " + tables[i]);
			}catch(e){}
		};
		
		try{
			var content = fs(contrast("./sql/iPage.sql")).exist().read().value();
			conn.Execute(content);
		}catch(e){}

		content = fs(contrast("./sql/blog.sql")).exist().read().value().replace(/\{tb\}/ig, form.tb);
		conn.Execute(content);

		(new dbo(form.tb + "global", conn)).selectAll().create().set({
			blog_name: form.name,
			blog_title: form.name,
			blog_des: form.name,
			blog_mail: "puterjam@gmail.com",
			blog_copyright: "",
			blog_keywords: "PJBlog5,webkits.cn,cloud blog",
			blog_description: "A cloud blog",
			blog_status: 0,
			blog_message: "website closed!",
			blog_categoryremove: 0,
			blog_articlecut: 300,
			blog_categoryremovechild: 0,
			blog_appid: !form.appid || form.appid.length === 0 ? 0 : form.appid,
			blog_appkey: form.appkey || "",
			blog_articlepage: 10,
			blog_article_cloud_notice: false
		}).save().close();

		(new dbo(form.tb + "categorys", conn)).selectAll().create().set({
			cate_name: "首页",
			cate_des: "网站首页",
			cate_count: 0,
			cate_parent: 0,
			cate_src: "iPress:[+page+,+home+]",
			cate_outlink: true,
			cate_isroot: true,
			cate_order: 1,
			cate_icon: "fa-star"
		}).save().close();

		(new dbo(form.tb + "categorys", conn)).selectAll().create().set({
			cate_name: "默认根分类",
			cate_des: "默认根分类",
			cate_count: 0,
			cate_parent: 0,
			cate_src: "",
			cate_outlink: false,
			cate_isroot: true,
			cate_order: 2,
			cate_icon: "fa-star"
		}).save().close();

		(new dbo(form.tb + "categorys", conn)).selectAll().create().set({
			cate_name: "默认二级分类",
			cate_des: "默认二级分类",
			cate_count: 0,
			cate_parent: 2,
			cate_src: "",
			cate_outlink: false,
			cate_isroot: false,
			cate_order: 1,
			cate_icon: "fa-star"
		}).save().close();

		(new dbo(form.tb + "articles", conn)).selectAll().create().set({
			art_title: "第一次使用PJBlog5，请先看看程序说明吧！",
			art_des: "非常感谢您使用PJBlog5独立博客管理系统。本程序采用非复古式ASP语法，放弃VBscri&#112;t，选用Jscri&#112;t脚本，实现前后台一统。PJBlog5基于TRONASP框架而得以运行，解决了ASP中一些难以突破的限制。比如说，动态include，模块之间的require。但是可惜的是，我们还是无法解决sleep或者setTimeout这些问题。无法突破不代表我们的ASP程序不能实现对以往语言的超越。我相信，PJBlog5作为TRONASP的代表作，一定会厚积薄发，史无前例地为创造用户体验而努力！让时间证明一切吧。",
			art_category: 2,
			art_content: fs(contrast("./article.html")).exist().read().value(),
			art_tags: "",
			art_draft: false,
			art_tname: "",
			art_postdate: date.format(new Date(), "y/m/d h:i:s"),
			art_modifydate: date.format(new Date(), "y/m/d h:i:s"),
			art_comment_count: 0,
			art_cover: "seo",
			art_tdes: "seo"
		}).save().close();

		(new dbo(form.tb + "levels", conn)).selectAll().create().set({
			code_name: "查看文章", 
			code_des: "用户具有查看文章权限", 
			code_isystem: true, 
			code_mark: "ViewArticles"
		}).save().close();

		(new dbo(form.tb + "levels", conn)).selectAll().create().set({
			code_name: "后台管理", 
			code_des: "用户具有进入后台并控制后台功能的权限，是超级管理员的标志。", 
			code_isystem: true, 
			code_mark: "ControlSystem"
		}).save().close();

		(new dbo(form.tb + "levels", conn)).selectAll().create().set({
			code_name: "日志编辑", 
			code_des: "用户具有前台日志编辑的功能。", 
			code_isystem: true, 
			code_mark: "ModifyArticles"
		}).save().close();

		(new dbo(form.tb + "levels", conn)).selectAll().create().set({
			code_name: "日志删除", 
			code_des: "用户具有前台日志删除的功能。", 
			code_isystem: true, 
			code_mark: "RemoveArticles" 
		}).save().close();

		(new dbo(form.tb + "groups", conn)).selectAll().create().set({
			group_name: "游客", 
			group_code: JSON.stringify([1]), 
			group_isystem: true
		}).save().close();

		(new dbo(form.tb + "groups", conn)).selectAll().create().set({
			group_name: "普通会员", 
			group_code: JSON.stringify([1]), 
			group_isystem: true
		}).save().close();

		(new dbo(form.tb + "groups", conn)).selectAll().create().set({
			group_name: "超级管理员", 
			group_code: JSON.stringify([1,2,3,4]), 
			group_isystem: true
		}).save().close();

		var pack = require("./pack");
		var package = new pack();
		package.unPack(contrast("./blog.pbd"), contrast("../"));
		
		fs(contrast("../private"), true).unExist().create();
		fs(contrast("../private/caches"), true).unExist().create();
		fs(contrast("../private/plugins"), true).unExist().create();
		fs(contrast("../private/themes"), true).unExist().create();
		fs(contrast("../private/uploads"), true).unExist().create();
		fs(contrast("./themes/default"), true).exist().copy(contrast("../private/themes/default"));
		
		var blog = {};
		blog.tb = form.tb;
		blog.base = form.folder;
		blog.connect = configs;
		blog.cookie = "cookie_" + new Date().getTime();
		blog.appsite = "http://app.webkits.cn";
		blog.mysite = form.web + (form.folder && form.folder.length > 0 ? "/" + form.folder : "");
		blog.version = version;
		blog.pix = new Date().getTime() + "_";
		
		var ueditor = require("../public/assets/ueditor/asp/config.json");
		var root = blog.base.length > 0 ? "/" + blog.base + "/" : "/";
		ueditor.imagePathFormat = root + "private/uploads/image/{yyyy}{mm}{dd}/{time}{rand:6}";
		ueditor.scrawlPathFormat = root + "private/uploads/scraw/{yyyy}{mm}{dd}/{time}{rand:6}";
		ueditor.snapscreenPathFormat = root + "private/uploads/snap/{yyyy}{mm}{dd}/{time}{rand:6}";
		ueditor.catcherPathFormat = root + "private/uploads/catcher/{yyyy}{mm}{dd}/{time}{rand:6}";
		ueditor.videoPathFormat = root + "private/uploads/video/{yyyy}{mm}{dd}/{time}{rand:6}";
		ueditor.filePathFormat = root + "private/uploads/file/{yyyy}{mm}{dd}/{time}{rand:6}";
		ueditor.imageManagerListPath = root + "private/uploads/image";
		ueditor.fileManagerListPath = root + "private/uploads/file";
		fs(contrast("../public/assets/ueditor/asp/config.json")).create(JSON.stringify(ueditor));
		fs(contrast("../private/config.json")).create(JSON.stringify(blog));
		fs(contrast("./mockup.asp")).exist().copy(contrast("../mockup.asp"));
		
	}catch(e){
		conn.Close();
		conn = null;
		error = e.message;
	}
	
	if ( error.length > 0 ){
%>
<div class="container content">
	<div class="nav shadow radius">安装 <i class="fa fa-angle-right"></i> 错误</div>
    <div class="box shadow">
    	<div class="title"><i class="fa fa-volume-up"></i>安装过程产生错误：</div>
        <div class="main">
        <%=error%>
        </div>
    </div>
</div>
<div class="container action">
<a href="?m=data" class="btn btn-danger"><i class="fa fa-chevron-circle-left"></i>上一步</a>
</div>
<%
	}else{
		Response.Redirect("../mockup.asp");
	}
%>