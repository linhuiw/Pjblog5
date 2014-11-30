// JavaScript Document
var hook = new Class({
	
	HookFile: resolve('private/chips/' + blog.cache + 'hook'),
	hook: 'private/chips/' + blog.cache + 'hook',
	
	initialize: function(){
		var fso = require('fso');
		var fs = new fso();
		
		if ( !fs.exist(this.HookFile) ){
			fs.saveFile(this.HookFile, '');
			this.hooks = {};
		}else{
			this.hooks = require(this.hook);
		}
		
		this.fs = fs;	
	}
});

hook.add('set', function( id, classic ){
	
	for ( var i in classic ){
		if ( !this.hooks[i] ){
			this.hooks[i] = [];
		}
		
		if ( this.hooks[i].indexOf(id) === -1 ){
			this.hooks[i].push(id);
		}
	}
	
	var h = '';
	
	for ( var j in this.hooks ){
		h += 'exports["' + j + '"] = ' + JSON.stringify(this.hooks[j]) + ';\n';
	}
	
	this.fs.saveFile(this.HookFile, h);
	
});

hook.add('get', function( HookName ){
	var ret = { compile: function(){} },
		that = this,
		which = null;
		
	ret.proxy = function(value){
		which = value;
		return this;
	};
	
	if ( !this.hooks[HookName] ){
		return ret;
	}
	
	var plugins = require('private/chips/' + blog.cache + 'blog.uri.plugins'),
		arrays = [];
		
	for ( var i = 0 ; i < this.hooks[HookName].length ; i++ ){
		var id = this.hooks[HookName][i];
		if ( plugins.indexs[id + ''] ){
			var param = plugins.queens[plugins.indexs[id + '']];
			arrays.push('private/plugins/' + param.folder + '/hook');
		}
	}
	
	ret.compile = function(){
		var args = arguments;
		for ( var j = 0 ; j < arrays.length ; j++ ){
			if ( that.fs.exist(resolve(arrays[j])) ){
				var m = require(arrays[j]),
					n = m[HookName];
					
				if ( n ){
					n.apply(which, args);
				}
			}
		}
		
		return this;
	}
	
	return ret;
});

hook.add('remove', function(id, classic){
	id = Number(id);
	for ( var i in classic ){
		if ( this.hooks[i] ){
			var v = this.hooks[i];
			var t = v.indexOf(id);
			if ( t > -1 ){
				this.hooks[i].splice(t, 1);
			}
			if ( this.hooks[i].length === 0 ){
				delete this.hooks[i];
			}
		}
	}
	
	var h = '';
	
	for ( var j in this.hooks ){
		h += 'exports["' + j + '"] = ' + JSON.stringify(this.hooks[j]) + ';\n';
	}
	
	this.fs.saveFile(this.HookFile, h);
});

return hook;