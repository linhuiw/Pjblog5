var login = new Class(function( querys, forms ){
	this.error = 0;
	
	this.appid = 10083;
	this.appkey = '733ff118f081071d95615a0c60cb4cba4835f9d7';
	
	this.getFrom(querys.from);
	this.getCode();
	this.getState();
	
	var sess = Session(blog.tb + "oauth_jump");
	
	this.then(function(){
		if ( sess === this.state ){
			this.resolve();
		}else{
			this.error = 10002;
		}
	}).getToken();
});

login.add('getFrom', function(querysfrom){
	var from = querysfrom.replace(/\|/g, '=');
	var base64 = require('base64');
	this.from = base64.decode(from);
});

login.add('getCode', function(){
	this.code = http.query('code');
});

login.add('getState', function(){
	this.state = http.query('state');
});

login.add('getToken', function(){
	console.log(blog.appsite + "/oauth/token?grant_type=authorization_code&client_id=" + this.appid + "&client_secret=" + this.appkey + "&code=" + this.code + "&redirect_uri=" + blog.mysite)
	var msg = ajax.getJSON(blog.appsite + "/oauth/token", {
		grant_type: "authorization_code",
		client_id: this.appid,
		client_secret: this.appkey,
		code: this.code,
		redirect_uri: blog.mysite
	});
	console.log(msg.error)
	
	if ( msg.error && msg.error > 0 ){
		this.error = msg.error;
		this.reject();
	}else{
		console.log(1)
		this.resolve();
		this.token = msg.data.access_token;
		this.hashkey = msg.data.token_hashkey;
		this.expires_in = msg.data.expires_in;
		console.log(this.token, this.hashkey,this.expires_in)
	}
})

login.extend(task);

module.exports = login;
