// JavaScript Document
var FileSystemObject = new Class({
	initialize: function(){
		this.fs = new ActiveXObject(Library.com_fso);
	}
});

FileSystemObject.add('exist', function( fullpath, type ){
	return type ? this.fs.FolderExists(fullpath) : this.fs.FileExists(fullpath);
});

FileSystemObject.add('createFolder', function( fullpath ){
	if ( !this.fs.FolderExists(fullpath) ){
		this.fs.CreateFolder(fullpath);
	}
	return this.fs.FolderExists(fullpath);
});

FileSystemObject.add('getFolderPathByFile', function( fullpath ){
	return fullpath.split('\\').slice(0, -1).join('\\');
});

FileSystemObject.add('autoCreateFolder', function( fullpath ){
	var root = Server.MapPath('/'),
		path = fullpath.replace(root, ''),
		arrs = path.replace(/^\\/, '').split('\\');
		
	for ( var i = 0 ; i < arrs.length ; i++ ){
		root += '\\' + arrs[i];
		if ( !this.fs.FolderExists(root) ){
			this.fs.CreateFolder(root);
		}
	}
	
	return this.fs.FolderExists(fullpath);
});

FileSystemObject.add('dirList', function( fullpath, callback ){
	if ( !this.exist(fullpath, true) ){
		return [];
	}
	
	var object = this.fs.GetFolder(fullpath),
		arrs = object.SubFolders,
		emtor = new Enumerator(arrs),
		names = [];
	
	for (; !emtor.atEnd(); emtor.moveNext()) {
		var name = emtor.item().Name;
		if ( typeof callback === 'function' ){
			name = callback.call(emtor.item(), name);
			if ( name ){
				names.push(name);
			}
		}else{
			names.push(name);
		}
	}
	
	return names;
});

FileSystemObject.add('fileList', function( fullpath, callback ){
	if ( !this.exist(fullpath, true) ){
		return [];
	}
	
	var object = this.fs.GetFolder(fullpath),
		arrs = object.Files,
		emtor = new Enumerator(arrs),
		names = [];
	
	for (; !emtor.atEnd(); emtor.moveNext()) {
		var name = emtor.item().Name;
		if ( typeof callback === 'function' ){
			name = callback.call(emtor.item(), name);
			if ( name ){
				names.push(name);
			}
		}else{
			names.push(name);
		}
	}
	
	return names;
});

FileSystemObject.add('clean', function( fullpath, type ){
	try{
		if ( type ){
			this.fs.DeleteFolder(fullpath);
		}else{
			this.fs.DeleteFile(fullpath);
		}
	}catch(e){}
	
	return !this.exist(fullpath, type);
});

FileSystemObject.add('move', function( fullpath, target, type ){
	try{
		if ( !type ){
			this.fs.MoveFile(fullpath, target);
		}else{
			this.fs.MoveFolder(fullpath, target);
		}
	}catch(e){}
	
	return this.exist(target, type);
});

FileSystemObject.add('copy', function( fullpath, target, type ){
	try{
		if ( !type ){
			this.fs.CopyFile(fullpath, target);
		}else{
			this.fs.CopyFolder(fullpath, target);
		}
	}catch(e){}
	
	return this.exist(target, type);
});

FileSystemObject.add('reName', function( fullpath, name, type ){
	try{
		if ( !type ){
			this.fs.GetFile(fullpath).Name = name;
		}else{
			this.fs.GetFolder(fullpath).Name = name;
		}
	}catch(e){}
	
	var keep = fullpath.split('\\');
		keep.splice(-1, 1, name);
		keep = keep.join('\\');
		
	return this.exist(keep, type);
});

FileSystemObject.add('saveFile', function( fullpath, container ){
	var stream = new ActiveXObject(Library.com_stream);
		stream.Type = 2; 
		stream.Mode = 3; 
		stream.Open();
		stream.Charset = Library.charset;
		stream.Position = stream.Size; 
		stream.WriteText = container;
		stream.SaveToFile(fullpath, 2);
		stream.Close();
	
	return this.exist(fullpath);
});

FileSystemObject.add('getFileContent', function( fullpath ){
	var stream = new ActiveXObject(Library.com_stream),
		ret;

		stream.Type = 2; 
		stream.Mode = 3; 
		stream.Open();
		stream.Charset = Library.charset;
		stream.Position = stream.Size;
		stream.LoadFromFile(fullpath);
		ret = stream.ReadText;
		stream.Close();
		
	return ret;
});

FileSystemObject.add('getFileBinary', function(fullpath){
	var stream = new ActiveXObject(Library.com_stream),
		ret;
		
		stream.Type = 1;
		stream.Open();
		stream.LoadFromFile(fullpath);
		ret = stream.Read(-1);
		stream.Close();
		
	return ret;
});

return FileSystemObject;