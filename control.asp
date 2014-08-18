<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
	// require need module
	var USER = require("./public/services/user"),
		HTTP = require("http"),
		FSO = require("fso"),
		fns = require("fns");
	
	// setup need module	
	var user = new USER(),
		http = HTTP.http,
		fs = new FSO(),
		files = { asp: "404.asp", css: "404.css", js: "404.js", pmark: "", pfolder: "", pid: 0 };
	
	// set dbo and conn	
	var dbo = user.dbo,
		conn = user.conn;
		
	var mem = { uid: 0, token: "", openid: "", avatar: "", nick: "" },
		cache = {
			global: require("private/chips/" + blog.cache + "blog.global"),
			sysnav: require("public/chips/blog.control.system.navs"),
			plunav: require("private/chips/" + blog.cache + "blog.control.plugin.navs"),
			pluasc: require("private/chips/" + blog.cache + "blog.uri.plugins")
		};
	
	// 检测用户状态
	var UserStatus = user.adminStatus(function( rets, object ){
		mem.uid = object("id").value;
		mem.token = object("member_token").value;
		mem.openid = object("member_openid").value;
		mem.avatar = object("member_avatar").value;
		mem.nick = object("member_nick").value;
	});
%>
<!DOCTYPE html>
<html lang="en" class="app">
<head>
<meta charset="utf-8" />
<title>PJBlog5 Controler</title>
<meta name="description" content="app, web app, responsive, admin dashboard, admin, flat, flat ui, ui kit, off screen nav" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="public/assets/js/jPlayer/jplayer.flat.css" type="text/css" />
<link rel="stylesheet" href="public/assets/css/bootstrap.css" type="text/css" />
<link rel="stylesheet" href="public/assets/css/animate.css" type="text/css" />
<link rel="stylesheet" href="public/assets/css/font-awesome.min.css" type="text/css" />
<link rel="stylesheet" href="public/assets/css/simple-line-icons.css" type="text/css" />
<link rel="stylesheet" href="public/assets/css/font.css" type="text/css" />
<link rel="stylesheet" href="public/assets/css/app.css" type="text/css" />
<script language="javascript" type="text/javascript" src="appjs/assets/tron.js"></script>
<script language="javascript" type="text/javascript" src="private/configs/assets.js"></script>
<!--[if lt IE 9]>
<script src="public/assets/js/ie/html5shiv.js"></script>
<script src="public/assets/js/ie/respond.min.js"></script>
<script src="public/assets/js/ie/excanvas.js"></script>
<![endif]-->
</head>
<%
if ( UserStatus.login && UserStatus.admin ){
	http.createServer(function( req ){
		if ( !req.query.m || req.query.m.length === 0 ){
			req.query.m = "home";
		};
%>
<body class="">
<section class="vbox">
  <header class="bg-white-only header header-md navbar navbar-fixed-top-xs">
    <div class="navbar-header aside bg-info nav-xs"> <a class="btn btn-link visible-xs" data-toggle="class:nav-off-screen,open" data-target="#nav,html"> <i class="icon-list"></i> </a> <a href="control.asp" class="navbar-brand text-lt"> <i class="fa fa-bug"></i><span class="hidden-nav-xs m-l-sm">PJBlog5</span> </a> <a class="btn btn-link visible-xs" data-toggle="dropdown" data-target=".user"> <i class="icon-settings"></i> </a> </div>
    <ul class="nav navbar-nav hidden-xs">
      <li> <a href="#nav,.navbar-header" data-toggle="class:nav-xs,nav-xs" class="text-muted"> <i class="fa fa-indent text"></i> <i class="fa fa-dedent text-active"></i> </a> </li>
    </ul>
    <form class="navbar-form navbar-left input-s-lg m-t m-l-n-xs hidden-xs" role="search">
      <div class="form-group">
        <div class="input-group"> <span class="input-group-btn">
          <button type="submit" class="btn btn-sm bg-white btn-icon rounded"><i class="fa fa-search"></i></button>
          </span>
          <input type="text" class="form-control input-sm no-border rounded" placeholder="Search articles, members...">
        </div>
      </div>
    </form>
    <div class="navbar-right ">
      <ul class="nav navbar-nav m-n hidden-xs nav-user user">
        <li class="hidden-xs"> <a href="#" class="dropdown-toggle lt" data-toggle="dropdown"> <i class="icon-bell"></i> <span class="badge badge-sm up bg-danger count">2</span> </a>
          <section class="dropdown-menu aside-xl animated fadeInUp">
            <section class="panel bg-white">
              <div class="panel-heading b-light bg-light"> <strong>You have <span class="count">2</span> notifications</strong> </div>
              <div class="list-group list-group-alt"> <a href="#" class="media list-group-item"> <span class="pull-left thumb-sm"> <img src="images/a0.png" alt="..." class="img-circle"> </span> <span class="media-body block m-b-none"> Use awesome animate.css<br>
                <small class="text-muted">10 minutes ago</small> </span> </a> <a href="#" class="media list-group-item"> <span class="media-body block m-b-none"> 1.0 initial released<br>
                <small class="text-muted">1 hour ago</small> </span> </a> </div>
              <div class="panel-footer text-sm"> <a href="#" class="pull-right"><i class="fa fa-cog"></i></a> <a href="#notes" data-toggle="class:show animated fadeInRight">See all the notifications</a> </div>
            </section>
          </section>
        </li>
        <li class="dropdown"> <a href="#" class="dropdown-toggle bg clear" data-toggle="dropdown"> <span class="thumb-sm avatar pull-right m-t-n-sm m-b-n-sm m-l-sm"> <img src="<%=mem.avatar%>?s=36" alt="<%=mem.nick%>"> </span> <%=mem.nick%> <b class="caret"></b> </a>
          <ul class="dropdown-menu animated fadeInRight">
            <li> <span class="arrow top"></span> <a href="?m=setting">网站设置</a> </li>
            <li> <a href="profile.html">Profile</a> </li>
            <li> <a href="#"> <span class="badge bg-danger pull-right">3</span> Notifications </a> </li>
            <li> <a href="docs.html">Help</a> </li>
            <li class="divider"></li>
            <li> <a href="modal.lockme.html" data-toggle="ajaxModal" >Logout</a> </li>
          </ul>
        </li>
      </ul>
    </div>
  </header>
  <section>
    <section class="hbox stretch"> 
      <!-- .aside -->
      <aside class="bg-black dk nav-xs aside hidden-print" id="nav">
        <section class="vbox">
          <section class="w-f-md scrollable">
            <div class="slim-scroll" data-height="auto" data-disable-fade-out="true" data-distance="0" data-size="10px" data-railOpacity="0.2">
              <nav class="nav-primary hidden-xs">
                <ul class="nav bg clearfix">
                  <li class="hidden-nav-xs padder m-t m-b-sm text-xs text-muted">Guiders</li>
                  <%
					;(function( navs ){
						for ( var i in navs ){
							if ( !navs[i].hide ){
				  %>
                  <li> <a href="?m=<%=i%>"> <i class="fa <%=navs[i].icon + " " + navs[i].color%>"></i> <span><%=navs[i].name%></span> </a> </li>
                  <%	
							}		
						}
					})( cache.sysnav );
				  %>
                </ul>
                <ul class="nav" data-ride="collapse">
                  <li class="hidden-nav-xs padder m-t m-b-sm text-xs text-muted"> Interfaces </li>
                  <%
                        ;(function( navs, lists ){
                            for ( var i in navs ){
								var mark = lists[i];
								if ( 
									!lists.indexs || 
									!lists.indexs[i] || 
									!lists.indexs[i] || 
									!lists.queens[lists.indexs[i]] ||
									lists.queens[lists.indexs[i]].stop
								){
									continue;
								};
                                if ( navs[i] && navs[i].childs ){
                    %>
                  <li > <a href="javascript:;" class="auto"> <span class="pull-right text-muted"> <i class="fa fa-angle-left text"></i> <i class="fa fa-angle-down text-active"></i> </span> <i class="fa <%=navs[i].icon%>"> </i> <span><%=navs[i].name%></span> </a>
                    <ul class="nav dk text-sm">
                      <%
									for ( var j in navs[i].childs ){
										var items = navs[i].childs[j];
					  %>
                      <li > <a href="?t=<%=i%>&m=<%=j%>" class="auto"> <i class="fa <%=items.icon%> text-xs"></i> <span><%=items.name%></span> </a> </li>
                      <%			};%>
                    </ul>
                  </li>
                  <%			}else{%>
                  <li ><a href="?t=<%=i%>&m=<%=navs[i].page%>"><i class="fa <%=navs[i].icon%>"> </i> <span><%=navs[i].name%></span> </a></li>
                  <%		
                                }
                            }
                        })( cache.plunav, cache.pluasc );
                    %>
                </ul>
              </nav>
            </div>
          </section>
        </section>
      </aside>
      <!-- /.aside -->
      <section id="content">
        <section class="vbox">
          <header class="header bg-light dk">
              <!-- .breadcrumb -->
              <ul class="breadcrumb">
                <li><a href="control.asp"><i class="fa fa-map-marker"></i> 当前位置</a></li>
                <%
					;(function( req, pnav, snav ){
						var name = "UnKnow", t = req.query.t, m = req.query.m;
						if ( t && t.length > 0 ){
							if ( pnav[t] ){
								name = pnav[t].name;
								if ( pnav[t]["childs"] && pnav[t]["childs"][m] && pnav[t]["childs"][m].name ){
									name = pnav[t]["childs"][m].name;
								}
							}
						}else{
							if ( snav[m] ){ name = snav[m].name; };
						}
				%>
                <li><%=name%></li>
                <%
					})( req, cache.plunav, cache.sysnav );
				%>
              </ul>
              <!-- / .breadcrumb -->
          </header>
          <section class="scrollable wrapper">
			<%
				;(function(lists, req){
					var t = req.query.t;
					if ( t && t.length > 0 ){
						if ( lists.indexs && lists.indexs[t] && lists.queens[lists.indexs[t]] ){
							if ( !lists.queens[lists.indexs[t]].stop ){
								files.pid = Number(t);
								files.pfolder = lists.queens[lists.indexs[t]].folder;
								files.pmark = lists.indexs[t];	
								files.asp = "private/plugins/" + files.pfolder + "/plu." + req.query.m + ".asp";
								files.css = "private/plugins/" + files.pfolder + "/plu." + req.query.m + ".css";
								files.js = "private/plugins/" + files.pfolder + "/plu." + req.query.m + ".js";
							}
						}
					}else{
						files.asp = "public/views/blog." + req.query.m + ".asp";
						files.css = "public/assets/css/blog." + req.query.m + ".css";
						files.js = "public/assets/js/blog." + req.query.m + ".js";
					};
					
					var asppath = contrast(files.asp),
						csspath = contrast(files.css),
						jspath = contrast(files.js);
					
					if ( fs.exist(csspath) ){
						LoadCssFile(files.css);
					};
					
					if ( fs.exist(asppath) ){
						include(asppath, {
							dbo: dbo, 
							conn: conn, 
							fs: fs, 
							fns: fns, 
							http: http, 
							req: req, 
							mem: mem,
							package: files
						});
					};
					
					var jses = [];
					if ( fs.exist(jspath) ){
						jses.push(files.js);
					};
					var common = {
						jses: jses,
						mem: mem
					};
					LoadJscript(function( common ){
						require(common.jses, function(args){
							for ( var i = 0 ; i < args.length ; i++ ){
								if ( args[i] ){
									if ( typeof args[i] === "function" ){
										new args[i](common.mem);
									}else{
										args[i].init && args[i].init(common.mem);
									}
								}
							}
						});
					}, common);
				})(cache.pluasc, req);
			%>
          </section>
        </section>
        <!-- / side content --> 
      </section>
    </section>
  </section>
</section>
</section>
</body>
<%});}else{%>
<body class="bg-info dker">
	<%if ( !cache.global.blog_appid ){%>
<footer id="footer" style="margin-top:100px;">
  <div class="text-center padder">
    <p> <small>您暂未获得授权，无法登陆。</small> </p>
  </div>
</footer>
	<% }else{ var oauth = require("public/library/oauth2"); %>
<section id="content" class="m-t-lg wrapper-md animated fadeInUp">
  <div class="container aside-xl"> <a class="navbar-brand block" href="http://app.webkits.cn" target="_blank"><span class="h1 font-bold">PJBlog5</span></a>
    <section class="m-b-lg">
      <header class="wrapper text-center"> <strong>官方云平台登录</strong> </header>
      <a href="<%=oauth.GetAuthorizeURL(cache.global.blog_appid, "control.asp")%>" class="btn btn-lg btn-warning lt b-white b-2x btn-block btn-rounded"> <i class="icon-arrow-right pull-right"></i><span class="m-r-n-lg">登录后台</span> </a>
      <div class="text-center m-t m-b"><a href="http://app.webkits.cn/acts/user/forget.asp" target="_blank"><small>忘记密码？</small></a></div>
      <div class="line line-dashed"></div>
      <p class="text-muted text-center"><small>想要一个新账号吗？</small></p>
      <a href="http://app.webkits.cn/acts/user/regist.asp" class="btn btn-lg btn-info btn-block rounded" target="_blank">注册新账号</a> </section>
  </div>
</section>
<!-- footer -->
<footer id="footer">
  <div class="text-center padder">
    <p> <small>PJBlog 5 controler design by evio <br>
      &copy; 2004 - 2015</small> </p>
  </div>
</footer>
<!-- / footer -->
	<%};%>
</body>
<%};%>
<script src="public/assets/js/jquery.min.js"></script>
<!-- Bootstrap -->
<script src="public/assets/js/bootstrap.js"></script>
<!-- App -->
<script src="public/assets/js/app.js"></script>
<script src="public/assets/js/slimscroll/jquery.slimscroll.min.js"></script>
<script src="public/assets/js/app.plugin.js"></script>
<script type="text/javascript" src="public/assets/js/jPlayer/jquery.jplayer.min.js"></script>
<script type="text/javascript" src="public/assets/js/jPlayer/add-on/jplayer.playlist.min.js"></script>
<script type="text/javascript" src="public/assets/js/jPlayer/demo.js"></script>
</html>
<%
	try{
		conn.Close();
	}catch(e){};
%>