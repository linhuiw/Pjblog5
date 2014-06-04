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
	},
	
	param: function( keyCode ){
		if ( typeof keyCode === "object" ){
			var ret = [], i;
	
			for ( i in keyCode ){
				ret.push(i + "=" + keyCode[i]);
			}
	
			return ret.join("&");
		}else{
			return keyCode;
		}
	}
});

httpService.extend('query', function( params ){
	var queryEmtor = this.emtor(Request.QueryString(params));
	if ( queryEmtor.length === 0 ){
		return;
	}
	return queryEmtor.length === 1 ? queryEmtor[0] : queryEmtor;
});

httpService.extend('form', function( params ){
	var formEmtor = this.emtor(Request.Form(params));
	if ( formEmtor.length === 0 ){
		return;
	}
	return formEmtor.length === 1 ? formEmtor[0] : formEmtor;
});

httpService.extend('createServer', function( callback ){
	var service = { query: {}, form: {} },
		queryEmtor = this.emtor(Request.QueryString),
		formEmtor = this.emtor(Request.Form),
		value,
		ret;

	for ( i = 0 ; i < queryEmtor.length ; i++ ){
		value = this.emtor(Request.QueryString(queryEmtor[i]));
		service.query[queryEmtor[i]] = (value.length === 1 ? value[0] : value);
	}

	for ( i = 0 ; i < formEmtor.length ; i++ ){
		value = this.emtor(Request.Form(formEmtor[i]));
		service.form[formEmtor[i]] = (value.length === 1 ? value[0] : value);
	}

	if ( typeof callback === "function" ) {
		ret = callback.call( this, service );	
	}
	
	return ret ? ret : service;
});

exports.http = new httpService();