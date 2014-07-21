<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
;(function( reffer, member ){
	var mem = new member(),
		logout = mem.logout();
		
	if ( reffer.indexOf("?") > -1 ){
		reffer = reffer + "&time=" + new Date().getTime();
	}else{
		reffer = reffer + "?time=" + new Date().getTime();
	}
		
	Response.Redirect(reffer);
})( String(Request.ServerVariables("HTTP_REFERER")), require("./services/user") );
%>