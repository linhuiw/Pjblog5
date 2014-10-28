<!--#include file="../private/configs/configure.asp" -->
<%
Library
	.onMap("cookie", "appjs/service/tron.cookie")
	.onMap("date", "appjs/service/tron.date")
	.onMap("dbo", "appjs/service/tron.dbo")
	.onMap("fns", "appjs/service/tron.fns")
	.onMap("fso", "appjs/service/tron.fso")
	.onMap("http", "appjs/service/tron.http")
	.onMap("sha1", "appjs/service/sha1")
	.onMap("md5", "appjs/service/md5")
	.onMap("upload", "appjs/service/tron.upload")
	.onMap("package", "appjs/service/tron.package")
	.onMap("crc32", "appjs/service/crc32");

Library.setBase(blog.base);

(function( HOST ){
	var hosts = blog.web.replace(/^http\:\/\//i, "").split("/");
	if ( hosts && hosts[0] && hosts[0].length > 0 && hosts[0] != HOST ){
		Response.Redirect(blog.web);
	};
})(String(Request.ServerVariables("HTTP_HOST")));

%>