(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define([], mod);
    }
    else {
        window.Pack = mod();
    }
})(function () {
	var Packs = new Class(function(){
		this.object = new ActiveXObject('Adodb.Stream');
		this.fso = new ActiveXObject("Scripting.FileSystemObject");
		this.fileListInfo = '';
	});
	
	// 执行打包操作
	Packs.add('doPack', function( source, target ){
		// 初始化对象
		this.object.Type = 1; 
		this.object.Mode = 3; 
		this.object.Open();
		this.object.Position = 0;
		
		//开始打包
		source = source.replace(/\\$/, '');
		var fileList = this.getFileList(source);					// 遍历文件夹
		
		if (fileList.length == 0){
			return;													// 判断数组是否为空
		}
		
		this.fileListInfo = source.split('\\').reverse()[0] + '|' + this.fileListInfo.split(source + '\\').join('').replace(source, '');
		this.fileListInfo = this.fileListInfo.replace('||', '|');	// 如果根目录下无文件，则此处将处理
		this.setHeaderInfo(this.fileListInfo);						// 写入头文件信息
		
		for ( var i = 0 ; i < fileList.length ; i++ ){
			var filepath = fileList[i].split('>')[0];
			
			this.AppendFile(filepath);
		}
		
		this.object.SaveToFile(target, 2);	
		this.object.Close();
		this.object = null; 
	});
	
	Packs.add('getFileList', function( dir ){
		dir = dir.replace(/\\$/, '');
		var folders = fs(dir, true).exist().dirs(function( name ){ return dir + '\\' + name; }).then().fail().stop().value();
		var files = this.fileList(dir, function( name ){ return dir + '\\' + name + '>' + this.Size; });

		if ( files.length == 0 ){
			this.fileListInfo += dir + '|';
		}else{
			this.fileListInfo += files.join('|') + '|';
		}
		
		if ( folders.length != 0 ){
			for ( var i = 0 ; i < folders.length ; i++ ){
				files = files.concat(this.getFileList(folders[i]));
			};
		}
		
		return files;
	});
	
	Packs.add('fileList', function( fullpath, callback ){
		var object = this.fso.GetFolder(fullpath),
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
	
	Packs.add('AppendFile', function( path ){
		var obj = new ActiveXObject('Adodb.Stream'), 
			filepath = path;
	
			obj.Type = 1;
			obj.Mode = 3;
			obj.Open();
			obj.LoadFromFile(filepath);
			this.object.Position = this.object.Size;
			if (obj.Size != 0) {
				this.object.Write(obj.Read);
			}	
			obj.Close();
			obj = null;
	});
	
	Packs.add('setHeaderInfo', function( header ){
		var headerSize = '00000000' + this.getStrSize(header).toString();
		var headerText = 'SPK ' + headerSize.substr(headerSize.length - 8) + ' 00 ' + header + ' ';
		
		var obj = new ActiveXObject('Adodb.Stream');
			obj.Type = 2;
			obj.Open();
			obj.Charset = 'utf-8';
			obj.Position = 0;							
			obj.WriteText = headerText;
			obj.Position = 3;			// BOM占用3个字节
			obj.CopyTo(this.object)
			obj.Close();
			obj = null;
	});
	
	Packs.add('getStrSize', function( str ){
		var obj = new ActiveXObject('Adodb.Stream'),
			strSize;
	
			obj.Type = 2;
			obj.Open();
			obj.Charset = 'utf-8';
			obj.Position = 0;							
			obj.WriteText = str;
			strSize = obj.Size - 3;			// BOM占用3个字节
			obj.Close();
			obj = null;
						
		return strSize;						// 计算字符串包含的字节数
	})
	
	// 执行解包操作
	Packs.add('unPack', function( source, target ){
		// 初始化对象
		this.object.Type = 1; 
		this.object.Mode = 3; 
		this.object.Open();
		this.object.Position = 0;
		this.object.LoadFromFile(source);
		this.binary = this.object.Read();
		
		// 开始解包
		target = target.replace(/\\$/, '');
		var headerInfo = this.getHeaderInfo(source),
			headerSize = headerInfo.substr(0, 8),
			headerText = headerInfo.substr(12);
		
		var arr = headerText.split('|'), chunkDataLenth = 16 + Number(headerSize) + 1;
		var root = target;
		this.autoCreateFolder(root);									// 创建根目录
		for ( var i = 1 ; i < arr.length - 1; i++ ){
			if (arr[i].indexOf('>') == -1) {
				this.autoCreateFolder(root + '\\' + arr[i]);			// 创建文件夹
			}else{
				var fileInfo = arr[i].split('>'),
					fileName = fileInfo[0],//.replace(/\\/g, '/'),
					fileSize = Number(fileInfo[1]),
					filePath = root + '\\' + fileName;
				
				this.autoCreateFolder(filePath.split('\\').slice(0, -1).join('\\'));   	// 先创建文件夹
				
				if( fileSize == 0) {
					this.fso.CreateTextFile(filePath, true);			// 创建空文件
				}else{		
					this.SaveFile(chunkDataLenth, fileSize, filePath);	// 读取数据流并写入目标文件
	
					chunkDataLenth += fileSize;
				}
			}
		}
	});
	
	Packs.add('getHeaderInfo', function( path ){
		var obj = new ActiveXObject('Adodb.Stream'),
			text;
			
			obj.Type = 2;
			obj.Open();
			obj.Charset = 'utf-8';
			obj.LoadFromFile(path);
			obj.Position = 4 + 3;							// 自动添加了BOM信息，所以需要 + 3
			var headerLength = Number(obj.ReadText(8));		// 读取文件头长度
			obj.Position = 4 + 3;
			text = obj.ReadText(12 + headerLength);			// 读取文件头内容
			obj.Close();
			obj = null;
						
		return text;	
	})
	
	Packs.add('SaveFile', function( start, length, path ){
		var obj = new ActiveXObject('Adodb.Stream'), 
			paths = path;
	
			obj.Type = 1;
			obj.Mode = 3;
			obj.Open();
			this.object.Position = start;
			this.object.CopyTo(obj, length);
			obj.SaveToFile(paths, 2);
			obj.Close();
			obj = null;
	});
	
	Packs.add('autoCreateFolder', function( fullpath ){
		var root = Server.MapPath('/'),
			path = fullpath.replace(root, ''),
			arrs = path.replace(/^\\/, '').split('\\');
			
		for ( var i = 0 ; i < arrs.length ; i++ ){
			root += '\\' + arrs[i];
			if ( !this.fso.FolderExists(root) ){
				this.fso.CreateFolder(root);
			}
		}
		
		return this.fso.FolderExists(fullpath);
	});
		
	return Packs;
});