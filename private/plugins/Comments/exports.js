var CommentModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var c = require('public/library/connect');
			this.conn = c.conn;
			this.dbo = c.dbo;
		}
		if ( !this.setting ){
			this.getSettingValue();
		}
		if ( !this.fso ){
			var fso = require('fso');
			this.fso = new fso;
		}
	}
});

CommentModule.add('getSettingValue', function(){
	var plugins = require('public/library/plugin');
		plugins.add('dbo', this.dbo);
		plugins.add('conn', this.conn);
	var plugin = new plugins();
	
	this.setting = plugin.getSettingParams(this.pid);
});

CommentModule.add('getCount', function( id ){
	var sp = (this.setting.audits == 0) ? ' And com_ispassed=1' : '';
	var sql = 'Select count(*) From blog_comments Where com_root=0 And com_article_id=' + id + sp;
	var t = this.conn.Execute(sql)(0) + '';
	return t;
});

CommentModule.add('getSideValue', function( t ){
	if (this.fso.exist(contrast('./cache/top.asp'))) {
		return this.getSideCache(t);
	}else{
		return this.getSideList(t);
	}
});

CommentModule.add('getSideCache', function( t ){
	var cache = require('./cache/top.asp');
	var data = (t==0) ? cache.topComment : cache.topMessage;
	
	return data;
});

CommentModule.add('getSideList', function( t ){
	var rec = new this.dbo.RecordSet(this.conn);
	var sf = (t==0) ? '>' : '=';
	var sp = (this.setting.audits == 0) ? ' And com_ispassed=1' : '';		// 审核
	var keep = [], uids = [];
	var md5 = require('md5');
	var u = {};
	var outs = [];

	rec
		.sql('Select top ' + this.setting.tops + ' * From blog_comments Where com_article_id' + sf + '0' + sp + ' Order By com_postdate DESC')
		.open()
		.each(function( object ){
			keep.push({
				id: object('id').value,
				com_article_id: object('com_article_id').value,
				com_member_id: object('com_member_id').value,
				com_content: object('com_content').value,
				com_postdate: new Date(object('com_postdate').value).getTime(),
				com_username: object('com_username').value,
				com_usermail: object('com_usermail').value,
				com_usersite: object('com_usersite').value
			});
			if ( uids.indexOf(object('com_member_id').value) === -1 && object('com_member_id').value > 0 ){ uids.push(object('com_member_id').value); };			
		})
		.close();
		
	if ( uids.length > 0 ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_members Where id in (' + uids.join(',') + ')')
			.open()
			.each(function(object){
				u[object('id') + ''] = {
					nick: object('member_nick').value,
					avatar: object('member_avatar').value,
					mail: object('member_mail').value,
					site: object('member_website').value
				}
			})
			.close();
	}
	
	for ( var i = 0 ; i < keep.length ; i++ ){
		var nick, avatar;
		if ( keep[i].com_member_id > 0 ){
			nick = u[keep[i].com_member_id + ''].nick;
			mail = u[keep[i].com_member_id + ''].mail;
			site = u[keep[i].com_member_id + ''].site;
			avatar = u[keep[i].com_member_id + ''].avatar;
		}else{
			nick = keep[i].com_username;
			mail = keep[i].com_usermail;
			site = keep[i].com_usersite;
			avatar = blog.AppPlatForm + '/avatar/' + md5.make(keep[i].com_usermail).toLowerCase();
		}
		outs.push({
			nick: nick,
			mail: mail,
			site: site,
			avatar: avatar,
			id: keep[i].id,
			aid: keep[i].com_article_id,
			content: keep[i].com_content,
			time: keep[i].com_postdate
		});
	}
	
	return outs;
});

