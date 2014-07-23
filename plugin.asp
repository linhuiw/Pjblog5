<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){
	
	LAYOUT.extend("getPluginMessage", function(id){
		var rec = new this.dbo.RecordSet(this.conn),
			ret = {};
			
		rec
			.sql("Select * From blog_plugins Where id=" + id)
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					ret.id = object("id").value;
					ret.mark = object("plu_mark").value;
					ret.name = object("plu_name").value;
					ret.des = object("plu_des").value;
					ret.author = object("plu_author").value;
					ret.mail = object("plu_mail").value;
					ret.web = object("plu_web").value;
					ret.folder = object("plu_folder").value;
					ret.icon = object("plu_icon").value;
					ret.stop = object("plu_stop").value;
				}
			});
		
		return ret;
	});
	
	(new LAYOUT()).createServer(function( req ){
		var id = req.query.id,
			page = req.query.page,
			querys = req;
			
		this.add("req", req);
		
		if ( !page || page.length === 0 ){ page = "1"; }; page = Number(page); if ( page < 1 ){ page = 1; };
		if ( !id || id.length === 0 ){ id = "0"; }; id = Number(id);
		
		this.add("id", id);
		this.add("page", page);
		this.add("gets", querys);		
		this.navigation();
		this.add("errors", require("public/chips/blog.error"));
		
		if ( this.params.error > 0 ){
			this.add("error", this.params.error); this.render("error.asp"); return;
		}
		
		if ( isNaN(id) || isNaN(page) ){
			this.add("error", 10); this.render("error.asp"); return;
		}
		
		if ( id < 1 ){ this.add("error", 3); this.render("error.asp"); return; };
		
		var msg = this.getPluginMessage(id);
		
		if ( !msg ){
			this.add("error", 4); this.render("error.asp"); 
			return;
		};
		
		if ( msg.stop ){
			this.add("error", 5); this.render("error.asp"); 
			return;
		};
		
		var configpath = "private/plugins/" + msg.folder + "/config";
		if ( !this.fs.exist(resolve(configpath)) ){
			this.add("error", 6); this.render("error.asp"); 
			return;
		};
		
		var configs = require(configpath);
		if ( !configs.AssetNav ){
			this.add("error", 7); this.render("error.asp"); 
			return;
		};
		
		if ( !configs.AssetNav.file || configs.AssetNav.file.length === 0 ){
			this.add("error", 8); this.render("error.asp"); 
			return;
		};
		
		if ( !this.fs.exist(contrast("private/themes/" + this.params.global.blog_theme + "/" + configs.AssetNav.file)) ){
			this.add("error", 9); this.render("error.asp"); 
			return;
		};
		
		this.add("plugin", msg);
		
		var plugins = require("public/library/plugin");
			plugins.extend("dbo", this.dbo);
			plugins.extend("conn", this.conn);
		var plugin = new plugins(),
			setting = plugin.getSettingParams(msg.id);
			
		this.add("setting", setting);
		this.render(configs.AssetNav.file);
	});
	
})( require("public/library/layout") );
%>