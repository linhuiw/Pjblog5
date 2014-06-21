// JavaScript Document
var httpService = new Class({
	emtor: function( object, callback ){
		var _object = new Enumerator(object),
			_ret = [];
	
		for (; !_object.atEnd() ; _object.moveNext() ) {
			if ( typeof callback === "function" ){
				var d = callback(_object.item());
				if ( d ){
					_ret.push(d);
				}
			}else{
				_ret.push(_object.item());
			}
		}
	
		return _ret;
	}
});

httpService.extend('query', function( params, callback ){
	var queryEmtor = this.emtor(Request.QueryString(params), callback);
	if ( queryEmtor.length === 0 ){
		return;
	}
	return queryEmtor.length === 1 ? queryEmtor[0] : queryEmtor;
});

httpService.extend('form', function( params, callback ){
	var formEmtor = this.emtor(Request.Form(params), callback);
	if ( formEmtor.length === 0 ){
		return;
	}
	return formEmtor.length === 1 ? formEmtor[0] : formEmtor;
});

httpService.extend('createServer', function( callback, filterCallback ){
	var service = { query: {}, form: {} },
		queryEmtor = this.emtor(Request.QueryString),
		formEmtor = this.emtor(Request.Form),
		value,
		ret;

	for ( i = 0 ; i < queryEmtor.length ; i++ ){
		value = this.emtor(Request.QueryString(queryEmtor[i]), filterCallback);
		service.query[queryEmtor[i]] = (value.length === 1 ? value[0] : value);
	}

	for ( i = 0 ; i < formEmtor.length ; i++ ){
		value = this.emtor(Request.Form(formEmtor[i]), filterCallback);
		service.form[formEmtor[i]] = (value.length === 1 ? value[0] : value);
	}

	if ( typeof callback === "function" ) {
		ret = callback.call( this, service );	
	}
	
	return ret ? ret : service;
});

var AjaxServer = new Class({
	initialize: function(){ this.object = new ActiveXObject(Library.com_xmlhttp); },
	bin: function(text){
		var obj = new ActiveXObject(Library.com_stream), 
			ret;
			obj.Type = 1;
			obj.Mode = 3;
			obj.Open;
			obj.Write(text);
			obj.Position = 0;
			obj.Type = 2;
			if ( Library.charset ) { obj.Charset = Library.charset; };
			ret = obj.ReadText;
			obj.Close;
	
		return ret;
	},
	param: function( keyCode ){
		if ( !keyCode || keyCode === null || keyCode === false || keyCode === undefined ){
			return null;
		};
		
		if ( typeof keyCode === "object" ){
			var ret = [], i;
	
			for ( i in keyCode ){
				ret.push(i + "=" + keyCode[i]);
			}
	
			return ret.join("&");
		}else{
			return keyCode;
		}
	},
	save: function( content, file){
		var object = new ActiveXObject(Library.com_stream);
			object.Type = 1; 
			object.Mode = 3; 
			object.Open();
			object.Position = 0;
			object.Write(content);
			object.SaveToFile(file, 2);
			object.Close();
			object = null;
	}
});

AjaxServer.extend('send', function( options ){
	var that = this, rets;
	if ( !options.method ){ options.method = 'get'; };
	if ( /^get$/i.test(options.method) ){ options.data = null; };
	
	this.object.open(method.toUpperCase(), options.url, false);
	this.object.onreadystatechange = function() {
		if (that.object.readyState === 4) {
			if (that.object.status === 200){
				if ( typeof options.success === 'function' ){
					rets = options.success.call(that, that.object);
				};
			}
		}
	};
	this.object.send(this.param(options.data));
	
	if ( rets ){
		return rets;
	}else{
		return this;
	}
});

AjaxServer.extend('get', function(url, data, callback){
	return this.send({
		url: url,
		data: data,
		success: function( object ){
			var rets = this.bin(object.responseBody);
			if ( typeof callback === 'function' ){
				rets = callback.call(this, rets, object);
			};
			return rets;
		}
	});
});

AjaxServer.extend('post', function( url, data, callback ){
	return this.send({
		url: url,
		data: data,
		success: function( object ){
			var rets = this.bin(object.responseBody);
			if ( typeof callback === 'function' ){
				rets = callback.call(this, rets, object);
			};
			return rets;
		},
		method: 'post'
	});
});

AjaxServer.extend('getBinary', function( url, data, callback ){
	return this.send({
		url: url,
		data: data,
		success: function( object ){
			var rets = object.responseBody;
			if ( typeof callback === 'function' ){
				rets = callback.call(this, rets, object);
			};
			return rets;
		}
	});
});

AjaxServer.extend('getJSON', function(url, data){
	return this.get(url, data, function( code ){
		return JSON.parse(code);
	});
});

AjaxServer.extend('postJSON', function(url, data){
	return this.post(url, data, function( code ){
		return JSON.parse(code);
	});
});

AjaxServer.extend('SaveFile', function( url, data, file ){
	if ( !file ){ file = data; data = {}; };
	this.getBinary(url, data, function( rets ){ this.save(rets, file); });
});

exports.http = new httpService();
exports.ajax = AjaxServer;