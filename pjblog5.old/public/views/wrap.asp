<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>PJBlog5 Control Studio</title>

    <!-- Bootstrap -->
    <script src="http://tron.cn/tron.js"></script>
    <script src="http://tron.webkits.cn/tron.maps.js"></script>
    <script language="javascript"> require('com-plugin-pace').then(function(){ pace.start({ document: false }); }); </script>
    <link href="public/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="public/assets/bootstrap/css/font-awesome.min.css" rel="stylesheet">
    <link href="public/assets/bootstrap/css/bootstrap-theme.css" rel="stylesheet">
   

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="niceScroll">
<div class="page">
	<header class="clearfix">
    	<div class="pull-left">
        	<a class="navbar-brand pull-left transition-fast" href="#"><i class="fa fa-lg fa-fw fa-bars"></i></a>
            <ol class="breadcrumb pull-left">
            	<%
					foreach(blog.localtions, function(data, i){
						if ( i + 1 === blog.localtions.length ){
				%>
                <li><span data-placement="bottom" data-toggle="tooltip" data-original-title="<%=data.des%>"><i class="fa <%=data.icon%>"></i><%=data.name%></span></li>
                <%			
						}else{
				%>
                <li><a href="?m=<%=data.mark%>" data-placement="bottom" data-toggle="tooltip" data-original-title="<%=data.des%>"><i class="fa <%=data.icon%>"></i><%=data.name%></a></li>
                <%			
						};
					});
				%>
            </ol>
        </div>
        <div class="pull-right tools">
        	<a href="javascript:;" class="fa fa-lg fa-fw fa-bell-o" data-placement="bottom" data-toggle="tooltip" data-original-title="云端提醒"></a>
        	<a href="javascript:;" class="fa fa-lg fa-fw fa-envelope-o" data-placement="bottom" data-toggle="tooltip" data-original-title="云端消息"></a>
        	<a href="javascript:;" class="fa fa-lg fa-fw fa-power-off" data-placement="bottom" data-toggle="tooltip" data-original-title="退出登录"></a>
        </div>
    </header>
    <div class="page-side niceScroll">
        <div class="header-seperation">
			<div class="header-logo clearfix">
            	<a href="http://app.webkits.cn" target="_blank" class="pull-left site-name">PJBlog5</a>
                <div class="site-urls pull-right">
                	<a href="default.asp" target="_blank" class="pull-left" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="回前台首页"><i class="fa fa-map-marker transition-fast"></i></a>
                    <a href="control.asp" target="_blank" class="pull-left active" data-toggle="tooltip" data-placement="left" title="" data-original-title="回后台首页"><i class="fa fa-home transition-fast"></i></a>
                </div>
            </div>
            <div class="sidebar-profile clearfix">
            	<a href=""><img class="img-circle profile-image pull-left" src="<%=blog.user.avatar%>/64"></a>
                <div class="profile-body">
                    <h4><%=blog.user.nick%></h4>
                    <div class="sidebar-user-links">
                        <a class="btn btn-link btn-xs" href="http://app.webkits.cn/me" target="_blank" data-placement="bottom" data-toggle="tooltip" data-original-title="个人中心"><i class="fa fa-user"></i></a>
                        <a class="btn btn-link btn-xs" href="javascript:;" data-placement="bottom" data-toggle="tooltip" data-original-title="云端消息"><i class="fa fa-envelope"></i></a>
                        <a class="btn btn-link btn-xs" href="?m=setting" data-placement="bottom" data-toggle="tooltip" data-original-title="全局设置"><i class="fa fa-cog"></i></a>
                        <a class="btn btn-link btn-xs" href="javascript:;" data-placement="bottom" data-toggle="tooltip" data-original-title="退出登录"><i class="fa fa-power-off"></i></a>
                    </div>
                </div>
            </div>
            <p class="menu-title">系统导航</p>
            <ul class="nav nav-pills nav-stacked">
            	<%
				forIn(blog.snav, function(data, mark){
				if ( !data.hide ){
					if ( mark === req.query.m ){
				%>
                <li class="active">
                <%		
					}else{
				%>
                <li>
                <%		
					};
				%>
                	<a href="?m=<%=mark%>" title="<%=data.des%>">
                        <i class="fa fa-lg fa-fw <%=data.icon%> fas"></i> <%=data.name%>
                        <span class="pull-right"><i class="fa fa-angle-right"></i></span>
                    </a>
                </li>
                <%	
				};
				});
				%>
            </ul>
            <p class="menu-title">快捷插件</p>
            <ul class="nav nav-pills nav-stacked">
            	<%
					forIn(blog.pnav, function(pdatas, pids){
				%>
                <li class="nav-dropdown <%=Number(pids) === Number(req.query.t) && !pdatas.childs ? "active" : ""%>">
                	<%
					if ( pdatas.childs ){
					%>
                    <a href="javascript:;">
                    <%
					}else{
					%>
                    <a href="?m=<%=pdatas.page%>&t=<%=pids%>">
                    <%	
					}
					%>
                        <i class="fa fa-lg fa-fw <%=pdatas.icon%> fas"></i> <%=pdatas.name%>
                        <span class="pull-right"><i class="fa fa-angle-right"></i></span>
                    </a>
                    <%
						if ( pdatas.childs ){
					%><ul><%
							forIn(pdatas.childs, function(pdata, pid){
								if ( Number(pids) === Number(req.query.t) && pid === req.query.m ){
					%>
                    <li class="active">
                    <%				
								}else{
					%>
                    <li>
                    <%				
								}
					%>
                    	<a href="?m=<%=pid%>&t=<%=pids%>">
                            <i class="fa fa-lg fa-fw <%=pdata.icon%> fas"></i> <%=pdata.name%>
                            <span class="pull-right"><i class="fa fa-angle-right"></i></span>
                        </a>
                    </li>
                    <%				
							});
					%>
                    </ul>
                    <%
						}
					%>
                </li>
                <%		
					});
				%>
            </ul>
        </div>
    </div>
    <div class="page-content">
    	<div class="exist"></div>
        <%
		if ( fs.exist(contrast(blog.file.asp)) ){
			include(blog.file.asp);
		}else{
			include("public/views/404.asp");
		}
		%>
    </div>
</div>
	<%
		;(function(){
			
			var deps = [];

			if ( blog.file.css && blog.file.css.length > 0 && fs.exist(contrast(blog.file.css)) ){
				deps.push(blog.file.css);
			};
			
			if ( blog.file.js && blog.file.js.length > 0 && fs.exist(resolve(blog.file.js)) ){
				deps.push(blog.file.js);
			};

			LoadJscript(function( deps ){
				require("jquery").then(function(jQuery){
					if ( !window.$ ){
						window.$ = window.jQuery = jQuery;
					};
					
					return require(["public/assets/bootstrap/js/bootstrap.min.js", "jquery-plugin-nicescroll"]);
				}).then(function(){

					$("*[data-toggle='tooltip']").tooltip();
					$(".niceScroll").niceScroll({ cursorcolor:"rgba(0,0,0,.8)", cursoropacitymax:1, touchbehavior:false, cursorwidth:"5px", cursorborder:"0", cursorborderradius:"5px" });
					require(deps, function(){
						for ( var i = 0 ; i < arguments.length ; i++ ){
							var argc = arguments[i];
							if ( typeof argc === "function" ){
								new argc();	
							}
						}
					});
				});
			}, deps);
			
		})();
	%>
</body>
</html>