<!--#include file="public/config.asp" -->
<%
(function( caches ){
	require("public/library/connect");
	var cache = new caches();
	cache.all();
	blog.conn.Close();
	Response.Redirect("install/?m=oauth");
})( require(":public/library/cache") );
%>