<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
	var crc = require('public/library/crcin'),
		a = new crc(contrast('.'));
		
	function output(data){
		for ( var i = 0 ; i < data.length ; i++ ){
			Library.log('<p>' + (i + 1) + ':' + data[i] + '</p>');
		}
	}
		
	//output();
	Library.log(JSON.stringify(a)); //C15E8C57
%>
