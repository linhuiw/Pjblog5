<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
var global = require("private/chips/" + blog.cache + "blog.global");
if ( global.blog_status === 0 ){
	Response.Redirect("default.asp");
}
include("private/themes/" + global.blog_theme + "/close.asp", global);
%>