<!--#include file="../appjs/service/tron.asp" -->
<!--#include file="map.asp" -->
<%
;(function( http, uploader, fso, date ){
	var USER = require("./services/user"),
		user = new USER(),
		fs = new fso(),
		fo = date.format(new Date(), 'ymd');

	if ( user.adminStatus().admin ){
		fs.createFolder(contrast("private/uploads/" + fo));
	
		var rets = uploader.upload({
			saveto: contrast("private/uploads/" + fo),
			autoName: true,
			exts: ['jpg', 'jpeg', 'png', 'gif', 'bmp']
		});
		
		Library.log(JSON.stringify(rets));
	}else{
		Library.json({ success: false, message: "非法操作" });
	};
	try{ user.conn.Close(); }catch(e){};
})( 
	require("http").http, 
	require("upload"),
	require("fso"),
	require('date')
);
%>