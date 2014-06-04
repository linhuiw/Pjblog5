<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
;require("http").http.createServer(function( params ){
	var m = params.query.m,
		p = params.query.p,
		t = params.query.t,
		fso = require("fso");
		
	if ( !m || !p || m.length === 0 || p.length === 0 ){
		Library.json({ success: false, message: "非法操作" });
		return;
	};
	
	if ( !t || t.length === 0 ){
		t = "system";
	};
	
	var paths = { system: "./services/" };
	
	var fs = new fso(), ph = resolve("./services/" + m);
	
	if ( fs.exist(ph) ){
		var mode = require(ph),
			mose = new mode(params);
		
		if ( mose[p] && typeof mose[p] === "function" ){
			Library.json(mose[p](params));
		}else{
			Library.json({ success: false, message: "该模块中找不到对应的处理方法" });
		}
	}else{
		Library.json({ success: false, message: "找不到处理模块" });
	}
});
%>