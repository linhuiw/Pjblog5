<!--#include file="tron.min.asp" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>PJBlog5 Installer</title>
<link rel="stylesheet" type="text/css" href="css/pjblog5.css"/>
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css"/>
</head>
<body>
	<div class="header">
    	<div class="container">
        	<div class="logo">
            	<div class="name">
                	<span>PJ</span>Blog<sup>5</sup><sub>The most popular blog software.</sub>
                </div>
                <div class="link">
                	<div class="version"><a href="https://github.com/cevio/tronjs.js" target="_blank"><i class="fa fa-bug"></i>TronASP FrameWork like nodejs.</a></div>
                    <div class="code"><i class="fa fa-flask"></i>Use javascript which run at server.</div>
                    <div class="support">
                    	<a href="" class="fa fa-html5"></a>
                    	<a href="" class="fa fa-apple"></a>
                        <a href="" class="fa fa-android"></a>
                    	<a href="" class="fa fa-github"></a>
                    	<a href="" class="fa fa-vimeo-square"></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%
		var file = http.query("m") || "copyright";
		include("./view-" + file + ".asp");
	%>
</body>
</html>
