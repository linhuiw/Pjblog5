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

// id 必定基于基址:public/...
oAuth.add('repair', function( id ){
	var status = false;
	id = /^\:/.test(id) ? id : ':' + id;
	
	try{			
		fs(contrast(id).split('\\').slice(0, -1).join('\\'), true).autoCreate().then(function(){
			new ajax().getBinary(blog.appsite + '/public/pjblog5.file.download.asp?file=' + id.replace(/^\:/, ''), {}, function( ret ){
				var obj = new ActiveXObject("Adodb.Stream");
					obj.Type = 1;
					obj.Mode = 3;
					obj.Open();
					obj.Write(ret);
					obj.SaveToFile(contrast(id), 2);
					obj.Close();
					obj = null;
			});
			fs(contrast(id)).exist().then(function(){ status = true; }).fail(function(){ status = false; });
		}).fail(function(){ status = false; });
	}catch(e){ status = false; };
	
	return status;
});

oAuth.add('check', function(file, value){
	var status = false;
	try{
		var crc32 = require('crc32');
		var crc = new crc32();
		status = crc.compress(contrast(/^\:/.test(file) ? file : ':' + file), value);
	}catch(e){}
	return status;
});

oAuth.add('updateVersion', function(id){
	var status = false;
	id = !isNaN(id) ? Number(id) : 0;
	
	if ( id > blog.version ){
		try{
			var content = new ajax().get(blog.appsite + '/private/version/static/sql.' + id + '.js', {});
			var wrapper = ['return function (require) { ', content, '};'].join("\n"),
				__module = (new Function(wrapper))();
				__module(require);
				blog.version = id;
			
			var pixers = ['tb', 'base', 'connect', 'cookie', 'appsite', 'mysite', 'version', 'pix'];
			var _ = {};
			for ( var i in blog ){
				if ( pixers.indexOf(i) > -1 ){
					_[i] = blog[i];
				}
			}
			
			fs(contrast(':private/config.json')).create(JSON.stringify(_));
			status = true;
		}catch(e){ status = false; };
	}else{
		status = false;
	}
	
	return status;
});

module.exports = oAuth;