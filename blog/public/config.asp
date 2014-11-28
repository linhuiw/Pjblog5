<!--#include file="tron.min.asp" -->
<%
var iPress, blog;
blog = require('private/config.json');
blog.conn = null;
modules.setBase(blog.base);
(function(RunAt){
	if ( RunAt === 'assets' ){
		console.log('Library.setBase("' + blog.base + '");');
	}
})(http.query('runat') || '');
%>