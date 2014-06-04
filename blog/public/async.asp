<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
(function(){
	var user = require("./services/login"),
		login = new user();
		
	login.status(function(object, logined){
		if ( logined && object("isadmin").value ){
			require("http").http.createServer(function( params ){
				var m = params.query.m,
					p = params.query.p,
					fso = require("fso");
					
				if ( !m || !p || m.length === 0 || p.length === 0 ){
					Library.json({ success: false, message: "非法操作" });
					return;
				};
				
				var fs = new fso(), ph = resolve("./services/" + m);
				
				if ( fs.exist(ph) ){
					var mode = require(ph),
						mose = new mode(params);
					
					if ( mose[p] && typeof mose[p] === "function" ){
						mose.conn = login.conn;
						mose.dbo = login.dbo;
						Library.json(mose[p](params));
					}else{
						Library.json({ success: false, message: "该模块中找不到对应的处理方法" });
					}
				}else{
					Library.json({ success: false, message: "找不到处理模块" });
				}
			});
		}else{
			Library.json({ success: false, message: "你没有权限操作" });
		}
	});
	
	login.conn.Close();
})();
%>