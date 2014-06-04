// JavaScript Document
var fns = require('fns');
var upload = function(){
	this.object = new ActiveXObject(Library.com_stream);
	this.header = String(Request.ServerVariables("HTTP_CONTENT_DISPOSITION"));
	this.config = {
		saveto: "uploads", //全路径
		speed: 1000,
		exts: []
	};
	this.msg = { success: false, error: 0 };
	/*
		1: 文件格式不合法
		2: 保存文件的文件夹不存在
		3: 上传文件的文件名不合法
		4: 文件二进制格式不符合规范
		5: 文件上传失败
	 */
};

upload.prototype.readBinary = function(speed){
/*	Response.BinaryWrite(Request.BinaryRead(Request.TotalBytes));
	return;*/
	var totalSize = Request.TotalBytes,
		haveReadSize = 0,
		binaryChunkData;

	if ( totalSize < speed ){
		speed = totalSize;
	}

	var obj = new ActiveXObject(Library.com_stream);
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
}

upload.prototype.saveFile = function(copyBack, start, end, path){
	var obj = new ActiveXObject(Library.com_stream);
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open();
		copyBack.Position = start + 2;
		copyBack.CopyTo(obj, end - start);
		obj.SaveToFile(path, 2);
		obj.Close();
		obj = null;
}

upload.prototype.paramFileName = function(copyBack, start, end){
	var obj = new ActiveXObject(Library.com_stream),
		filename = "";
		
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open();
		copyBack.Position = start + 2;
		copyBack.CopyTo(obj, end - start);
		obj.Position = 0;
		obj.Type = 2;
		obj.Charset = module.charset;
		filename = obj.ReadText;
		obj.Close();
		obj = null;
		
	return filename;
}

upload.prototype.Html5Upload = function(){
	return this.header;
	var name = /name=\"([^\"]+)\"/.exec(this.header);
	if ( name && name[1] ){
		name = name[1];
	}else{
		name = "";
	}

	if ( name.length === 0 ){
		this.msg.error = 3;
		return this.msg;
	}

	var filename = /filename=\"([^\"]+)\"/.exec(this.header);
	if ( filename && filename[1] ){
		filename = filename[1];
	}else{
		filename = "";
	}

	if ( filename.length === 0 ){
		this.msg.error = 3;
		return this.msg;
	}

	var ext = name.split(".").slice(-1).join("");

	if ( this.config.autoName ){
		filename = fns.randoms(40) + "." + ext;
	}else if ( this.config.newFileName && this.config.newFileName.length > 0 ){
		filename = this.config.newFileName + "." + ext;
	}

	var fs = require("fs").create(),
		savefolder = contrast(this.config.saveto.replace(/\/$/, "")),
		savepath = savefolder + "\\" + filename,
		size = 0;

	if ( fs.exist(savefolder, true) ){
		if ( this.CheckExts(ext) ){
			var obj = new ActiveXObject(Library.com_stream);
				obj.Type = 1;
				obj.Mode = 3;
				obj.Open();
				obj.Write(this.readBinary(this.config.speed));
				size = obj.Size;
				obj.Position = 0;
				obj.SaveToFile(savepath, 2);
				obj.Close();
				obj = null;

			if ( fs.exist(savepath) ){
				this.msg.success = true;
				this.msg.error = 0;
				this.msg.params = {
					path: savepath,
					filename: filename,
					size: size,
					ext: ext
				};
			}else{
				this.msg.error = 5;
			}
		}else{
			this.msg.error = 1;
		}
	}else{
		this.msg.error = 2;
	}

	return this.msg;
}

