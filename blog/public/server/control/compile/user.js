var user = new Class(function( querys, getforms ){
	this.data = {};
	
	var User = require(':public/library/user'),
		_ = new User();
		
	this.get(querys, getforms, _);
	
	return this.data;
});

user.add('get', function( querys, getforms, userPromise ){
	var p = querys.s;
	
	if ( !p || p.length === 0 ){
		p = 1;
	}
	
	if ( !isNaN(p) ){
		p = Number(p);
	}
	
	if ( p < 1 ) p = 1;
	var data = userPromise.getUsersByStorageProcess(p);
	var groups = require(':private/caches/groups.json');
	this.data.groups = groups;
	data.result.forEach(function(o){
		if ( groups[o.member_group] ){
			o.member_group = groups[o.member_group];
		};
		
	});
	
	this.data.list = data;
	
	var IPAGE = require('iPage');
	var iPage = new IPAGE(this.data.list.PageCount, this.data.list.PageIndex);
	
	this.data.pages = {
		arrays: iPage.toArray(),
		value: iPage.value,
		s: p + ''
	};
});

module.exports = user;