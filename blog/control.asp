<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="public/assets/css/reset.css"/>
<link rel="stylesheet" type="text/css" href="fontawesome/css/font-awesome.min.css"/>
<link rel="stylesheet" type="text/css" href="appjs/assets/blog.loading.css"/>
<link rel="stylesheet" type="text/css" href="public/assets/css/layout.css"/>
<link rel="stylesheet" type="text/css" href="public/assets/css/animate.css"/>
<script language="javascript" type="text/javascript" src="appjs/assets/jquery.js"></script>
<script language="javascript" type="text/javascript" src="appjs/assets/tronjs.js"></script>
<script language="javascript" type="text/javascript" src="private/configs/assets.js"></script>
<title>PJBlog X Controler</title>
</head>
<body>
<%
;(function( USER, HTTP, FSO, FNS ){
	var user = new USER(),
		fs = new FSO(),
		dbo = user.dbo,
		conn = user.conn,
		Params = { NoLoginUrl: "login.asp" },
		common,
		CloseConn = function(){ try{ conn.Close(); }catch(e){}; },
		m = HTTP.query("m"),
		t = HTTP.query("t"),
		u,
		s,
		SystemNavs = require("public/chips/blog.control.system.navs"),
		PluginNavs = require("private/chips/blog.control.plugin.navs"),
		tfr = require("private/chips/blog.uri.plugins"),
		PluginNavsCount = 0;
		
	if ( !m || m.length === 0 ){
		m = "home";
	};
	
	// 插入插件使用状态
	(function( n, d ){ 
		for ( var i in n ){
			n[i].stop = d.queens[d.indexs[i]].stop;
			!n[i].stop && PluginNavsCount++;
		}; 
	})( PluginNavs, tfr );
	
	common = user.adminStatus(function( rets, object ){
		
	});
	
/*	if ( !common.login ){
		CloseConn();
		Response.Redirect(Params.NoLoginUrl);
	};*/
	
	if ( !common.login || !common.admin ){
%>
	<form action="public/sync.asp?m=user&p=loginor" method="post" id="loginform">
        <div class="login">
            <h5>PJBlog X 内容管理系统</h5>
            <div class="param clearfix">
                <i class="fa fa-user-md"></i>
                <input type="text" name="UserName" placeholder="UserName.." class="col" />
            </div>
            <div class="param clearfix">
                <i class="fa fa-keyboard-o"></i>
                <input type="password" name="PassWord" placeholder="PassWord.." class="col" />
            </div>
            <input type="submit" value="登录" class="submit" />
        </div>
    </form>
    <script language="javascript" type="text/javascript">
        require('public/assets/js/blog.control.login', function(params){ new params(); });
    </script>
<%		
	}else{
%>
<!-- 系统导航 开始 -->
	<div class="header clearfix">
        <div class="logo fleft">PJBlogX<sub> . Controler</sub></div>
        <div class="achor fleft">
            <%
                ;(function( system_navs ){
                    for ( var i in system_navs ){
            %>
            <a href="?m=<%=i%>"><i class="fa <%=system_navs[i].icon%>"></i><span><%=system_navs[i].name%></span></a>
            <%			
                    }
                })( SystemNavs );
            %>
        </div>
        <div class="tool fright"></div>
    </div>
<!-- 系统导航 结束 -->
   	<div class="container clearfix <%=PluginNavsCount > 0 ? "plugins" : ""%>">
<%
		if ( PluginNavsCount > 0 ){
%>
        <div class="sidebar fleft">
            <div class="sidezone">
                <h5><i class="fa fa-hand-o-right"></i> 插件快捷列表:</h5>
               	<%
					;(function(){
						for ( var i in PluginNavs ){
							if ( PluginNavs[i] && PluginNavs[i].childs ){
				%>
                                <div class="sidezonechilds">
                                    <h6 class="clearfix">
                                        <span class="fright"><i class="fa fa-pinterest-square"></i></span>
                                        <i class="fa <%=PluginNavs[i].icon%>"></i> <%=PluginNavs[i].name%>
                                    </h6>
                                    <%
                                        for ( var j in PluginNavs[i].childs ){
                                            var items = PluginNavs[i].childs[j];
                                    %>
                                    <a href="?t=<%=i%>&m=<%=j%>"><i class="fa fa-angle-right"></i> <i class="fa <%=items.icon%>"></i><%=items.name%></a>
                                    <%
                                        }
                                    %>
                                </div>
                <%}else{%>
                				<a href="?t=<%=i%>&m=<%=PluginNavs[i].page%>"><i class="fa <%=PluginNavs[i].icon%>"></i><%=PluginNavs[i].name%></a>
                <%		
							}
						}
					})();
				%>
            </div>
        </div>
<%
		};
		
		if ( t && t.length > 0 ){
			var tf;
			if ( tfr && tfr.indexs && tfr.queens && tfr.indexs[t] && tfr.queens[tfr.indexs[t]] && !tfr.queens[tfr.indexs[t]].stop ){ 
				tf = tfr.queens[tfr.indexs[t]].folder; 
			}else{ 
				tf = "404";
			};		
			u = "private/plugins/" + tf + "/plu." + m + ".asp";
			s = "private/plugins/" + tf + "/js/plu." + m + ".js";
		}else{
			u = "public/views/blog." + m + ".asp";
			s = "public/assets/js/blog.control." + m + ".js";
		};
		
		var __u = contrast(u);
%>
        <div class="content">
            <div class="navtabs">
<%
	;(function(t){
		var icon = "", name = "", des = "";
		if ( t && t.length > 0 ){
			if ( PluginNavs[t] ){
				name = PluginNavs[t].name;
				if ( PluginNavs[t] && PluginNavs[t]["childs"] && PluginNavs[t]["childs"][m] ){
					icon = PluginNavs[t]["childs"][m].icon;
					des = PluginNavs[t]["childs"][m].name;
				}
			}
		}else{
			icon = SystemNavs[m].icon;
			name = SystemNavs[m].name;
			des = SystemNavs[m].des || "系统模块";
		}
%>
                <i class="fa <%=icon%>"></i>
                <strong><%=name%></strong>
                <span><%=des%></span>
<%
	})(t);
%>
            </div>
            <div class="content-page">
<%		
		if ( fs.exist(__u) ){
			include(u, { dbo: dbo, conn: conn, fs: fs, fns: FNS, http: HTTP, m: m, t: t });
		}else{
			Library.log('<div class="page404"><h6>404</h6><p class="info">抱歉，无法找到模板！</p><p class="uri">Miss Path: ' + u + '</p></div>');
		}
%>
            </div>
        </div>
    </div>
	<%
		if ( fs.exist(resolve(s)) ){ s = [s]; }else{ s = []; };
        s.push("public/assets/js/blog.control.lazy.js");
        LoadJscript(function(s){ require(s, function( necys, lazys ){ typeof lazys === "function" && new lazys(); typeof necys === "function" && new necys(); }); }, s);
    %>
<%
	}
	
	CloseConn();
})( 
	require("./public/services/user"), 
	require("http").http,
	require("fso"),
	require("fns")
);
%>
</body>
</html>