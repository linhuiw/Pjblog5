/* JavaScript Document
 *
 * @author: evio
 * @mail: evio@vip.qq.com
 * @website: http://webkits.cn
 *
 *
 * 配置参数：
 *
 * @folder: 传入绝对文件夹地址 一般在调用使用使用 contrast 或者 resolve 方法转换地址
 * @exts: 文件后缀允许传入的数组
 * @size: 单个文件大小限制 单位 byte
 * @beforeUpload: 回调方法。 用于在开始上传前做预处理。如果返回false 就停止上传。
 * @rename: 控制文件生成格式。 写法 '{$timestrap}.{$ext}' 这里的替换变量有如下： {$timestrap} {$normal} {$ext} {$random:20} 。
 *			如果写成 welcome.{$ext} 而且文件后缀是zip。 那么自动转换成 welcome.zip
 * @resolve: 控制返回filepath的值。 回调函数。有一个参数 filepath.这个filepath参数为系统提供的默认绝对地址。
 * @success: 当个文件上传成功后的回调函数。 有一个参数为这个文件包含的信息。function(file){ file.size //文件大小  file.filename // 文件名}
 *
 * 本程序适用于TronAsp框架下运行。如果不在此框架下运行。所产生后果，作者不予承担。
 */

var upload = new Class({
	/**
	 * @params [json]configs
	 * @return [object] this
	 */
	initialize: function( configs ){
		this.config = this.mock({
			folder: '',
			exts: ['jpg', 'gif', 'bnp'],
			size: 8 * 1024 * 1024 * 10
		}, configs);
		this.achor = 0;
		this.moves = 0;
	},
	
	// 块容量
	speed: 1024,
	
	// 全局stream对象
	object: new ActiveXObject("Adodb.Stream"),
	
	// namespace 命名空间
	nameSpace: {},
	
	// 游标
	achor: 0,
	moves: 0,
	
	// 错误信息
	error: {
		"0": "上传或记录单个文件成功",
		"403": "文件上传类型不合法",
		"405": "文件大小超过了系统允许的最大单个上传容量"
	},
	
	// fso对象
	fs: new ActiveXObject("Scripting.FileSystemObject")
});

upload.add('randoms', function(l){
	var x = "123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
 	var tmp="";
 	for( var i = 0 ; i < l; i++ ) {
 		tmp += x.charAt(Math.ceil(Math.random()*100000000) % x.length);
 	}
 	return tmp;
});

upload.add('mock', function( source, target ){
	for ( var items in target ){
		source[items] = target[items];
	}
	return source;
});

// 利用内容快长度便利二进制组成完整长度
upload.add('getAllHttpBinray', function(){
	var totalSize = Request.TotalBytes,
		haveReadSize = 0,
		binaryChunkData,
		speed = this.speed;

	if ( totalSize < speed ){
		speed = totalSize;
	}

	var obj = new ActiveXObject("Adodb.Stream");
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open();

	while ( haveReadSize < totalSize ){
		if (totalSize - haveReadSize < speed){
			speed = totalSize - haveReadSize;
		}
		obj.Write(Request.BinaryRead(speed));
		haveReadSize += speed;
	}
		obj.Position = 0;
		binaryChunkData = obj.Read();
		obj.Close();
		obj = null;

	return binaryChunkData;
});

// 上传之前执行的 方法
upload.add('beforeUpload', function(){
	var ret = true;
	
	if ( this.config.beforeUpload && typeof this.config.beforeUpload === 'function' ){
		ret = this.config.beforeUpload.call(this);
	}
	
	return ret;
});

// 主函数 用户直接上传文件
// callback 回调 全部完成时候会执行
upload.add('httpload', function( callback ){
	if ( this.beforeUpload() === false ){
		return this.nameSpace;
	};
	
	if ( callback && typeof callback === "function" ){
		this.config.complete = callback;
	};
	
	this.AllBinary = this.getAllHttpBinray();
	this.text = this.AllBinary;
	this.CutLine = VB_DRIVER(this.AllBinary);

	this.object.Type = 1; 
	this.object.Mode = 3; 
	this.object.Open();
	this.object.Position = 0;
	this.object.Write(this.AllBinary);
	
	var i = 0;
	
	while ( (i = VB_INSERTB( this.AllBinary, this.CutLine )) > 0  ){
		var success = this.httpBlock(i);
		
		if ( !success ){
			break;
		}
	}
	
	this.object.Close();
	delete this.object;

	this.complete();
	return this.nameSpace;
});

// 内容包块的处理方法
upload.add('httpBlock', function( i ){
	var StartPos = i + VB_LENB( this.CutLine ) + VB_LENB( VB_BNCRLF ),
		EndPos = VB_INSERTBS( StartPos, this.AllBinary, this.CutLine) - VB_LENB( VB_BNCRLF ),
		Parts;	
		
	this.achor = this.moves + StartPos;
	this.moves = this.moves + EndPos;

	if ( EndPos > 0 ){
		Parts = VB_MIDBS(this.AllBinary, StartPos, EndPos - StartPos);	
		this.AllBinary = VB_MIDB(this.AllBinary, EndPos + 1);
		this.httpGetMessage(Parts);

		return true;
	}else{
		return false;
	}
});

