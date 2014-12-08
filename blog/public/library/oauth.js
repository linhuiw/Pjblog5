var oAuth = new Class();

oAuth.add('storage', {});

oAuth.add('appid', function( str ){
	this.storage.appid = str;
	return this;
});

oAuth.add('appkey', function( str ){
	this.storage.appkey = str;
	return this;
});

oAuth.add('token', function( str ){
	this.storage.token = str;
	return this;
});

oAuth.add('openid', function( str ){
	this.storage.openid = str;
	return this;
});

oAuth.add('download', function( mark, folder ){
	try{
		new ajax().SaveFile(blog.appsite + "/oauth/appdownload", {
			access_token: this.storage.token,
			oauth_consumer_key: this.storage.appid,
			openid: this.storage.openid,
			oauth_customer_mark: mark
		}, contrast(':private/' + folder + '/' + mark + '.pbd'));
		
		if ( 
			fs(contrast(':private/' + folder + '/' + mark + '.pbd'))
			.exist()
			.then(function(){ return true; })
			.fail(function(){ return false; })
			.value() 
		){
			var packs = require('package');
			var pack = new packs();
			pack.unPack(
				contrast(':private/' + folder + '/' + mark + '.pbd'), 
				contrast(':private/' + folder + '/' + mark)
			);
			
			return fs(contrast(':private/' + folder + '/' + mark), true).exist().then(function(){
				return true;
			}).fail(function(){
				return false;
			}).value();
		}else{
			return false;
		}
	}catch(e){
		return false;
	}
});

module.exports = oAuth;