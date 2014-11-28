(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define([], mod);
    }
    else {
        window.crc32 = mod();
    }
})(function () {
	
	function GetCrc32(Path){
		
		/*shmshz*/
		var Crc32Table=new Array(256),
			i,
			j,
			Crc;
			
		for(i = 0; i < 256; i++){
			Crc=i;
			for(j=0; j<8; j++){
				if(Crc & 1){
					Crc=((Crc >> 1)& 0x7FFFFFFF) ^ 0xEDB88320;
				}else{
					Crc=((Crc >> 1)& 0x7FFFFFFF);
				}
			}
			Crc32Table[i]=Crc;
		};
		
		Crc=0xFFFFFFFF;
		var objAdo=new ActiveXObject("Adodb.Stream");
	    	objAdo.Open;
	    	objAdo.Type = 1;
	    	objAdo.LoadFromFile(Path);
	    	
		for (var i=0;i<objAdo.Size;i++){
			objAdo.Position=i;
			
			Crc=((Crc >> 8)&0x00FFFFFF) ^ Crc32Table[(Crc & 0xFF)^ VB_AscB(objAdo.Read(1))];/*Crc ^=0xFFFFFFFF;*/
			
		}
		
		objAdo.Close;
		objAdo=null;
		
		if (Crc<0){
			Crc=-Number(Crc)-1;
		}
		else{
			Crc=4294967296-Crc-1;
		}

		return Crc.toString(16).toUpperCase();
	};
	
	var crc32 = new Class();
	
	crc32.add('getFileList', function(AbsolutePath){
		var folders = fs(AbsolutePath, true).exist().dirs(function(name){
			return AbsolutePath + '\\' + name;
		}).fail(function(){ return []; }).value();
		
		var files = fs(AbsolutePath, true).exist().files(function(name){
			return AbsolutePath + '\\' + name;
		}).fail(function(){ return []; }).value();
			
		if ( folders.length === 0 ){
			return files;
		}else{
			
			for ( var i = 0 ; i < folders.length ; i++ ){
				files = files.concat(this.getFileList(folders[i]));
			};
			
			return files;
		}

	});
	
	crc32.add('gets', function(files, callback){
		var _files = {};
	
		for ( var i = 0 ; i < files.length ; i++ ){
			var _files_ = files[i];
			if ( typeof callback === 'function' ){
				var a = callback.call(this, _files_) || _files_;
				if ( a ){
					_files_ = a;
				}
			};
			_files[_files_] = GetCrc32(files[i]);
		}
		return _files;
	});
	
	crc32.add('compile', function(AbsolutePath, callback){
		AbsolutePath = AbsolutePath.replace(/\\$/, '');
		return this.gets(this.getFileList(AbsolutePath), callback);
	});
	
	crc32.add('compress', function(file, value){
		var status = true;
		
		fs(file).exist().then(function(){
			status = GetCrc32(file) !== value;
		}).fail(function(){
			status = true;
		});
		
		return status;
	});
	
	return crc32;
	
});