upload.prototype.CommonUpload = function(){
	var binary = this.readBinary(this.config.speed),
		ascObject = new ActiveXObject(Library.com_stream),
		ascText;
//Response.BinaryWrite(binary);
//return
		ascObject.Type = 2;
		ascObject.Open();
		ascObject.WriteText(binary);
		ascObject.Position = 0;
		ascObject.Charset = "ascii";
		ascObject.Position = 2;
		ascText = ascObject.ReadText;

	var line, linepos, start = 0, end = 0, tmp = -1, files = {};

	linepos = ascText.indexOf("\r\n");
	if ( linepos !== -1 ){
		line = ascText.substring(0, linepos);
	}else{
		this.msg.error = 4;
		return this.msg;
	}

	start = line.length + 2;
	ascText = ascText.substring(start);
	tmp = ascText.indexOf( line );

	while ( tmp > -1 ){
		end = start + tmp - 2;
		(function(){
			var whole, header, headerpos, bodyerpos;
			
			whole = ascText.substring(0, tmp - 2);
			headerpos = whole.indexOf("\r\n\r\n");
			
			if ( headerpos > -1 ){
				header = ascText.substring(0, headerpos);
				bodyerpos = headerpos + 4;
				var name = /name=\"([^\"]+)\"/.exec(header);
				if ( name && name[1] ){
					name = name[1];
					if ( files[name] === undefined ){ files[name] = {}; };
					
					var filename = /filename=\"([^\"]+)\"/.exec(header);
					if ( filename && filename[1] ){
						filename = filename[1];
						files[name].filenameStart = header.indexOf('filename="') + start + 10;
						files[name].filenameEnd = header.split('filename="')[1].indexOf('"') + files[name].filenameStart;
						files[name].isFile = true;
						files[name].start = start + bodyerpos;
						files[name].end = end;
						files[name].ext = filename.split(".").slice(-1).join("");
						files[name].size = files[name].end - files[name].start;
					}else{
						files[name].isFile = false;
					}
				}
			}
			
			start += tmp + line.length + 2;
			ascText = ascText.substring(tmp + line.length + 2);
			tmp = ascText.indexOf( line );
		})();
	}

	//Library.log(JSON.stringify(files))
	//{"files":{"filenameStart":98,"filenameEnd":123,"isFile":true,"start":168,"end":3793835,"ext":"zip","size":3793667}}
	var _keep = (function(lists, _this){
		var keep = [];
		for ( var item in lists ){
			if ( lists[item].isFile ){
				var filename, ext = lists[item].ext;
				
				if ( _this.config.autoName ){
					filename = fns.randoms(40) + "." + ext;
				}else if ( _this.config.newFileName && _this.config.newFileName.length > 0 ){
					filename = _this.config.newFileName + "." + ext;
				}else{
					filename = _this.paramFileName(ascObject, lists[item].filenameStart, lists[item].filenameEnd);
				};

				var	fso = require('fso'),
					fs = new fso(),
					savefolder = contrast(_this.config.saveto.replace(/\/$/, "")),
					savepath = savefolder + "\\" + filename;//Library.log(1)
				//Library.log(savepath)
				var ret = { success: false };

				if ( fs.exist(savefolder, true) ){
					if ( _this.CheckExts(lists[item].ext) ){						
						_this.saveFile(ascObject, lists[item].start, lists[item].end, savepath);
						if ( fs.exist(savepath) ){
							ret.success = true;
							ret.error = 0;
							ret.params = {
								path: savepath,
								filename: filename,
								size: lists[item].size,
								ext: lists[item].ext
							};
						}else{
							ret.error = 5;
						}
					}else{
						ret.error = 1;
					}
				}else{
					ret.error = 2;
				}
				
				keep.push(ret);
			}
		}
		
		return keep;
	})(files, this);
	
	if ( _keep.length === 1 ){
		this.msg = _keep[0];
	}else{
		this.msg = _keep;
	}
	
	return this.msg;
}

upload.prototype.CheckExts = function(ext){
	if ( this.config.exts === "*" || this.config.exts === "" ){
		this.config.exts = [];
	}
	if ( this.config.exts.length === 0 ){
		return true;
	}
	
	ext = ext.toLowerCase();
	
	if ( this.config.exts.indexOf(ext) === -1 ){
		return false;
	}else{
		return true;
	}
}

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

exports.upload = function(options){
	var AppUpload = new upload();

	for ( var i in options ){
		AppUpload.config[i] = options[i]
	};

	if ( AppUpload.config.newFileName && AppUpload.config.newFileName.length > 0 ){
		AppUpload.config.autoName = false;
	}

	if ( AppUpload.header !== "undefined" ){
		return AppUpload.Html5Upload();
	}else{
		return AppUpload.CommonUpload();
	}
}

exports.message = function( error ){
	if ( !isNaN(error) ){
		if ( error > 0 ){
			var msg = '';
			switch ( error ) {
				case 1:
					msg = '文件格式不合法';
					break;
				case 2:
					msg = '保存文件的文件夹不存在';
					break;
				case 3:
					msg = '上传文件的文件名不合法';
					break;
				case 4:
					msg = '文件二进制格式不符合规范';
					break;
				case 5:
					msg = '文件上传失败';
					break;
				default:
					msg = '找到错误类型';
			}
			return msg;
		}else{
			return "上传成功";
		}
	}else{
		return "错误类型不合法";
	}
}