<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
;(function( uploader, date, http, fns, fso ){
	var Reffer = String(Request.ServerVariables("HTTP_REFERER")).toLowerCase(),
		Serves = String(Request.ServerVariables("SERVER_NAME")).toLowerCase();
			
	if ( Reffer.indexOf("http://" + Serves) !== 0 ){
		Library.json({ success: false, message: "禁止外部提交！" });
		return;
	};
	
	var USER = require("./services/user"),
		user = new USER(),
		fo = date.format(new Date(), "ymd"),
		m = fns.HTMLStr(fns.SQLStr(http.query("m"))),
		p = fns.HTMLStr(fns.SQLStr(http.query("p"))),
		t = fns.HTMLStr(fns.SQLStr(http.query("t"))),
		fs = new fso(),
		uid,
		pfolder,
		pid,
		resolvePath;
	
	if ( !m || !p || m.length === 0 || p.length === 0 ){ 
		Library.json({ success: false, message: "非法操作" }); 
		try{ 
			user.conn.Close(); 
		}catch(e){};
		return; 
	};
	
	if ( !t || t.length === 0 ){ t = "system"; };

	if ( user.adminStatus(function( rets, object ){
		uid = object("id").value;
	}).admin )
	{
		var configs = {
			folder: contrast("private/uploads/" + fo),
			exts: "*",
			size: 0
		};
		
		var paths = { system: "public/services/" + m };
		if ( t !== "system" ){
			var pluginMode = require("private/chips/" + blog.cache + "blog.uri.plugins");
			if ( pluginMode && pluginMode.indexs && pluginMode.queens && pluginMode.queens[m] && !pluginMode.queens[m].stop ){
				pfolder = pluginMode.queens[m].folder;
				paths.plugin = "private/plugins/" + pfolder + "/service";
				pid = pluginMode.queens[m].id;
			}else{
				Library.json({ success: false, message: "插件不允许插件，可能已被暂停服务!" });
				try{ 
					user.conn.Close(); 
				}catch(e){};
				return;
			}
		}
		
		if ( paths.plugin ){ resolvePath = paths.plugin; }else{ resolvePath = paths.system; };
		
		var ph = resolve(resolvePath);
		
		if ( fs.exist(ph) ){
			var mode = require(ph);
			
				mode.extend("fso", fso);
				mode.extend("fns", fns);
				mode.extend("fs", fs);
				mode.extend("dbo", user.dbo);
				mode.extend("conn", user.conn);
				mode.extend("uid", uid);
				if ( t !== "system" && pid && pid > 0 ){
					mode.extend("pid", pid);
					mode.extend("pmark", m);
					mode.extend("pfolder", pfolder);
				};
			
			var mose = new mode(params);
		
			if ( mose[p] && typeof mose[p] === "function" ){
				mose[p](configs);
				var ups = new uploader(configs);
				Library.json(ups.httpload());
			}else{
				Library.json({ success: false, message: "该模块中找不到对应的处理方法" });
			}
		}else{
			Library.json({ success: false, message: "找不到处理模块" });
		}
	}
	else{
		Library.json({ success: false, message: "非法操作" });
	};
	
	try{ 
		user.conn.Close(); 
	}catch(e){};
})( require("upload"), require("date"), require("http").http, require("fns"), require("fso") );
%>