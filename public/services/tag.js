// JavaScript Document
var TagModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('../library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
	}
});

TagModule.extend('add', function( tags ){
	if ( !Library.type(tags, 'array') ){
		tags = [tags];
	};
	
	var rec, rets = [];
	
	for ( var i = 0 ; i < tags.length ; i++ ){
		if ( tags[i] && tags[i].length > 0 ){
			rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql("Select * From blog_tags Where tag_name='" + tags[i] + "'")
				.process(function( object ){
					if ( !object.Bof && !object.Eof ){
						object('tag_count') = object('tag_count').value + 1;
						object.Update();
					}else{
						object.AddNew();
						object('tag_name') = tags[i];
						object('tag_count') = 1;
						object.Update();
					};
					rets.push('{' + object('id').value + '}');
				}, 3);
		}
	};
	return rets;
});

TagModule.extend('remove', function( ids ){
	if ( !Library.type(ids, 'array') ){
		ids = [ids];
	};

	for ( var i = 0 ; i < ids.length ; i++ ){
		if ( ids[i] && ids[i].length > 0 ){
			var rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql("Select * From blog_tags Where id=" + ids[i])
				.process(function( object ){
					if ( !object.Bof && !object.Eof ){
						var count = object('tag_count').value;
						if ( count > 1 ){
							object('tag_count') = count - 1;
							object.Update();
						}else{
							object.Delete();
						};
					}
				}, 3);
		}
	};
});

TagModule.extend('read', function( id ){
	var rec = new this.dbo.RecordSet(this.conn), name;
	rec
		.sql("Select * From blog_tags Where id=" + id)
		.process(function( object ){
			if ( !object.Bof && !object.Eof ){
				name = object('tag_name').value;
			};
		});
		
	return name;
});

TagModule.extend('SaveCacheFile', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		ret = {};
	rec
		.sql('Select * From blog_tags')
		.open()
		.each(function( object ){
			ret[object('id').value + ''] = {
				id: object('id').value,
				tag_name: object('tag_name').value,
				tag_count: object('tag_count').value
			}
		})
		.close();
		
	var h = '';
	for ( var i in ret ){
		h += 'exports["' + i + '"] = ' + JSON.stringify(ret[i]) + ';\n';
	};
	var fs = this.fs;
	if ( !fs ) {
		var fso = require('fso');
		fs = new fso();
	};
	fs.saveFile(resolve('private/chips/' + blog.cache + 'blog.tags'), h);
});

return TagModule;