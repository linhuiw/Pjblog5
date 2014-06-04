// JavaScript Document
var fs = new ActiveXObject(coms.fso);

exports.fs = fs;

// 判断文件或者文件夹是否存在
exports.exist = function(fullpath, type){
	return type ? fs.FolderExists(fullpath) : fs.FileExists(fullpath);
}

// 单个创建文件夹
exports.createfolder = function(fullpath){
	if ( !fs.FolderExists(fullpath) ){
		fs.CreateFolder(fullpath);
	}
	return fs.FolderExists(fullpath);
}

// 获取文件所在文件夹
exports.getfolder = function(fullpath){
	return fullpath.split('\\').slice(0, -1).join('\\');
}

// 自动创建文件夹
exports.autocreatefolder = function(fullpath){
	var root = Server.MapPath('/'),
		path = fullpath.replace(root, ''),
		arrs = path.replace(/^\\/, '').split('\\');
		
	for ( var i = 0 ; i < arrs.length ; i++ ){
		root += '\\' + arrs[i];
		if ( !fs.FolderExists(root) ){
			fs.CreateFolder(root);
		}
	}
	
	return fs.FolderExists(fullpath);
}

//获取某一文件夹下的所有文件夹
exports.dirlist = function(fullpath, callback){
	if ( !this.exist(fullpath, true) ){
		return [];
	}
	
	var object = fs.GetFolder(fullpath),
		arrs = object.SubFolders,
		emtor = new Enumerator(arrs),
		names = [];
	
	for (; !emtor.atEnd(); emtor.moveNext()) {
		var name = emtor.item().Name;
		if ( typeof callback === 'function' ){
			name = callback(name);
			if ( name ){
				names.push(name);
			}
		}else{
			names.push(name);
		}
	}
	
	return names;
}

//获取某一文件夹下的所有文件
exports.filelist = function(fullpath, callback){
	if ( !this.exist(fullpath, true) ){
		return [];
	}
	
	var object = fs.GetFolder(fullpath),
		arrs = object.Files,
		emtor = new Enumerator(arrs),
		names = [];
	
	for (; !emtor.atEnd(); emtor.moveNext()) {
		var name = emtor.item().Name;
		if ( typeof callback === 'function' ){
			name = callback(name);
			if ( name ){
				names.push(name);
			}
		}else{
			names.push(name);
		}
	}
	
	return names;
}

//删除文件夹或文件
exports.clean = function(fullpath, type){
	try{
		if ( type ){
			fs.DeleteFolder(fullpath);
		}else{
			fs.DeleteFile(fullpath);
		}
	}catch(e){}
	
	return !this.exist(fullpath, type);
}

// 移动文件或文件夹
exports.move = function(fullpath, target, type){
	try{
		if ( !type ){
			fs.MoveFile(fullpath, target);
		}else{
			fs.MoveFolder(fullpath, target);
		}
	}catch(e){}
	
	return this.exist(target, type);
}

// 复制文件或文件夹
exports.copy = function(fullpath, target, type){
	try{
		if ( !type ){
			fs.CopyFile(fullpath, target);
		}else{
			fs.CopyFolder(fullpath, target);
		}
	}catch(e){}
	
	return this.exist(target, type);
}

// 文件或文件夹改名
exports.rename = function(fullpath, name, type){
	try{
		if ( !type ){
			fs.GetFile(fullpath).Name = name;
		}else{
			fs.GetFolder(fullpath).Name = name;
		}
	}catch(e){}
	
	var keep = fullpath.split('\\');
		keep.splice(-1, 1, name);
		keep = keep.join('\\');
		
	return this.exist(keep, type);
}

// 保存文件
exports.save = function(fullpath, container){
	var stream = new ActiveXObject(coms.stream);
		stream.Type = 2; 
		stream.Mode = 3; 
		stream.Open();
		stream.Charset = module.charset;
		stream.Position = stream.Size; 
		stream.WriteText = container;
		stream.SaveToFile(fullpath, 2);
		stream.Close();
	
	return this.exist(fullpath);
}

// 读文件
exports.read = function(fullpath){
	var stream = new ActiveXObject(coms.stream),
		ret;

		stream.Type = 2; 
		stream.Mode = 3; 
		stream.Open();
		stream.Charset = module.charset;
		stream.Position = stream.Size;
		stream.LoadFromFile(fullpath);
		ret = stream.ReadText;
		stream.Close();
		
	return ret;
}