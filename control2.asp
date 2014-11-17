<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( 
	http, 
	fso, 
	fns, 
	Member, 
	GlobalCache, 
	ControlNavgationCache,
	ControlPluginNavCache,
	PluginCache,
	CheckRequest,
	CloseConnect,
	foreach,
	forIn
){
	var user 	= new Member();
	var fs 		= new fso();
	var dbo		= user.dbo;
	var conn	= user.conn;
	
	blog.user = {};
	blog.file = {};
	blog.snav = ControlNavgationCache;
	blog.pnav = ControlPluginNavCache;
	
	ControlNavgationCache["404"] = { icon: "fa-automobile", name: "404", des: "页面未找到", hide: true };
	
	http.createServer(function( req ){
		req.query.m = CheckRequest(req.query.m, "home");
		req.query.t = CheckRequest(req.query.t, "0");
		
		blog.UserStatus = user.adminStatus(function( rets, object ){
			blog.user.id 		= object("id").value;
			blog.user.nick 		= object("member_nick").value;
			blog.user.token 	= object("member_token").value;
			blog.user.openid 	= object("member_openid").value;
			blog.user.avatar	= object("member_avatar").value;
		});
		
		if ( !blog.UserStatus.login || !blog.UserStatus.admin ){
			include("public/views/login.asp");
			return;
		};
		
		blog.localtions = [];
		blog.localtions.push({ icon: "fa-pinterest-square", name: "PJBlog5", des: "PJBlog5后台管理系统", mark: "home" });

		if ( Number(req.query.t) > 0 && PluginCache.indexs[req.query.t] ){
			blog.localtions.push({ icon: "fa-windows", name: "插件", des: "插件系统", mark: "plugin" });
			blog.localtions.push({ 
				icon: "fa-twitter", 
				name: PluginCache.queens[PluginCache.indexs[req.query.t]].name, 
				des: "", 
				mark: PluginCache.indexs[req.query.t]
			});
			blog.file.asp = "private/plugins/" + PluginCache.queens[PluginCache.indexs[req.query.t]].folder + "/views/plu." + req.query.m + ".asp";
			blog.file.css = "private/plugins/" + PluginCache.queens[PluginCache.indexs[req.query.t]].folder + "/css/plu." + req.query.m + ".css";
			blog.file.js = "private/plugins/" + PluginCache.queens[PluginCache.indexs[req.query.t]].folder + "/js/plu." + req.query.m + ".js";
		}else{
			if ( !ControlNavgationCache[req.query.m] ){ req.query.m = "404"; };
			ControlNavgationCache[req.query.m].mark = req.query.m;
			blog.localtions.push(ControlNavgationCache[req.query.m]);
			blog.file.asp = "public/views/" + req.query.m + ".asp";
			blog.file.css = "public/assets/css/" + req.query.m + ".css";
			blog.file.js = "public/assets/js/" + req.query.m + ".js";
		}

		include("public/views/wrap.asp", { blog: blog, foreach: foreach, forIn: forIn, req: req, fs: fs });
	});
	
	CloseConnect();
})(
	require("http").http,
	require("fso"),
	require("fns"),
	require("public/services/user"),
	require("private/chips/" + blog.cache + "blog.global"),
	require("public/chips/blog.control.system.navs"),
	require("private/chips/" + blog.cache + "blog.control.plugin.navs"),
	require("private/chips/" + blog.cache + "blog.uri.plugins"),
	function( req, def ){
		if ( !req || req.length === 0 ){
			req = def;
		}
		return req;
	},
	function(conn){
		try{
			conn.Close();
			conn = null;
		}catch(e){}
	},
	function(arrays, callback){
		for ( var i = 0 ; i < arrays.length ; i++ ){
			callback(arrays[i], i);
		}
	},
	function(jsons, callback){
		for ( var i in jsons ){
			callback(jsons[i], i);
		}
	}
);
%>