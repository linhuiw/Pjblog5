<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="../public/map.asp" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="css/reset.css"/>
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<title>PJBlog5安装程序</title>
</head>
<body>
<div class="top">
	<div class="title  wrap">PJBlog5 Installer</div>
</div>
<div class="content wrap">
<%
	var folder = contrast("../").replace(contrast("/"), ""),
		installer = require("./install"),
		http = require("../appjs/service/tron.http").http;
	
	var action = http.query("action");
	
	var fso = require("../appjs/service/tron.fso");
	var fs = new fso();
	
	var step1 = ["submit", "install", "dbsetup", "BuildCacheFile"];
	if ( fs.exist(contrast("./data.lock")) && step1.indexOf(action) > -1 ){
		Response.Redirect("?action=oauth");
	};
	
	if ( fs.exist(contrast("./complete.lock")) ){
		include("./template/complete.asp");
		Response.End();
	}

	if ( action === "submit" ){
		installer.submit(http);
		include("./template/forminfo.asp", { data: require("./data") });
	}
	else if ( action === "install" ){
		installer.setup();
		Response.Redirect("?action=dbsetup");
	}
	else if ( action === "dbsetup" ){
		var z = installer.dbexcute();
		if ( z.success ){
			Response.Redirect("?action=BuildCacheFile");
		}else{
			include("./template/error.asp", { message: z.message });
		}
	}
	else if ( action === "BuildCacheFile" ){
		installer.buildCacheFile();
		Response.Redirect("?action=oauth");
	}
	else if ( action === "oauth" ){
		var oauth = require("public/library/oauth2"),
			global = require("private/chips/" + blog.cache + "blog.global");
		include("./template/oauth.asp", { appid: global.blog_appid, oauth: oauth, folder: folder });
	}
	else if ( action === "local" ){
		installer.local();
		include("./template/complete.asp");
	}
	else if ( action === "complete" ){
		installer.setLevel();
		include("./template/complete.asp");
	}
	else{
		if ( fs.exist(contrast("./data.lock")) ){
			Response.Redirect("?action=oauth");
		};
		include("./template/form.asp", { folder: folder });
	};
%>
</div>
</body>
</html>
