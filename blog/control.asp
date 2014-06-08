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
;(function( USER ){
	var user = new USER(),
		dbo = user.dbo,
		conn = user.conn,
		Params = { NoLoginUrl: 'login.asp' },
		common,
		CloseConn = function(){ try{ conn.Close(); }catch(e){}; };
	
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
	<div class="header clearfix">
        <div class="logo fleft">PJBlogX</div>
        <div class="achor fleft">
   			<%
				;(function( system_navs ){
					for ( var i in system_navs ){
			%>
            <a href="#"><i class="fa <%=system_navs[i].icon%>"></i><span><%=system_navs[i].name%></span></a>
            <%			
					}
				})( require("private/chips/blog.control.system.navs") );
			%>
<!--            <a href="#"><i class="fa fa-home"></i><span>主页</span></a>
            <a href="#"><i class="fa fa-cogs"></i><span>设置</span></a>
            <a href="#"><i class="fa fa-list-ul"></i><span>分类</span></a>
            <a href="#"><i class="fa fa-file-text-o"></i><span>文章</span></a>
            <a href="#"><i class="fa fa-user"></i><span>用户</span></a>
            <a href="#"><i class="fa fa-tachometer"></i><span>权限</span></a>
            <a href="#"><i class="fa fa-picture-o"></i><span>主题</span></a>
            <a href="#"><i class="fa fa-windows"></i><span>插件</span></a>
            <a href="#"><i class="fa fa-chain-broken"></i><span>附件</span></a>-->
        </div>
        <div class="tool fright"></div>
    </div>
    
    <div class="container clearfix plugins">
        <div class="sidebar fleft">
            <div class="sidezone">
                <h5>插件快捷列表:</h5>
                <a href=""><i class="fa fa-slack"></i>创时代最新日志插件</a>
                <a href=""><i class="fa fa-tencent-weibo"></i>创时代最新评论插件</a>
                <a href=""><i class="fa fa-twitter-square"></i>创时代最新留言插件</a>
                <a href=""><i class="fa fa-xing-square"></i>创时代随机日志插件</a>
                <a href=""><i class="fa fa-slack"></i>创时代最新日志插件</a>
                <a href=""><i class="fa fa-tencent-weibo"></i>创时代最新评论插件</a>
                <a href=""><i class="fa fa-twitter-square"></i>创时代最新留言插件</a>
                <a href=""><i class="fa fa-xing-square"></i>创时代随机日志插件</a>
                <a href=""><i class="fa fa-slack"></i>创时代最新日志插件</a>
                <a href=""><i class="fa fa-tencent-weibo"></i>创时代最新评论插件</a>
                <a href=""><i class="fa fa-twitter-square"></i>创时代最新留言插件</a>
                <a href=""><i class="fa fa-xing-square"></i>创时代随机日志插件</a>
            </div>
        </div>
        <div class="content">
            <div class="navtabs">
                <i class="fa fa-home"></i>
                <strong>主页</strong>
                <span>欢迎回来！</span>
            </div>
            <div class="content-page">
            <!--HTML CONTENT-->
                <ul class="waterfull">
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-tachometer"></i> 系统综合数据</div>
                                <!--<div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>-->
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A1">
                                    <div class="detail-body-A1-item">
                                        <div class="detail-body-A1-item-content">
                                            <div class="infobox infobox-green clearfix">
                                                <div class="infobox-icon">
                                                    <i class="fa fa-file-text-o"></i>
                                                </div>
    
                                                <div class="infobox-data">
                                                    <span class="infobox-data-number">235</span>
                                                    <div class="infobox-content">文章总数</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A1-item">
                                        <div class="detail-body-A1-item-content">
                                            <div class="infobox infobox-green clearfix">
                                                <div class="infobox-icon">
                                                    <i class="fa fa-user"></i>
                                                </div>
    
                                                <div class="infobox-data">
                                                    <span class="infobox-data-number">3000</span>
                                                    <div class="infobox-content">用户总数</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A1-item">
                                        <div class="detail-body-A1-item-content">
                                            <div class="infobox infobox-green clearfix">
                                                <div class="infobox-icon">
                                                    <i class="fa fa-comments"></i>
                                                </div>
    
                                                <div class="infobox-data">
                                                    <span class="infobox-data-number">598</span>
                                                    <div class="infobox-content">评论总数</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A1-item">
                                        <div class="detail-body-A1-item-content">
                                            <div class="infobox infobox-green clearfix">
                                                <div class="infobox-icon">
                                                    <i class="fa fa-send"></i>
                                                </div>
    
                                                <div class="infobox-data">
                                                    <span class="infobox-data-number">261</span>
                                                    <div class="infobox-content">留言总数</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A1-item">
                                        <div class="detail-body-A1-item-content">
                                            <div class="infobox infobox-green clearfix">
                                                <div class="infobox-icon">
                                                    <i class="fa fa-share-alt-square"></i>
                                                </div>
    
                                                <div class="infobox-data">
                                                    <span class="infobox-data-number">12</span>
                                                    <div class="infobox-content">插件总数</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A1-item">
                                        <div class="detail-body-A1-item-content">
                                            <div class="infobox infobox-green clearfix">
                                                <div class="infobox-icon">
                                                    <i class="fa fa-compress"></i>
                                                </div>
    
                                                <div class="infobox-data">
                                                    <span class="infobox-data-number">157</span>
                                                    <div class="infobox-content">友链总数</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-joomla"></i> 系统组件支持</div>
                                <!--<div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>-->
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A2">
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> ADODB.CONNECTION</div>
                                        <div class="fright"><i class="fa fa-check"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> ADODB.RECORDSET</div>
                                        <div class="fright"><i class="fa fa-times"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> Scripting.FileSystemObject</div>
                                        <div class="fright"><i class="fa fa-check"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> Adodb.Stream</div>
                                        <div class="fright"><i class="fa fa-check"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> Microsoft.XMLHTTP</div>
                                        <div class="fright"><i class="fa fa-times"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> Microsoft.XMLDOM</div>
                                        <div class="fright"><i class="fa fa-check"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> MSXML2.DOMDocument</div>
                                        <div class="fright"><i class="fa fa-check"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> Scripting.Dictionary</div>
                                        <div class="fright"><i class="fa fa-times"></i></div>
                                    </div>
                                    
                                    <div class="detail-body-A2-item clearfix">
                                        <div class="fleft"><i class="fa fa-angle-right"></i> Msxml2.ServerXMLHTTP</div>
                                        <div class="fright"><i class="fa fa-check"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-comment"></i> 最新评论</div>
                                <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A3">
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！</div>
                                        </div>
                                    </div>
                                    
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-send"></i> 最新留言</div>
                                <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A3">
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                                        </div>
                                    </div>
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！</div>
                                        </div>
                                    </div>
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                                        </div>
                                    </div>
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！</div>
                                        </div>
                                    </div>
                                    <div class="detail-body-A3-item clearfix">
                                        <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                                        <div class="info">
                                            <div class="name clearfix">evio<span>2014.12.14</span></div>
                                            <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-bullhorn"></i> 官方信息</div>
                                <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A2">
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 中美强硬交锋或成常态 日媒声称G7峰会仍将批中国</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 山西官员持干股被曝后出命案 金道铭出面摆平</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 越船再度骚扰中方作业 中国海警船撞击阻挡(图)</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 中国确认微软谷歌配合美国棱镜项目对华窃密</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 江西省半年内3名省部级官员涉嫌违纪被免职</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> FBI通缉一俄罗斯黑客 指控其盗取1亿多美元</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 河南一村庄地下水污染严重 井水一点火就着</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 申办对手接连退出只剩俩 北京有望办2022冬奥会</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 市长称治污怎么能干：几百亿埋地下 老百姓也看不见</a>
                                    </div>
                                    <div class="detail-body-A2-item clearfix">
                                        <a href="#"><i class="fa fa-angle-right"></i> 印度再曝轮奸杀人案：受害者遭强酸和汽油毁容</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-picture-o"></i> 最新在线主题</div>
                                <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A3">
                                dasf
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-xing-square"></i> 最新在线插件</div>
                                <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A3">
                                dasf
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="detail">
                            <h5 class="detail-head clearfix">
                                <div class="title"><i class="fa fa-git-square"></i> 最新版本信息</div>
                                <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                            </h5>
                            <div class="detail-body clearfix">
                                <div class="detail-body-A3">
                                dasf
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            <!--HTML CONTENT-->
            </div>
        </div>
    </div>
    <script language="javascript" type="text/javascript">
        require('public/assets/js/blog.control.home', function( params ){ new params(); });
    </script>
<%	
	}
	
	CloseConn();
})( require("./public/services/user") );
%>
</body>
</html>