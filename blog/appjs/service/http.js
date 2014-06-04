var emtor = function( object, callback ){
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

function readtype( param ){
	return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
}

var Async = function(){
	this.object = new ActiveXObject(coms.xmlhttp);
	this.events = {};
}

Async.prototype.on = function(event, callback){
	this.events[event] = callback;
}

Async.prototype.trigger = function(event, params){
	if ( this.events[event] ){
		if ( !params ){ params = []; }
		if ( readtype(params) !== 'array' ){
			params = [readtype];
		}
		this.events[event].apply(this, params);
	}
}

var bin = function(text){
	var obj = new ActiveXObject(coms.stream), 
		ret;
	
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open;
		obj.Write(text);
		obj.Position = 0;
		obj.Type = 2;
		obj.Charset = module.charset;
		ret = obj.ReadText;
		obj.Close;

	return ret;
}

Async.prototype.send = function(url, data, method){
	var _this = this;
	
	if ( /^get$/i.test(method) ){
		data = null;
	}
	
	this.object.open(method.toUpperCase(), url, false);
	this.object.onreadystatechange = function() {
		if (_this.object.readyState === 4) {
			if (_this.object.status === 200){
				_this.trigger("end");
			}
		}
	}
	this.object.send(this.param(data));
	
	return this;
}

Async.prototype.param = function(keyCode){
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

exports.query = function( params ){
	var queryEmtor = emtor(Request.QueryString(params));
	return queryEmtor.length === 1 ? queryEmtor[0] : queryEmtor;
}

exports.form = function( params ){
	var formEmtor = emtor(Request.Form(params));
	return formEmtor.length === 1 ? formEmtor[0] : formEmtor;
}

exports.createServer = function(callback){
	var service = { query: {}, form: {} },
		queryEmtor = emtor(Request.QueryString),
		formEmtor = emtor(Request.Form),
		value;

	for ( i = 0 ; i < queryEmtor.length ; i++ ){
		value = emtor(Request.QueryString(queryEmtor[i]));
		service.query[queryEmtor[i]] = (value.length === 1 ? value[0] : value);
	}

	for ( i = 0 ; i < formEmtor.length ; i++ ){
		value = emtor(Request.Form(formEmtor[i]));
		service.form[formEmtor[i]] = (value.length === 1 ? value[0] : value);
	}

	if ( typeof callback === "function" ) {
		callback(service, module);	
	}
}

exports.createServerByQuery = function(callback){
	var service = {},
		queryEmtor = emtor(Request.QueryString),
		value;

	for ( i = 0 ; i < queryEmtor.length ; i++ ){
		value = emtor(Request.QueryString(queryEmtor[i]));
		service[queryEmtor[i]] = (value.length === 1 ? value[0] : value);
	}
	
	if ( typeof callback === "function" ) {
		callback(service, module);
	}
}

exports.createServerByForm = function(callback){
	var service = {},
		formEmtor = emtor(Request.Form),
		value;

	for ( i = 0 ; i < formEmtor.length ; i++ ){
		value = emtor(Request.Form(formEmtor[i]));
		service[formEmtor[i]] = (value.length === 1 ? value[0] : value);
	}
	
	if ( typeof callback === "function" ) {
		callback(service, module);
	}
}

exports.get = function(url){	
	var async = new Async(),
		html;
	
	async.on("end", function(){
		html = bin(this.object.responseBody);
	});
	
	async.send(url, null, "GET");
	
	return html;
}

exports.post = function(url, data){
	var async = new Async(),
		html;
	
	async.on("end", function(){
		html = bin(this.object.responseBody);
	});
	
	async.send(url, data, "POST");
	
	return html;
}

exports.getBinary = function(url){
	var async = new Async(),
		html;
	
	async.on("end", function(){
		html = this.object.responseBody;
	});
	
	async.send(url, null, "GET");
	
	return html;
}

exports.postBinary = function(url, data){
	var async = new Async(),
		html;
	
	async.on("end", function(){
		html = this.object.responseBody;
	});
	
	async.send(url, data, "POST");
	
	return html;
}

exports.getJSON = function(url){	
	var async = new Async(),
		html;
	
	async.on("end", function(){
		html = bin(this.object.responseBody);
	});
	
	async.send(url, null, "GET");
	
	return JSON.parse(html);
}

exports.postJSON = function(url, data){
	var async = new Async(),
		html;
	
	async.on("end", function(){
		html = bin(this.object.responseBody);
	});
	
	async.send(url, data, "POST");
	
	return JSON.parse(html);
}

exports.save = function(url, file){
	var async = new Async(),
		html;
	
	async.on("end", function(){
		html = this.object.responseBody;
	});
	
	async.send(url, null, "GET");
	
	var object = new ActiveXObject(coms.stream),
		fs = require("fs"),
		filepath = contrast(file);
		
		object.Type = 1; 
		object.Mode = 3; 
		object.Open();
		object.Position = 0;
		object.Write(html);
		object.SaveToFile(filepath, 2);
		object.Close();
	
	return fs.exist(filepath);
}
