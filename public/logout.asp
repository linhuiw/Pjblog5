<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
;(function( reffer, member ){
	var mem = new member(),
		logout = mem.logout();
		
	Response.Redirect(reffer);
})( Request.ServerVariables("HTTP_REFERER"), require("./services/user") );
%>