var Jump = new Class(function( querys, forms ){
	var apps = this.getApps(),
		nowTime = new Date().getTime().toString();
		
	Session(blog.tb + "oauth_jump") = nowTime;
	
	var type = querys.m;
	
	var from = http.query("from") || iPress.setURL('page', 'home');
	
	if ( type === 'setup' ){
		from = "install/?m=checkoAuth";
	};
	
	from = escape(from);
		
	var callbackURL = encodeURIComponent(blog.mysite + '/' + iPress.setURL('oauth', 'login')+ '=pjblog5.' + blog.version + '&from=' + from);
		callbackURL = blog.appsite + "/oauth/login?response_type=code&client_id=" + apps.appid + "&redirect_url=" + escape(callbackURL) + "&state=" + nowTime;
	
	Response.Redirect(callbackURL);
	
});

Jump.add('getApps', function(){
	var GlobalCache = require(':private/caches/global.json');
	return {
		appid: GlobalCache.blog_appid,
		appkey: GlobalCache.blog_appkey
	}
});

module.exports = Jump;
