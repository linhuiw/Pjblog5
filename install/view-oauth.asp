<%
fs(contrast("../mockup.asp")).exist().remove();
var data = require("./data.json"), IPRESS, iPress, src;
if ( data.mode === undefined ){
	Response.Redirect("?");
}else{
	if ( !data.end ){
		data.end = true;
		fs(contrast("./data.json")).create(JSON.stringify(data));
	}
}
if ( data.mode === 1 ){
	IPRESS = require("../tron_modules/ipress/index");
	iPress = new IPRESS();
	src = "../" + iPress.setURL("oauth", "jump",  {m: "setup" });
	Response.Redirect(src);
}else{
	var configs = {
		netserver: data.dbip,
		access: data.dbname,
		username: data.dbusername,
		password: data.dbpassword
	};
	
	var conn = new connect('mssql', configs);
	(new dbo(data.tb + "members", conn)).selectAll().and("id", 1).open(3).exec(function(){
		this.set({
			member_mark: '',
			member_nick: 'admin',
			member_hashkey: "123456",
			member_mail: '',
			member_group: 3,
			member_forbit: false,
			member_avatar: ''
		}).save();
	}, function(){
		this.create().set({
			member_mark: '',
			member_nick: 'admin',
			member_hashkey: "123456",
			member_mail: '',
			member_group: 3,
			member_forbit: false,
			member_avatar: ''
		}).save();
	}).close();
	
	var ds = require("../private/config.json");
	
	var $ = require("../tron_modules/cookie/index");
	var newDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
	$.cookie(ds.pix + 'user_id', '1', { expires: newDate, path: '/' + ds.base });
	$.cookie(ds.pix + 'user_hashkey', '123456', { expires: newDate, path: '/' + ds.base });
	IPRESS = require("../tron_modules/ipress/index");
	iPress = new IPRESS();
	src = "../" + iPress.setURL("control", "wrap");
	Response.Redirect(src);
}
%>