CommentModule.add('getList', function( id, page ){
	var perpage = (id == 0) ? this.setting.mes_perpage : this.setting.com_perpage;

	var rec = new this.dbo.RecordSet(this.conn);
	var md5 = require('md5');
	
	var sp = (this.setting.audits == 0) ? ' And com_ispassed=1' : '';		// 审核

	var params = {}, ids = [], uids = [], items = [], users = {}, outs = [];
	
	var ac = rec.DualTopPage('blog_comments', '*', 'com_article_id=' + id + ' And com_root=0' + sp, 'com_postdate DESC', 'com_postdate ASC', perpage, page, function( object ){
		ids.push(object('id').value);
		if ( object('com_member_id').value > 0 && uids.indexOf(object('com_member_id').value) === -1 ) { 
			uids.push( object('com_member_id').value ); 
		};
		
		params[object('id').value + ''] = {
			id: object('id').value,
			com_article_id: object('com_article_id').value,
			com_member_id: object('com_member_id').value,
			com_content: object('com_content').value,
			com_root: 0,
			com_parent: 0,
			com_postdate: new Date(object('com_postdate').value).getTime(),
			com_username: object('com_username').value,
			com_usermail: object('com_usermail').value,
			com_usersite: object('com_usersite').value,
			com_user: {},
			items: []
		};
	});
	
	// 返回pages
	var pages = rec.BuildPage(ac.pageindex, ac.pageCount);
	
	if ( ids.length > 0 ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_comments Where com_root in (' + ids.join(',') + ')' + sp)
			.open()
			.each(function(object){
				if ( object('com_member_id').value > 0 && uids.indexOf(object('com_member_id').value) === -1 ) { 
					uids.push( object('com_member_id').value ); 
				};
				
				items.push({
					id: object('id').value,
					com_article_id: object('com_article_id').value,
					com_member_id: object('com_member_id').value,
					com_content: object('com_content').value,
					com_root: object('com_root').value,
					com_parent: object('com_parent').value,
					com_postdate: new Date(object('com_postdate').value).getTime(),
					com_username: object('com_username').value,
					com_usermail: object('com_usermail').value,
					com_usersite: object('com_usersite').value,
					com_user: {},
					parent: {}
				});
			})
			.close();
	}
	
	if ( uids.length > 0 ){	
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_members Where id in (' + uids.join(',') + ')')
			.open()
			.each(function(object){
				users[object('id').value + ''] = {
					id: object('id').value,
					nick: object('member_nick').value,
					mail: object('member_mail').value,
					site: object('member_website').value,
					avatar: object('member_avatar').value
				}
			})
			.close();
	}
		
	for ( var i = 0 ; i < items.length ; i++ ){
		var root = items[i].com_root;
		var uid = items[i].com_member_id;
		if ( uid > 0 && users[uid + ''] ){
			items[i].com_user = users[uid + ''];
		}else{
			items[i].com_user.nick = items[i].com_username;
			items[i].com_user.mail = items[i].com_usermail;
			items[i].com_user.site = items[i].com_usersite;
			items[i].com_user.avatar = blog.AppPlatForm + '/avatar/' + md5.make(items[i].com_usermail).toLowerCase();
			items[i].com_user.id = 0;
		}
		// 获取子评论的父评论信息
		var parent = items[i].com_parent;
		if (root == parent) {
			items[i].parent.id = 0;
		}else{
			for ( var k = 0 ; k < i ; k++ ){
				if (items[k].id == parent) {
					items[i].parent = items[k];
					break;
				}
			}
		}

		params[root + ''].items.push(items[i]);
	};
	
	for ( var j in params ){
		var uid = params[j].com_member_id;
		if ( uid > 0 && users[uid + ''] ){
			params[j].com_user = users[uid + ''];
		}else{
			params[j].com_user.nick = params[j].com_username;
			params[j].com_user.mail = params[j].com_usermail;
			params[j].com_user.site = params[j].com_usersite;
			params[j].com_user.avatar = blog.AppPlatForm + '/avatar/' + md5.make(params[j].com_usermail).toLowerCase();
			params[j].com_user.id = 0;
		}
		// 获取子评论的父评论信息，这种方式效率太低，舍弃掉
		/*
		for ( var k = 0 ; k < params[j].items.length ; k++ ){
			var root = params[j].items[k].com_root;
			var parent = params[j].items[k].com_parent;
			params[j].items[k].parent.id = parent;
			params[j].items[k].parent.user = 'undefined';
			if (root == parent) {
				params[j].items[k].parent.user = params[j].com_user.nick;
			}else{
				for ( var m = 0 ; m < k ; m++ ){
					if (params[j].items[m].id == parent) {
						params[j].items[k].parent.user = params[j].items[m].com_user.nick;
						break;	
					}
				}
			}
		}
		*/
		
		outs.push(params[j]);
	}
	
	outs = outs.sort(function(a, b){
		return b.com_postdate - a.com_postdate;
	});

	return {comments:outs, pages:pages}
});

return CommentModule;