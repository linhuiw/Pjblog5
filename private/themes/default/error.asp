<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/reset.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/animate.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/common.css" />
<link rel="stylesheet" type="text/css" href="<%=data.theme.dir%>/css/default.css" />
<link rel="stylesheet" type="text/css" href="<%=blog.web%>/fontawesome/css/font-awesome.min.css"/>
<title>错误页面信息 - <%=errorid%></title>
</head>

<body>

<%sups.include("navigation.asp");%>
<div class="articles clearfix wrap">
	<div class="list">
    	<div class="error">
        	<h6>错误信息:</h6>
            <div class="des"><%=error%></div>
        </div>
    </div>
</div>
<%sups.include("footer.asp");%>
</body>
</html>