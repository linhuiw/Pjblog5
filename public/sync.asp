<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
;(function( http, fns, fso ){
	function FilterCallback(str){ return fns.HTMLStr(fns.SQLStr(str)); };
	/*!
	 * URL虚拟机
	 * 主动记载URL配置模块
	 * 返回系统模块变量
	 */
	http.createServer(function(params){
		var Reffer = String(Request.ServerVariables("HTTP_REFERER")).toLowerCase(),
			Serves = String(Request.ServerVariables("SERVER_NAME")).toLowerCase();
			
		if ( Reffer.indexOf("http://" + Serves) !== 0 ){
			Library.json({ success: false, message: "禁止外部提交！" });
			return;
		};
		
		var m = params.query.m,
			p = params.query.p,
			t = params.query.t,
			paths = { system: "public/services/" + m },
			fs = new fso(),
			resolvePath,
			pid,
			pfolder;
		
		if ( !m || !p || m.length === 0 || p.length === 0 ){ Library.json({ success: false, message: "非法操作" }); return; };
		if ( !t || t.length === 0 ){ t = "system"; };
		
		if ( t !== "system" ){
			var pluginMode = require("private/chips/" + blog.cache + "blog.uri.plugins");
			if ( pluginMode && pluginMode.indexs && pluginMode.queens && pluginMode.queens[m] && !pluginMode.queens[m].stop ){
				pfolder = pluginMode.queens[m].folder;
				paths.plugin = "private/plugins/" + pfolder + "/service";
				pid = pluginMode.queens[m].id;
			}else{
				Library.json({ success: false, message: "插件不允许运行，可能已被暂停服务!" });
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
			if ( t !== "system" && pid && pid > 0 ){
				mode.extend("pid", pid);
				mode.extend("pmark", m);
				mode.extend("pfolder", pfolder);
			};
			var mose = new mode(params);
		
			if ( mose[p] && typeof mose[p] === "function" ){	
				Library.json(mose[p](params));
			}else{
				Library.json({ success: false, message: "该模块中找不到对应的处理方法" });
			}
		}else{
			Library.json({ success: false, message: "找不到处理模块" });
		}
		
	}, FilterCallback);
})( 
	require("http").http, 
	require("fns"),
	require("fso")
);
%>