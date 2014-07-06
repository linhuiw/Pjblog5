<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){
	(new LAYOUT()).createServer(function( req ){
		this.navigation();
		Library.json(this.params);
	});
})( require("public/library/layout") );
%>