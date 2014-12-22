<%
var error = "";
http.createServer(function(req){
	var form = req.form;
	if ( form.name.length === 0 ){
		error = "网站名不能为空";
		return;
	};
	
	if ( form.tb.length === 0 ){
		form.tb = "blog_";
	};
	
	if ( !/\_$/.test(form.tb) ){
		form.tb += "_";
	};
	
	if ( form.dbname.length === 0 ){
		error = "数据库名称不能为空";
		return;
	};
	
	if ( form.dbip.length === 0 ){
		form.dbip = ".";
	};
	
	if ( form.dbip.toLowerCase() === "localhost" ){
		form.dbip = ".";
	};
	
	if ( form.dbusername.length === 0 ){
		error = "数据库用户名不能为空";
		return;
	};
	
	if ( form.dbpassword.length === 0 ){
		error = "数据库密码不能为空";
		return ;
	}
	
	if ( !form.folder ){
		form.folder = "";
	};
	
	form.web = form.web.replace(/\/$/, "");
	
	form.mode = Number(form.mode);
	
	if ( form.mode === 1 ){
		if ( form.appid.length === 0 ){
			error = "appid不能为空";
			return ;
		};
		if ( form.appkey.length === 0 ){
			error = "appkey不能为空";
			return;
		}
	};
	try{
		var conn = new connect('mssql', {
				netserver: form.dbip,
				access: form.dbname,
				username: form.dbusername,
				password: form.dbpassword
			});
		
		if ( !conn ){
			error = "数据库连接失败";
			return;
		};
	}catch(e){
		error = "数据库连接失败";
		return;
	}
	
	conn.Close();
	conn = null;
	
	if ( form.mode === 1 ){
		try{
			var _ = new ajax();
			var msg = _.getJSON('http://app.webkits.cn/oauth/setup', {
				oauth_consumer_key: form.appid,
				oauth_consumer_url: form.web.replace(/^http\:\/\//i, '').replace(/\\/g, "/").replace(/^\//, "").replace(/\/$/, "").split('/')[0]
			});
			
			if ( msg && msg.error > 0 ){
				error = "网站域名未授权，无法安装，请先在官方平台的授权中心提交你的授权域名";
				return;
			}
		}catch(e){
			error = "验证网站域名授权失败，无法安装，请联系官方平台管理员";
			return;
		}
	}
	
	fs(contrast("./data.json")).create(JSON.stringify(form));
});
if ( error.length > 0 ){
%>
<div class="container content">
	<div class="nav shadow radius">安装 <i class="fa fa-angle-right"></i> 错误</div>
    <div class="box shadow">
    	<div class="title"><i class="fa fa-volume-up"></i>您的配置不正确：</div>
        <div class="main">
        <%=error%>
        </div>
    </div>
</div>
<div class="container action">
<a href="?m=data" class="btn btn-danger"><i class="fa fa-chevron-circle-left"></i>上一步</a>
</div>
<%	
}else{
	Response.Redirect("?m=install");	
}
%>