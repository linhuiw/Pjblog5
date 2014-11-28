<!--#include file="public/config.asp" -->
<%
;(function(iPressModule){
	iPress = new iPressModule();

	iPress.iControler.set(contrast('public/router.json'));
	iPress.render();

	if ( iPress.error > 0 ){
		Response.clear();
		console.log(iPress.errors[iPress.error + '']);
	}
})(require('iPress'));
%>