var hook = new Class(function(){
	
	// install the hook.json to system cache folder
	// it will be a userfull cache file which guiding the system ahead.
	
	this.file = contrast(':private/caches/hook.json');
	fs(this.file).unExist().create('{ indexs: [], queens: [] }');
	
	// indexs: id depend with marks
	// queens: mark depend with ids
	
	this.data = require(this.file);
	
});

hook.add('parse', function( id, mark ){
	if ( !this.data.indexs[id + ''] )
	{
		this.data.indexs[id + ''] = [];
	};
	
	if ( this.data.indexs[id + ''].indexOf(mark) === -1 )
	{
		this.data.indexs[id + ''].push(mark);
	};
	
	if ( !this.data.queens[mark] )
	{
		this.data.queens[mark] = [];
	};
	
	if ( this.data.queens[mark].indexOf(id) === -1 )
	{
		this.data.queens[mark].push(id);
	};
	
	return this;
});

hook.add('load', function( id, path ){
	var detail = require(path);
	for ( var i in detail ){
		this.parse(id, i);
	}
	return this.save();
});

hook.add('save', function(){
	fs(this.file).create(JSON.stringify(this.data));
	return this;
});

hook.add('compile', function(){
	var mark = arguments[0],
		args = Array.prototype.slice.call(arguments, 1) || [],
		that = this;
	
	if ( this.data.queens[mark] ){
		var plugins = this.data.queens[mark];
		if ( plugins.length > 0 ){
			var pluginModule = require(':private/caches/plugins.json');
			plugins.forEach(function( id ){				
				var folder = pluginModule.indexs[id + ''].folder;
				if ( folder && folder.length > 0 ){
					var hooks = require(':private/plugins/' + folder + '/hook.js');
					if ( hooks && hooks[mark] && typeof hooks[mark] === 'function' ){
						hooks[mark].apply(that, args);
					}
				}
			});
		}
	}
	
	return this;
});

hook.add('remove', function(id){
	if ( this.data.indexs[id + ''] ){
		this.data.indexs[id + ''].forEach(function(mark){
			if ( this.data.queens[mark] ){
				var i = this.data.queens[mark].indexOf(id);
				if ( i > -1 ){
					this.data.queens[mark].splice(i, 1);
				}
			}
		});
		delete this.data.indexs[id + ''];
	}
	
	return this.save();
});

module.exports = hook;