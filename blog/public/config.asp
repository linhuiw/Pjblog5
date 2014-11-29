<!--#include file="tron.min.asp" -->
<%;
var iPress;
var blog = require('private/config.json');
blog.conn = null;
modules.setBase(blog.base);
%>