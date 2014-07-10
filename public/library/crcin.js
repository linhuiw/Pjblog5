// JavaScript Document
var CrcInModule = new Class({
	initialize: function( folder ){
		this.fso = require("fso");
		this.fs = new this.fso();
		this.crc32 = require("crc32");
		
		if ( folder ) { var files = this.getFileList(folder);return this.check(files); };
	}
});

CrcInModule.extend('getFileList', function( dir ){
	dir = dir.replace(/\\$/, '');
	var folders = this.fs.dirList(dir, function( name ){ return dir + '\\' + name; }),
		files = this.fs.fileList(dir, function( name ){ return dir + '\\' + name; });
		
	if ( folders.length === 0 ){
		return files;
	}else{
		
		for ( var i = 0 ; i < folders.length ; i++ ){
			files = files.concat(this.getFileList(folders[i]));
		};
		
		return files;
	}
});

CrcInModule.extend('check', function( files, callback ){
	var _files = {};
	
	for ( var i = 0 ; i < files.length ; i++ ){
		_files[files[i].replace(contrast('.'), '')] = this.crc32.make(files[i]);
	}
	
	return _files;
});

CrcInModule.extend('singleCheck', function( file, crc32 ){
	return this.crc32.make(contrast(file)) !== crc32;
});

return CrcInModule;