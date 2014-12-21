var LinkModule = new Class();

LinkModule.add('getList', function(){
	var rec = new dbo(blog.tb + 'links', blog.conn);
	var data = rec.selectAll().and('link_hide', 0).desc('id').desc('link_type').toJSON();
	
	return data;
});

LinkModule.add('getSideList', function(top, type){
	var rec = new dbo(blog.tb + 'links', blog.conn);
	var data = [];
	if ( type !== 2 ) {
		if ( top !== 0 ) {
			data = rec.top(top).selectAll().and('link_hide', 0).and('link_index', 1).toJSON();
		}else{
			data = rec.selectAll().and('link_hide', 0).and('link_index', 1).toJSON();
		}
	}else{
		if ( top !== 0 ) {
			data = rec.top(top).selectAll().and('link_hide', 0).and('link_index', 1).and('link_type', type).toJSON();
		}else{
			data = rec.selectAll().and('link_hide', 0).and('link_index', 1).and('link_type', type).toJSON();
		}
	}
	
	return data;
});

module.exports = LinkModule;