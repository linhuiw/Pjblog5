module.exports = new Class(function(){
	var users = require(':public/library/user');
	var user = new users();

	user.logout();
	
	try{
		blog.conn.Close();
	}catch(e){}
	
	Response.Redirect(String(Request.ServerVariables("HTTP_REFERER")));
});