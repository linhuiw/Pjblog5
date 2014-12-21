// JavaScript Document
var Module = new Class({});

Module.add('Modify', function(reqs, post){
	var ret = {success: false, message: '设置失败'};
	if (!this.CheckUser('ControlSystem')) return ret;
	var input = post();
	var id = Number(input.id) || 0,
		act = input.action,
		title = input.title;

	if (id < 1) {
		ret.message = '日志不存在';
		return ret;
	}
	
	var file = (act == 'top') ? 'top.json' : 'rec.json';
	var list = [];
	fs(contrast(file)).exist().then(function(){
		list = require(file);
	})
	for (var i=0; i<list.length; i++) {
		if (list[i].id == id) {
			list[i].title = title;
			break;
		}
	}
	
	fs(contrast(file)).create(JSON.stringify(list));

	ret.success = true;
	ret.message = '保存成功';
	return ret;
});

Module.add('Remove', function(reqs, post){
	var ret = {success: false, message: '取消失败'};
	if (!this.CheckUser('ControlSystem')) return ret;
	var input = post();
	var id = Number(input.id) || 0,
		act = input.action;
	
	if (id < 1) {
		ret.message = '日志不存在';
		return ret;
	}
	
	var file = (act == 'top') ? 'top.json' : 'rec.json';
	var list = [];
	fs(contrast(file)).exist().then(function(){
		list = require(file);
	})
	for (var i=0; i<list.length; i++) {
		if (list[i].id == id) {
			list.splice(i, 1);
			break;
		}
	}
	
	fs(contrast(file)).create(JSON.stringify(list));

	ret.success = true;
	ret.message = '取消成功';
	return ret;
});

Module.add('AddTop', function(reqs, post){
	var ret = {success: false, message: '设置失败'};
	if (!this.CheckUser('ControlSystem')) return ret;
	var input = post();
	var id = Number(input.id) || 0,
		title = input.title;
	if (id < 1) {
		ret.message = '日志不存在';
		return ret;
	}
	
	var file = 'top.json';
	var list = [];
	fs(contrast(file)).exist().then(function(){
		list = require(file);
	})
	for (var i=0; i<list.length; i++) {
		if (list[i].id == id) {
			title = list[i].title;
			list.splice(i, 1);
			break;
		}
	}
	list.push({id: id, title: title});
	
	fs(contrast(file)).create(JSON.stringify(list));

	ret.success = true;
	ret.message = '保存成功';
	return ret;
});

Module.add('AddRec', function(reqs, post){
	var ret = {success: false, message: '设置失败'};
	if (!this.CheckUser('ControlSystem')) return ret;
	var input = post();
	var id = Number(input.id) || 0,
		title = input.title;
	if (id < 1) {
		ret.message = '日志不存在';
		return ret;
	}
	
	var file = 'rec.json';
	var list = [];
	fs(contrast(file)).exist().then(function(){
		list = require(file);
	})
	for (var i=0; i<list.length; i++) {
		if (list[i].id == id) {
			title = list[i].title;
			list.splice(i, 1);
			break;
		}
	}
	list.push({id: id, title: title});
	
	fs(contrast(file)).create(JSON.stringify(list));

	ret.success = true;
	ret.message = '保存成功';
	return ret;
});

module.exports = Module;