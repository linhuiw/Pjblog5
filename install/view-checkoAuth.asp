<%
var error = "";
try{
	var form = require("./data.json");
	var configs = {
			netserver: form.dbip,
			access: form.dbname,
			username: form.dbusername,
			password: form.dbpassword
		};
	
	var conn = new connect("mssql", configs);
		
	(new dbo(form.tb + "members", conn)).top(1).selectAll().open(3).set("member_group", 3).save().close();
}catch(e){
	error = e.message;
}

if ( error.length > 0 ){
%>
<div class="container content">
	<div class="nav shadow radius">安装 <i class="fa fa-angle-right"></i> 错误</div>
    <div class="box shadow">
    	<div class="title"><i class="fa fa-volume-up"></i>生成管理员账号出错：</div>
        <div class="main">
        <%=error%>
        </div>
    </div>
</div>
<div class="container action">
<a href="?m=oauth" class="btn btn-danger"><i class="fa fa-chevron-circle-left"></i>上一步</a>
</div>
<%
}else{
	var IPRESS = require("../tron_modules/ipress/index");
	var iPress = new IPRESS();
	var src = "../" + iPress.setURL("control", "wrap");
	Response.Redirect(src);
}
%>