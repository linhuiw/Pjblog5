<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
	var http = require('http');
	http = http.http;
	var code = http.query('code');
	var fns = require('fns');
	var r = fns.randoms(6);
	Response.Redirect('http://cloud.cn/oauth/token.asp?grant_type=authorization_code&client_id=10001&client_secret=BB92lcY9nGsjEJWeTSHmIIIHBm1clDVH6zgjZk3w&code=' + code + '&state=' + r);
%>
