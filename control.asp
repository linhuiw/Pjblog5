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
		fs = new FSO();
	
	// set dbo and conn	
	var dbo = user.dbo,
		conn = user.conn;
		
	var mem = { uid: 0, token: "", openid: "", avatar: "", nick: "" },
		cache = {
			global: require("private/chips/" + blog.cache + "blog.global"),
			sysnav: require("public/chips/blog.control.system.navs"),
			plunav: require("private/chips/" + blog.cache + "blog.control.plugin.navs")
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
<!--[if lt IE 9]>
<script src="public/assets/js/ie/html5shiv.js"></script>
<script src="public/assets/js/ie/respond.min.js"></script>
<script src="public/assets/js/ie/excanvas.js"></script>
<![endif]-->
</head>
<%
	if ( UserStatus.login && UserStatus.admin ){
%>
<body class="">
<section class="vbox">
  <header class="bg-white-only header header-md navbar navbar-fixed-top-xs">
    <div class="navbar-header aside bg-info nav-xs"> <a class="btn btn-link visible-xs" data-toggle="class:nav-off-screen,open" data-target="#nav,html"> <i class="icon-list"></i> </a> <a href="control.asp" class="navbar-brand text-lt"> <i class="fa fa-bug"></i> <img src="images/logo.png" alt="." class="hide"> <span class="hidden-nav-xs m-l-sm">PJBlog5</span> </a> <a class="btn btn-link visible-xs" data-toggle="dropdown" data-target=".user"> <i class="icon-settings"></i> </a> </div>
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
                  <li> <a href="?m=<%=i%>"> <i class="fa <%=navs[i].icon + " " + navs[i].color%>"></i> <span class="font-bold"><%=navs[i].name%></span> </a> </li>
                  <%	
							}		
						}
					})( cache.sysnav );
				  %>
                </ul>
                <ul class="nav" data-ride="collapse">
                  <li class="hidden-nav-xs padder m-t m-b-sm text-xs text-muted"> Interfaces </li>
                  <%
                        ;(function( navs ){
                            for ( var i in navs ){
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
                        })( cache.plunav );
                    %>
                </ul>
              </nav>
            </div>
          </section>
        </section>
      </aside>
      <!-- /.aside -->
      <section id="content">
        <section class="hbox stretch">
          <section>
            <section class="vbox">
              <section class="scrollable padder-lg w-f-md" id="bjax-target"> <a href="#" class="pull-right text-muted m-t-lg" data-toggle="class:fa-spin" ><i class="icon-refresh i-lg  inline" id="refresh"></i></a>
                <h2 class="font-thin m-b">Discover <span class="musicbar animate inline m-l-sm" style="width:20px;height:20px"> <span class="bar1 a1 bg-primary lter"></span> <span class="bar2 a2 bg-info lt"></span> <span class="bar3 a3 bg-success"></span> <span class="bar4 a4 bg-warning dk"></span> <span class="bar5 a5 bg-danger dker"></span> </span></h2>
                <div class="row row-sm">
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="bottom"> <span class="badge bg-info m-l-sm m-b-sm">03:20</span> </div>
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p1.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Tempered Song</a> <a href="#" class="text-ellipsis text-xs text-muted">Miaow</a> </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black active">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#" data-toggle="class"> <i class="icon-control-play i-2x text"></i> <i class="icon-control-pause i-2x text-active"></i> </a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right active" data-toggle="class"> <i class="fa fa-heart-o text"></i> <i class="fa fa-heart text-active text-danger"></i> </a> <a href="#" data-toggle="class"> <i class="fa fa-plus-circle text"></i> <i class="fa fa-check-circle text-active text-info"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p2.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Vivamus vel tincidunt libero</a> <a href="#" class="text-ellipsis text-xs text-muted">Lauren Taylor</a> </div>
                    </div>
                  </div>
                  <div class="clearfix visible-xs"></div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p3.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Morbi id neque quam liquam sollicitudin</a> <a href="#" class="text-ellipsis text-xs text-muted">Allen JH</a> </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <div class="top"> <span class="pull-right m-t-n-xs m-r-sm text-white"> <i class="fa fa-bookmark i-lg"></i> </span> </div>
                        <a href="#"><img src="images/p4.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Tincidunt libero</a> <a href="#" class="text-ellipsis text-xs text-muted">Amanda Conlan</a> </div>
                    </div>
                  </div>
                  <div class="clearfix visible-xs"></div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p5.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Fermentum diam</a> <a href="#" class="text-ellipsis text-xs text-muted">Nisa Colen</a> </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="top"> <span class="pull-right m-t-sm m-r-sm badge bg-info">6</span> </div>
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p6.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Habitant</a> <a href="#" class="text-ellipsis text-xs text-muted">Dan Doorack</a> </div>
                    </div>
                  </div>
                  <div class="clearfix visible-xs"></div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <div class="top"> <span class="pull-right m-t-sm m-r-sm badge bg-white">12</span> </div>
                        <a href="#"><img src="images/p7.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Vivamus vel tincidunt libero</a> <a href="#" class="text-ellipsis text-xs text-muted">Ligula H</a> </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p8.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Aliquam sollicitudin venenati</a> <a href="#" class="text-ellipsis text-xs text-muted">James East</a> </div>
                    </div>
                  </div>
                  <div class="clearfix visible-xs"></div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p9.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Lementum ligula vitae</a> <a href="#" class="text-ellipsis text-xs text-muted">Lauren Taylor</a> </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay r r-2x bg-light dker active">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#" data-toggle="class" class="active"> <i class="icon-control-play i-2x text"></i> <i class="icon-control-pause i-2x text-active"></i> </a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right" data-toggle="class"> <i class="fa fa-heart-o text"></i> <i class="fa fa-heart text-active text-danger"></i> </a> <a href="#" class="active" data-toggle="class"> <i class="fa fa-plus-circle text"></i> <i class="fa fa-check-circle text-active text-info"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p10.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Egestas dui nec fermentum </a> <a href="#" class="text-ellipsis text-xs text-muted">Chris Fox</a> </div>
                    </div>
                  </div>
                  <div class="clearfix visible-xs"></div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p11.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Aliquam sollicitudin venenatis ipsum</a> <a href="#" class="text-ellipsis text-xs text-muted">Jack Jason</a> </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="item">
                      <div class="pos-rlt">
                        <div class="item-overlay opacity r r-2x bg-black">
                          <div class="text-info padder m-t-sm text-sm"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o text-muted"></i> </div>
                          <div class="center text-center m-t-n"> <a href="#"><i class="icon-control-play i-2x"></i></a> </div>
                          <div class="bottom padder m-b-sm"> <a href="#" class="pull-right"> <i class="fa fa-heart-o"></i> </a> <a href="#"> <i class="fa fa-plus-circle"></i> </a> </div>
                        </div>
                        <a href="#"><img src="images/p12.jpg" alt="" class="r r-2x img-full"></a> </div>
                      <div class="padder-v"> <a href="#" class="text-ellipsis">Vestibulum ullamcorper</a> <a href="#" class="text-ellipsis text-xs text-muted">MM &amp; DD</a> </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-7">
                    <h3 class="font-thin">New Songs</h3>
                    <div class="row row-sm">
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a2.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Spring rain</a> <a href="#" class="text-ellipsis text-xs text-muted">Miaow</a> </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a3.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Hope</a> <a href="#" class="text-ellipsis text-xs text-muted">Miya</a> </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a8.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Listen wind</a> <a href="#" class="text-ellipsis text-xs text-muted">Soyia Jess</a> </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a9.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Breaking me</a> <a href="#" class="text-ellipsis text-xs text-muted">Pett JA</a> </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a1.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Nothing</a> <a href="#" class="text-ellipsis text-xs text-muted">Willion</a> </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a6.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Panda Style</a> <a href="#" class="text-ellipsis text-xs text-muted">Lionie</a> </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a7.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Hook Me</a> <a href="#" class="text-ellipsis text-xs text-muted">Gossi</a> </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                        <div class="item">
                          <div class="pos-rlt">
                            <div class="item-overlay opacity r r-2x bg-black">
                              <div class="center text-center m-t-n"> <a href="#"><i class="fa fa-play-circle i-2x"></i></a> </div>
                            </div>
                            <a href="#"><img src="images/a5.png" alt="" class="r r-2x img-full"></a> </div>
                          <div class="padder-v"> <a href="#" class="text-ellipsis">Tempered Song</a> <a href="#" class="text-ellipsis text-xs text-muted">Miaow</a> </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <h3 class="font-thin">Top Songs</h3>
                    <div class="list-group bg-white list-group-lg no-bg auto"> <a href="#" class="list-group-item clearfix"> <span class="pull-right h2 text-muted m-l">1</span> <span class="pull-left thumb-sm avatar m-r"> <img src="images/a4.png" alt="..."> </span> <span class="clear"> <span>Little Town</span> <small class="text-muted clear text-ellipsis">by Chris Fox</small> </span> </a> <a href="#" class="list-group-item clearfix"> <span class="pull-right h2 text-muted m-l">2</span> <span class="pull-left thumb-sm avatar m-r"> <img src="images/a5.png" alt="..."> </span> <span class="clear"> <span>Lementum ligula vitae</span> <small class="text-muted clear text-ellipsis">by Amanda Conlan</small> </span> </a> <a href="#" class="list-group-item clearfix"> <span class="pull-right h2 text-muted m-l">3</span> <span class="pull-left thumb-sm avatar m-r"> <img src="images/a6.png" alt="..."> </span> <span class="clear"> <span>Aliquam sollicitudin venenatis</span> <small class="text-muted clear text-ellipsis">by Dan Doorack</small> </span> </a> <a href="#" class="list-group-item clearfix"> <span class="pull-right h2 text-muted m-l">4</span> <span class="pull-left thumb-sm avatar m-r"> <img src="images/a7.png" alt="..."> </span> <span class="clear"> <span>Aliquam sollicitudin venenatis ipsum</span> <small class="text-muted clear text-ellipsis">by Lauren Taylor</small> </span> </a> <a href="#" class="list-group-item clearfix"> <span class="pull-right h2 text-muted m-l">5</span> <span class="pull-left thumb-sm avatar m-r"> <img src="images/a8.png" alt="..."> </span> <span class="clear"> <span>Vestibulum ullamcorper</span> <small class="text-muted clear text-ellipsis">by Dan Doorack</small> </span> </a> </div>
                  </div>
                </div>
                <div class="row m-t-lg m-b-lg">
                  <div class="col-sm-6">
                    <div class="bg-primary wrapper-md r"> <a href="#"> <span class="h4 m-b-xs block"><i class=" icon-user-follow i-lg"></i> Login or Create account</span> <span class="text-muted">Save and share your playlist with your friends when you log in or create an account.</span> </a> </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="bg-black wrapper-md r"> <a href="#"> <span class="h4 m-b-xs block"><i class="icon-cloud-download i-lg"></i> Download our app</span> <span class="text-muted">Get the apps for desktop and mobile to start listening music at anywhere and anytime.</span> </a> </div>
                  </div>
                </div>
              </section>
              
            </section>
          </section>
          <!-- side content -->
          <aside class="aside-md bg-light dk" id="sidebar">
            <section class="vbox animated fadeInRight">
              <section class="w-f-md scrollable hover">
                <h4 class="font-thin m-l-md m-t">Connected</h4>
                <ul class="list-group no-bg no-borders auto m-t-n-xxs">
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a1.png" alt="..." class="img-circle"> <i class="on b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Chris Fox</a></div>
                      <small class="text-muted">New York</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a2.png" alt="..."> <i class="on b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Amanda Conlan</a></div>
                      <small class="text-muted">France</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a3.png" alt="..."> <i class="busy b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Dan Doorack</a></div>
                      <small class="text-muted">Hamburg</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a4.png" alt="..."> <i class="away b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Lauren Taylor</a></div>
                      <small class="text-muted">London</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a5.png" alt="..." class="img-circle"> <i class="on b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Chris Fox</a></div>
                      <small class="text-muted">Milan</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a6.png" alt="..."> <i class="on b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Amanda Conlan</a></div>
                      <small class="text-muted">Copenhagen</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a7.png" alt="..."> <i class="busy b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Dan Doorack</a></div>
                      <small class="text-muted">Barcelona</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a8.png" alt="..."> <i class="away b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Lauren Taylor</a></div>
                      <small class="text-muted">Tokyo</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a9.png" alt="..." class="img-circle"> <i class="on b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Chris Fox</a></div>
                      <small class="text-muted">UK</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a1.png" alt="..."> <i class="on b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Amanda Conlan</a></div>
                      <small class="text-muted">Africa</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a2.png" alt="..."> <i class="busy b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Dan Doorack</a></div>
                      <small class="text-muted">Paris</small> </div>
                  </li>
                  <li class="list-group-item"> <span class="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm"> <img src="images/a3.png" alt="..."> <i class="away b-light right sm"></i> </span>
                    <div class="clear">
                      <div><a href="#">Lauren Taylor</a></div>
                      <small class="text-muted">Brussels</small> </div>
                  </li>
                </ul>
              </section>
              <footer class="footer footer-md bg-black">
                <form class="" role="search">
                  <div class="form-group clearfix m-b-none">
                    <div class="input-group m-t m-b"> <span class="input-group-btn">
                      <button type="submit" class="btn btn-sm bg-empty text-muted btn-icon"><i class="fa fa-search"></i></button>
                      </span>
                      <input type="text" class="form-control input-sm text-white bg-empty b-b b-dark no-border" placeholder="Search members">
                    </div>
                  </div>
                </form>
              </footer>
            </section>
          </aside>
          <!-- / side content --> 
        </section>
        <a href="#" class="hide nav-off-screen-block" data-toggle="class:nav-off-screen,open" data-target="#nav,html"></a> </section>
    </section>
  </section>
</section>
</body>
<%}else{%>
<body class="bg-info dker">
<%if ( !cache.global.blog_appid ){%>
<footer id="footer" style="margin-top:100px;">
  <div class="text-center padder">
    <p> <small>您暂未获得授权，无法登陆。</small> </p>
  </div>
</footer>
<%	
	}else{
	var oauth = require("public/library/oauth2");
%>
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