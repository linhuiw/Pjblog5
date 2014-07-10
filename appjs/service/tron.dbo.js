// JavaScript Document
exports.Connection = new Class({
	object: new ActiveXObject( Library.com_conn ),
	
	close:function(){
		this.object.Close();
	},
	
	connect: function( connections ){
		if ( typeof connections == 'string' ){
			try{
				this.object.Open("provider=Microsoft.jet.oledb.4.0;data source=" + connections);
				return this.object;
			}catch(e){
				try{				
					this.object.Open("driver={microsoft access driver (*.mdb)};dbq=" + connections);
					return this.object;
				}catch(e){}
			}
		}
		else{
			try{
				this.object.Open(
					[
						"Provider=sqloledb",
						"Data Source=" + 		connections.netserver,
						"Initial Catalog=" + 	connections.access,
						"User Id=" + 			connections.username,
						"Password=" + 			connections.password,
						""
					].join(";")
				);
				return this.object;
			}catch(e){
				try{
					this.object.Open(
						[
							"Driver={SQL Server}",
							"Server=" + 		connections.netserver,
							"Database=" + 		connections.access,
							"Uid=" + 			connections.username,
							"Pwd=" + 			connections.password,
							""
						].join(";")
					);
					return this.object;
				}catch(e){}
			}
		}
	}
});

var rec = new Class({
	getRows: function( arr, fieldslen ){
		var len = arr.length / fieldslen, data=[], sp; 
	
		for( var i = 0; i < len ; i++ ) { 
			data[i] = new Array(); 
			sp = i * fieldslen; 
			for( var j = 0 ; j < fieldslen ; j++ ) { data[i][j] = arr[sp + j] ; } 
		}
	
		return data; 
	}
});

rec.extend('initialize', function( ConnectionObject ){
	this.connect = ConnectionObject;
	this.events = {};
	this.object = new ActiveXObject(Library.com_record);
});

rec.extend('sql', function( sql ){
	this.sqlstr = sql;
	return this;
});

rec.extend('open', function( up ){
	this.object.Open( this.sqlstr, this.connect, 1, up ? up : 1 );
	return this;
});

rec.extend('each', function( callback ){
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
});

rec.extend('value', function(){
	try{ 
		var tempArr = this.object.GetRows().toArray(); 
		return this.getRows( tempArr, this.object.Fields.Count );
	}catch(e){
		return [];
	}
});

rec.extend('AdoPage', function( absolutePage, pageSize, callback ){
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
});

rec.extend('BuildPage', function( currentPage, totalPages, perPageCount ){
	if ( perPageCount === undefined ){ perPageCount = 9; }
		if ( perPageCount > totalPages ){ perPageCount = totalPages; }

		var isEven = perPageCount % 2 === 0 ? false : true,
			o = Math.floor(perPageCount / 2),
			l = isEven ? o : o - 1,
			r = o;

		var _l = currentPage - l,
			_r = currentPage + r;

		if ( _l < 1 ){
			_l = 1;
			_r = _l + perPageCount - 1;
			if ( _r > totalPages ){
				_r = totalPages;
			}
		}else if ( _r > totalPages ){
			_r = totalPages;
			_l = _r - perPageCount + 1;
			if ( _l < 1 ){
				_l = 1;
			}
		}

		return {
			prev : currentPage - 1 < 1 ? 1 : currentPage - 1,
			next : currentPage + 1 > totalPages ? totalPages : currentPage + 1,
			from : _l,
			to : _r,
			current : currentPage
		}
});

rec.extend('execute', function( sql ){
	return this.connect.Execute(sql);
});

rec.extend('process', function(callback, up){
	var xet;
	this.open(up);
	if ( typeof callback === 'function'){
		xet = callback.call(this, this.object);
	};
	this.close();
	return xet ? xet : this;
});

rec.extend('on', function( event, callback ){
	this.events[event] = callback;
	return this;
});

rec.extend('trigger', function(event, params){
	if ( this.events[event] ){
		if ( !Library.type(params, 'array') ){
			params = [params];
		}
		this.events[event].apply(this, params);
	}
	
	return this;
});

rec.extend('close', function(){
	this.object.Close();
});

rec.extend('add', function( data ){
	this.object.AddNew();
	for ( var items in data ){
		this.object(items) = data[items];
	}
	this.object.Update();
	this.trigger('add', this.object);
	return this;
});

rec.extend('update', function(data){
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
		}
		this.trigger('update', this.object);
	};
	
	return this;
});

rec.extend('remove', function(){
	if ( !this.object.Bof && !this.object.Eof ){
		if ( this.object.RecordCount > 1 ){
			this.object.MoveFirst();
			while ( !this.object.Eof )
			{
				this.object.Delete();
				this.object.MoveNext();
			}
		}else{
			this.object.Delete();
		}
		this.trigger('remove', this.object);
	};
	
	return this;
});

rec.extend('DualTopPage', function( table, alters, param, orderby, _orderby, pagesize, pageindex, callback , up ){
	var v = {
		pageindex: 0,
		pagesize: 15,
		recordCount: 0,
		pageCount: 0
	};
	
	var _sql = 'select count(1) from ' + table + ( param ? ' where ' + param : '' );
	var _recordCount = this.connect.Execute( _sql )(0);
	
	_recordCount = parseInt( _recordCount, 10 );
	_pageCount = Math.ceil(_recordCount / pagesize);
	
	if ( pageindex < 1 ){
		pageindex = 1;
	}
	else if ( pageindex > _pageCount){
		pageindex = _pageCount;
	}

	if ( pageindex === 1 ){
		_sql = "Select Top " + pagesize +
				( alters ? " " + alters : " *" ) +
				" From " + table +
				( param ? " WHERE " + param : "" ) +
				( orderby ? " ORDER BY " + orderby : "" );
	}
	else if ( pageindex == _pageCount ){
		_sql="SELECT Top " + pagesize + " * FROM " +
			" (" +
			"SELECT TOP "+(  _recordCount - pagesize * (pageindex - 1)   ) +
			( alters ? " " + alters : " *" ) +
			" FROM " + table +
			( param ? " WHERE " + param : "" ) +
			" ORDER BY " + _orderby +
			") AS T " +
			" ORDER BY " + orderby + " ";
	}
	else if ( pageindex < (_pageCount / 2 + _pageCount % 2) ){
		_sql = "SELECT * FROM " +
			" ( " +
			" SELECT TOP " + pagesize + " * FROM " +
			" ( " +
			" SELECT TOP " + ( pagesize * pageindex ) +
			( alters ? " " + alters : " *" ) +
			" FROM " + table +
			( param ? " WHERE " + param : "" ) +
			" ORDER BY " + orderby + " " +
			" ) AS T " +
			" ORDER BY " + _orderby + " " +
			" ) " +
			" ORDER BY " + orderby + " ";
	}
	else{
		_sql="SELECT TOP " + pagesize + " * FROM " +
			" ( "+
			" SELECT TOP " + (  (_recordCount % pagesize) + pagesize * (_pageCount - pageindex)  ) +
			( alters ? " " + alters : " *" ) +
			" FROM " + table +
			( param ? " WHERE " + param : "" ) +
			" ORDER BY " + _orderby + " " +
			" ) AS T " +
			" ORDER BY " + orderby + " ";
	}

	v.pageindex = pageindex;
	v.pagesize = pagesize;
	v.recordCount = _recordCount;
	v.pageCount = _pageCount;
	
	this.sql( _sql ).open( up ).each(callback).close();
	return v;
});

exports.RecordSet = rec;