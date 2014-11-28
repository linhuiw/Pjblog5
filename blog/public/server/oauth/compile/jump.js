var Jump = new Class(function( querys, forms ){
	var apps = this.getApps(),
		nowTime = new Date().getTime().toString();
	
	var base64 = require('base64');
		
	Session(blog.tb + "oauth_jump") = nowTime;
	
	var from = querys.from || base64.encode(iPress.setURL('page', 'home'));
		from = from.replace(/\=/g, '|');
		
	var callbackURL = encodeURIComponent(blog.mysite + '/' + iPress.setURL('oauth', 'login', { from: from })+ '=pjblog5');
		callbackURL = blog.appsite + "/oauth/login?response_type=code&client_id=" + apps.appid + "&redirect_url=" + callbackURL + "&state=" + nowTime;
	
	Response.Redirect(callbackURL);
	
});

Jump.add('getApps', function(){
	return {
		appid: 10083,
		appkey: '733ff118f081071d95615a0c60cb4cba4835f9d7'
	}
});

module.exports = Jump;
