// JavaScript Document
var download = function(url, path, options){
		this.fso = require("fso");
		this.xmlhttp = new ActiveXObject(coms.xmlhttp);
		this.url = url;
		this.path = path;
		this.start = 0;
		this.length = 0;
		this.speed = 1024;
		this.fileStart = 0;
		this.options = options;
}

download.prototype.getLength = function(){
		this.xmlhttp.open("HEAD", this.url, false);
		this.xmlhttp.send();
		this.length = Number(this.xmlhttp.getResponseHeader("Content-Length"));
		if ( typeof this.options.onheader === "function" ){
				this.options.onheader.call(this);
		}
}

download.prototype.checkFile = function(){
		var filename = this.url.split("/").slice(-1).join("");

		if ( /\/$/.test(this.path) ){
				this.pathname = contrast(this.path + filename);
		}else{
				this.pathname = contrast(this.path + "/" + filename);
		}

		if ( this.fso.exsit(this.pathname) ){ this.start = this.fs.getfile(this.pathname).size; };

		if ( typeof this.options.oncheckfile === "function" ){
				this.options.oncheckfile.call(this);
		}
}

download.prototype.range = function(){
		var bytes = this.start + "-" + (this.start + this.speed - 1);
		this.fileStart = this.start;
		this.xmlhttp.open("GET", this.url, false);
		this.xmlhttp.setRequestHeader( "Range", "bytes=" + bytes );
		this.xmlhttp.setrequestheader("Content-Type:", "application/octet-stream");
		this.xmlhttp.send();
		this.start += this.speed;

		var stream = new ActiveXObject(coms.stream);
				stream.Type = 1;
				stream.Mode = 3;
				stream.Open();
				if ( this.fso.exsit(this.pathname) ){
						stream.LoadFromFile(this.pathname);
				}
				stream.Position = this.fileStart;
				stream.Write(this.xmlhttp.responseBody);
				stream.SaveToFile(this.pathname, 2);
				stream.Close();
				stream = null;

		if ( typeof this.options.onrange === "function" ){
				this.options.onrange.call(this);
		}
}

download.prototype.getChunk = function(){
		if ( typeof this.options.onstart === "function" ){
				this.options.onstart.call(this);
		}

		while ( 
				this.start < this.length && (function(_this){
						if ( typeof _this.options.onprocess === "function" ){
								var rets = _this.options.onprocess.call(_this);
								if ( rets === false ){
										return false;
								}else{
										return true;
								}
						}else{
								return true;
						}
				})(this) 
		){
				if ( this.length - this.start < this.speed ){
						this.speed = this.length - this.start;
				}
				this.range();
		}

		if ( this.start === this.length && typeof this.options.oncomplete === "function" ){
				this.options.oncomplete.call(this);
		}
}

exports.download = function(url, path, options){
		var down = new download(url, path, options);
			down.getLength();
			down.checkFile();
			down.getChunk();
}