// 单个文件的处理方法
upload.add('httpGetMessage', function( block ){
	
	var headLine = VB_INSERTB(block, VB_DOUBLEBNCRLF);

	if ( headLine > 0 ){
		var head = this.httpBinaryToText(VB_MIDBS(block, 1, headLine));
		var NameExec = /name\=\"([^\"]+)\"/.exec(head),
			FileNameExec = /filename\=\"([^\"]+)\"/.exec(head),
			name,
			filename,
			ext,
			a = this.achor + headLine + VB_LENB(VB_DOUBLEBNCRLF) - 1;

		if ( NameExec && NameExec[1] ){
			name = NameExec[1];
			this.nameSpace[name] = { file: false, error: 0 };
			
			var body = VB_MIDB(block, headLine + VB_LENB(VB_DOUBLEBNCRLF));

			if ( FileNameExec && FileNameExec[1] ){
				filename = FileNameExec[1];
				ext = filename.split('.').slice(-1).join('.');

				this.nameSpace[name]['uploadName'] = filename;
				this.nameSpace[name]['ext'] = ext;
				this.nameSpace[name]['file'] = true;
				this.nameSpace[name]['size'] = this.moves - a;
				this.nameSpace[name]['dir'] = /\\$/.test(this.config.folder) ? this.config.folder : this.config.folder + '\\';
				
				// 检查后缀
				if ( !this.checkFileExts(ext) ){
					this.nameSpace[name]['error'] = 403;
					return;
				};
	
				// 检查大小
				if ( !this.checkFileSize(this.config.size, this.nameSpace[name]['size']) ){
					this.nameSpace[name]['error'] = 405;
					return;
				}
				
				// 自动修改文件名
				this.nameSpace[name]['filename'] = this.makeFileName(filename.split('.').slice(0, -1).join('.'), ext);	
				
				// 自动创建文件夹
				this.autoCreateFolder(this.nameSpace[name]['dir']);
				
				// 分配filepath属性
				this.nameSpace[name]['filepath'] = this.nameSpace[name]['dir'] + this.nameSpace[name]['filename'];
				var wholePath = this.checkReSolvePathName(this.nameSpace[name]['dir'] + this.nameSpace[name]['filename']);
				if ( wholePath && wholePath.length && wholePath.length > 0 ){
					this.nameSpace[name]['filepath'] = wholePath;
				};
				
				// 分配value属性
				this.nameSpace[name]['value'] = this.nameSpace[name]['filepath'];
				
				// 保存本地
				this.httpSaveFile(
					a, 
					this.nameSpace[name]['size'], 
					this.nameSpace[name]['filepath']
				);
				
				// 单个文件上传成功回调方法
				this.done(this.nameSpace[name]);
				
			}else{
				this.nameSpace[name]['value'] = this.httpBinaryToText(body);
			}
		}
	}
});

upload.add('checkFileExts', function(ext){
	var ret = true, j = -1;
	
	if ( this.config.exts === '*' ){
		return true;
	};
	
	if ( this.config.exts && this.config.exts.length > 0 ){
		if ( !readVariableType(this.config.exts, 'array') ){
			this.config.exts = [this.config.exts];
		};

		for ( var i = 0 ; i < this.config.exts.length ; i++ ){			
			if ( this.config.exts[i].toLowerCase() === ext.toLowerCase() ){
				j = i;
				break;
			}
		}
		
		if ( j === -1 ){ ret = false; };
	}
	
	return ret;
});

upload.add('checkFileSize', function(maxSize, size){
	return maxSize > 0 ? size <= maxSize : true;
});

upload.add('makeFileName', function( name, ext ){
	if ( !this.config.rename ){
		this.config.rename = '{$timestrap}.{$ext}';
	};
	
	var that = this;
		
	return this.config.rename
		.replace(/\{\$timestrap\}/ig, new Date().getTime())
		.replace(/\{\$normal\}/ig, name)
		.replace(/\{\$ext\}/, ext)
		.replace(/\{\$random\:(\d+)\}/ig, function(reg){
			return that.randoms(reg[1]);
		});
});

upload.add('checkReSolvePathName', function( path ){
	if ( this.config.resolve && typeof this.config.resolve === 'function' ){
		return this.config.resolve.call(this, path);
	};
});

upload.add('done', function( data ){
	if ( this.config.success && typeof this.config.success === 'function' ){
		this.config.success.call(this, data);
	}
});

upload.add('autoCreateFolder', function( fullpath ){
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

upload.add('complete', function(){
	if ( this.config.complete && typeof this.config.complete === 'function' ){
		this.config.complete.call(this, this.nameSpace);
	}
});

upload.add('httpBinaryToText', function(binary){
	var object = new ActiveXObject("Adodb.Stream"),
		value;
		
		object.Type = 2;
		object.Mode = 3;
		object.Open();
		object.WriteText(binary);
		object.Position = 0;
		object.CharSet = modules.charset;
		object.Position = 2;
		value = object.ReadText();
		object.Close();
		object = null;
		
	return value;
});

upload.add('httpSaveFile', function( start, len, path ){
	var obj = new ActiveXObject("Adodb.Stream");
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open();
		this.object.Position = start - 1;
		this.object.CopyTo(obj, len);
		obj.SaveToFile(path, 2);
		obj.Close();
		obj = null;
});

module.exports = upload;