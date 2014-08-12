<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
;(function( uploader, date ){
	var USER = require("./services/user"),
		user = new USER(),
		fo = date.format(new Date(), "ymd");

	if ( user.adminStatus().admin ){
		var ups = new uploader({
			folder: contrast("private/uploads/" + fo),
			exts: "*",
			size: 0
		});
		Library.json(ups.httpload());
	}
	else{
		Library.json({ success: false, message: "非法操作" });
	};
	
	try{ 
		user.conn.Close(); 
	}catch(e){};
})( require("upload"), require("date") );
%>