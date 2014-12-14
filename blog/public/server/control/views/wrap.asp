<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
	<title>PJBlog5 Control Studio</title>

    <!-- Bootstrap -->
    <script src="http://tron.webkits.cn/tron.min.js"></script>
    <script src="http://tron.webkits.cn/tron.maps.js"></script>
    <%
    	modules.scriptExec(function(argcs){
    		Library.setBase(argcs.base);
    	}, {base: blog.base});
    %>
    <script language="javascript"> require('com-plugin-pace').then(function(pace){ pace[0].start({ document: false });}); </script>
    <!-- bootstrap 3.0.2 -->
    <link href="public/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- font Awesome -->
    <link href="public/assets/bootstrap/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <!-- Ionicons -->
    <link href="public/assets/bootstrap/css/ionicons.min.css" rel="stylesheet" type="text/css" />
    <!-- Theme style -->
    <link href="public/assets/bootstrap/css/AdminLTE.css" rel="stylesheet" type="text/css" />
    <%
		if ( files.css ){
			fs(contrast(files.css)).exist().then(function(){
				modules.writeCss(files.css.replace(/^\:/, ''));
			});
		}
	%>
   

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="skin-black">
<!-- header logo: style can be found in header.less -->
        <header class="header">
            <a href="<%=iPress.setURL('page', 'home')%>" target="_blank" class="logo">
                <!-- Add the class icon to your logo image or logo icon to add the margining -->
                PJBlog5 iPress
            </a>
            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top" role="navigation">
                <!-- Sidebar toggle button-->
                <a href="#" class="navbar-btn sidebar-toggle" data-toggle="offcanvas" role="button">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </a>
                <div class="navbar-right">
                    <ul class="nav navbar-nav">
                        <!-- Messages: style can be found in dropdown.less-->
                        <li class="dropdown messages-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-envelope"></i>
                                <span class="label label-warning">4</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="header">You have 4 messages</li>
                                <li>
                                    <!-- inner menu: contains the actual data -->
                                    <ul class="menu">
                                        <li><!-- start message -->
                                            <a href="#">
                                                <div class="pull-left">
                                                    <img src="" class="img-circle" alt="User Image"/>
                                                </div>
                                                <h4>
                                                    Support Team
                                                    <small><i class="fa fa-clock-o"></i> 5 mins</small>
                                                </h4>
                                                <p>Why not buy a new awesome theme?</p>
                                            </a>
                                        </li><!-- end message -->
                                        <li>
                                            <a href="#">
                                                <div class="pull-left">
                                                    <img src="" class="img-circle" alt="user image"/>
                                                </div>
                                                <h4>
                                                    AdminLTE Design Team
                                                    <small><i class="fa fa-clock-o"></i> 2 hours</small>
                                                </h4>
                                                <p>Why not buy a new awesome theme?</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <div class="pull-left">
                                                    <img src="" class="img-circle" alt="user image"/>
                                                </div>
                                                <h4>
                                                    Developers
                                                    <small><i class="fa fa-clock-o"></i> Today</small>
                                                </h4>
                                                <p>Why not buy a new awesome theme?</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <div class="pull-left">
                                                    <img src="" class="img-circle" alt="user image"/>
                                                </div>
                                                <h4>
                                                    Sales Department
                                                    <small><i class="fa fa-clock-o"></i> Yesterday</small>
                                                </h4>
                                                <p>Why not buy a new awesome theme?</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <div class="pull-left">
                                                    <img src="" class="img-circle" alt="user image"/>
                                                </div>
                                                <h4>
                                                    Reviewers
                                                    <small><i class="fa fa-clock-o"></i> 2 days</small>
                                                </h4>
                                                <p>Why not buy a new awesome theme?</p>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="footer"><a href="#">See All Messages</a></li>
                            </ul>
                        </li>
                        
                        <!-- User Account: style can be found in dropdown.less -->
                        <li class="dropdown user user-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="glyphicon glyphicon-user"></i>
                                <span><%=blog.user.nick%> <i class="caret"></i></span>
                            </a>
                            <ul class="dropdown-menu">
                                <!-- User image -->
                                <li class="user-header bg-light-blue">
                                    <img src="" class="img-circle" alt="User Image" />
                                    <p>
                                        Jane Doe - Web Developer
                                        <small>Member since Nov. 2012</small>
                                    </p>
                                </li>
                                <!-- Menu Body -->
                                <li class="user-body">
                                    <div class="col-xs-4 text-center">
                                        <a href="#">Followers</a>
                                    </div>
                                    <div class="col-xs-4 text-center">
                                        <a href="#">Sales</a>
                                    </div>
                                    <div class="col-xs-4 text-center">
                                        <a href="#">Friends</a>
                                    </div>
                                </li>
                                <!-- Menu Footer-->
                                <li class="user-footer">
                                    <div class="pull-left">
                                        <a href="#" class="btn btn-default btn-flat">Profile</a>
                                    </div>
                                    <div class="pull-right">
                                        <a href="#" class="btn btn-default btn-flat">Sign out</a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <div class="wrapper row-offcanvas row-offcanvas-left">
            <!-- Left side column. contains the logo and sidebar -->
            <aside class="left-side sidebar-offcanvas">                
                <!-- sidebar: style can be found in sidebar.less -->
                <section class="sidebar">
                    <!-- Sidebar user panel -->
                    <div class="user-panel">
                        <div class="pull-left image">
                            <img src="<%=blog.user.avatar + '/64'%>" class="img-circle" alt="User Image" />
                        </div>
                        <div class="pull-left info">
                            <p>Hello, <%=blog.user.nick%></p>

                            <a href="<%=blog.appsite + '/me'%>" target="_blank"><i class="fa fa-circle text-info"></i> 个人中心</a>
                        </div>
                    </div>
                    <!-- /.search form -->
                    <!-- sidebar menu: : style can be found in sidebar.less -->
                    <div class="sidebar-nav-tip">系统导航</div>
                    <ul class="sidebar-menu">
                        <%
                            system.forEach(function(o){
                        %>
                        <li class="<%=(o.drops + " " + o.active)%>">
                            <a href="<%=o.url%>">
                                <i class="fa <%=o.icon%>"></i> <span><%=o.name%></span>
                                <%if (o.childs && o.childs.length > 0){%><i class="fa fa-angle-left pull-right"></i><%}%>
                            </a>
							<% if ( o.childs && o.childs.length > 0 ) {%>
                            <ul class="treeview-menu">
                            <%
                                o.childs.forEach(function(z){
                            %>
                            <li class="<%=z.active%>"><a href="<%=z.url%>"><i class="fa fa-angle-double-right"></i> <%=z.name%></a></li>
                            <%      
                                });
                            %>
                            </ul>
                            <%}%>
                        </li>
                        <%
                            });
                        %>
                    </ul>
                    <%
                        if ( plugins.length > 0 ){
                    %>
                    <div class="sidebar-nav-tip">插件入口</div>
                    <ul class="sidebar-menu">
                    <%
                        plugins.forEach(function(o){
                    %>
                    <li class="<%=(o.drops + " " + o.active)%>">
                        <a href="<%=o.url%>">
                            <i class="fa <%=o.icon%>"></i> <span><%=o.name%></span>
                            <%if (o.childs && o.childs.length > 0){%><i class="fa fa-angle-left pull-right"></i><%}%>
                        </a>
						<% if ( o.childs && o.childs.length > 0 ) {%>
                        <ul class="treeview-menu">
                        <%
                            o.childs.forEach(function(z){
                        %>
                        <li class="<%=z.active%>"><a href="<%=z.url%>"><i class="fa fa-angle-double-right"></i> <%=z.name%></a></li>
                        <%      
                            });
                        %>
                        </ul>
                        <%}%>
                    </li>
                    <%        
                        });
                    %>
                    </ul>
                    <%        
                        }
                    %>
                </section>
                <!-- /.sidebar -->
            </aside>

            <!-- Right side column. Contains the navbar and content of the page -->
            <aside class="right-side">                
                <!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1><i class="fa <%=crumbIcon%>"></i><%=crumbTitle%></h1>
                    <ol class="breadcrumb">
                    	<%
                    		crumbs.forEach(function(name){
                    	%>
                    	<li><%=name%></li>
                    	<%
                    		});
                    	%>
                    </ol>
                </section>

                <!-- Main content -->
                <section class="content">
                 <%
				 try{
                 	if ( files.asp ){
						if ( typeof compiles === 'undefined' ){
							compiles = {};
						}
                 		include(files.asp, compiles);
                 	}else{
                 		console.log('找不到文件[' + files.asp + ']');
                 	}
				}catch(e){
					console.log(e.message);
				}
                 %>

                </section><!-- /.content -->
            </aside><!-- /.right-side -->
        </div><!-- ./wrapper -->
		<%
			files.iPressFile = typeof iPressFile !== "undefined" ? iPressFile : null;
			modules.scriptExec(function(file){
				require("jquery")
				.then(function(jQuerys){ if ( !window.jQuery ){ window.$ = window.jQuery = jQuerys[0]; } })
				.then(function(){ return require(["public/assets/bootstrap/js/bootstrap.min.js"]); })
				.then(function(){ return require(["public/assets/bootstrap/js/AdminLTE/app.js"]); })
				.then(function(){ return require(["tron_modules/iPress/index.js"]); })
				.then(function(iPr){
					window.iPress = iPr[0];
					if ( file.iPressFile ){ return require([file.iPressFile]); };
				})
				.then(function(theme){
					if ( theme ){
						window.iPress.extend(theme[0]);
					}
					window.iPress = new window.iPress();
				})
				.then(function(){
					var arr = [":public/assets/js/common"];
					if ( file.js ){ arr.push(file.js); };
					require(arr, function( common, installers ){
						new common();
						if ( typeof installers == "function" ){
							new installers();
						}
					})
				});
			}, files);
		%>
</body>
</html>