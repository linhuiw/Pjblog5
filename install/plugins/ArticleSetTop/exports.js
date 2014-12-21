// JavaScript Document
var Module = new Class({});

Module.add('GetList', function(type){
	var list = [];
	var file = type + '.json';
	fs(contrast(file)).exist().then(function(){
		list = require(file);
	})
	return list;
});

module.exports = Module;