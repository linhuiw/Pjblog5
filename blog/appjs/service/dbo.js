// JavaScript Document
function readtype( param ){
	return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
}

function getRows( arr, fieldslen ){
	var len = arr.length / fieldslen, data=[], sp; 

	for( var i = 0; i < len ; i++ ) { 
		data[i] = new Array(); 
		sp = i * fieldslen; 
		for( var j = 0 ; j < fieldslen ; j++ ) { data[i][j] = arr[sp + j] ; } 
	}

	return data; 
}

exports.connect = function(connections){
	var obj = new ActiveXObject(coms.conn);
	
	if ( typeof connections == 'string' ){
		try{
			obj.Open("provider=Microsoft.jet.oledb.4.0;data source=" + connections);
			return obj;
		}catch(e){
			try{				
				obj.Open("driver={microsoft access driver (*.mdb)};dbq=" + connections);
				return obj;
			}catch(e){}
		}
	}
	else{
		try{
			obj.Open(
				[
					"Provider=sqloledb",
					"Data Source=" + 		connections.netserver,
					"Initial Catalog=" + 	connections.access,
					"User Id=" + 			connections.username,
					"Password=" + 			connections.password,
					""
				].join(";")
			);
			return obj;
		}catch(e){
			try{
				obj.Open(
					[
						"Driver={SQL Server}",
						"Server=" + 		connections.netserver,
						"Database=" + 		connections.access,
						"Uid=" + 			connections.username,
						"Pwd=" + 			connections.password,
						""
					].join(";")
				);
				return obj;
			}catch(e){}
		}
	}
}

var record = function(connect){
	this.connect = connect;
	this.object = new ActiveXObject(coms.record);
};

var query = function(sql, object, connect, up){
	this.object = object;
	this.connect = connect;
	this.object.Open( sql, this.connect, 1, up?3:1 );
}

query.prototype.each = function(callback){
	if ( !this.object.Bof && !this.object.Eof ){
		var i = 0;
		this.object.MoveFirst();
	
		while ( !this.object.Eof )
		{
			typeof callback === "function" && callback(this.object, i);
			this.object.MoveNext();
			i++;
		}
	}
	
	return this;
}

query.prototype.value = function(){
	try{ 
		var tempArr = this.object.GetRows().toArray(); 
		return getRows( tempArr, this.object.Fields.Count );
	}catch(e){
		return [];
	}
}

query.prototype.adopage = function(absolutePage, pageSize, callback){
	var _Core = this.object, 
		i = 0,
		ret;
		
	if ( !(this.object.Bof && this.object.Eof) ){
		var RsCount = _Core.RecordCount;
		if ( pageSize > RsCount ) pageSize = RsCount;
	
		var PageCount = Math.ceil( RsCount / pageSize );
		if ( PageCount < 0 ) PageCount = 0;
		if ( absolutePage > PageCount ) absolutePage = PageCount;
		if ( absolutePage < 1 ) absolutePage = 1;
	
		_Core.PageSize = pageSize;
		_Core.AbsolutePage = absolutePage;
	
		if ( typeof callback === "function" ){
			while ( !_Core.Eof &&  i < pageSize )
			{
				var t = callback(_Core, i);
	
				if ( t === undefined ){
					t = true;
				}
	
				if ( t === false ){
					break;
				}else{
					i++;
					_Core.MoveNext();
				}
			}
		}
		
		ret = {};
		
		ret.Count = RsCount;
		ret.pageSize = pageSize;
		ret.absolutePage = absolutePage;
		ret.pageCount = PageCount;
	}
	
	return ret;
}

record.prototype.sql = function(sql){
	return this.connect.Execute(sql);
}

record.prototype.events = {};

record.prototype.on = function(event, callback){
	this.events[event] = callback;
	return this;
}

record.prototype.trigger = function(event, params){
	if ( this.events[event] ){
		if ( readtype(params) !== 'array' ){
			params = [params];
		}
		this.events[event].apply(this, params);
	}
}

record.prototype.add = function(sql, data){
	this.object.Open( sql, this.connect, 1, 2 );
	this.object.AddNew();
	for ( var items in data ){
		this.object(items) = data[items];
	}
	this.object.Update();
	this.trigger('add', this.object);
	this.object.Close();
	return this;
}

record.prototype.update = function(sql, data){
	this.object.Open( sql, this.connect, 1, 3 );
	if ( !this.object.Bof && !this.object.Eof ){
		if ( this.object.RecordCount > 1 ){
			this.object.MoveFirst();
			while ( !this.object.Eof )
			{
				for ( var itemse in data ){
					this.object(itemse) = data[itemse];
				}
				this.object.Update();
				this.object.MoveNext();
			}
		}else{
			for ( var items in data ){
				this.object(items) = data[items];
			}
			this.object.Update();
			this.trigger('update', this.object);
		}
	}
	this.object.Close();
	return this;
}

record.prototype.query = function(sql, up){
	return new query(sql, this.object, this.connect, up);
}

exports.rs = record;