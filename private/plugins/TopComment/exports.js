var TopCommentModule = new Class({
	initialize: function( mark ){
		this.mark = mark;
	}
});

TopCommentModule.extend('getPluginCache', function(mark){
	var cachefile = require('private/chips/' + blog.cache + 'blog.uri.plugins'),
		outs = {};
	
	try{
		outs = cachefile.queens[mark];
	}catch(e){};
	
	return outs;
});

TopCommentModule.extend('getSettingValue', function(){
	var plugins = require("public/library/plugin");
		plugins.extend("dbo", this.dbo);
		plugins.extend("conn", this.conn);
	var plugin = new plugins(),
		setting = plugin.getSettingParams(this.getPluginCache(this.mark).id);
		
	return setting;
});

TopCommentModule.extend('getSideValue', function(){
	var setting = this.getSettingValue();
	var rec = new this.dbo.RecordSet(this.conn);
	var keep = [], uids = [];
	var md5 = require('md5');
	var u = {};
	var outs = [];
	
	rec
		.sql('Select top ' + setting.tops + ' * From blog_comments Order By com_postdate DESC')
		.open()
		.each(function( object ){
			keep.push({
				id: object("id").value,
				com_article_id: object("com_article_id").value,
				com_member_id: object("com_member_id").value,
				com_content: object("com_content").value,
				com_postdate: new Date(object("com_postdate").value).getTime(),
				com_username: object("com_username").value,
				com_usermail: object("com_usermail").value
			});
			if ( uids.indexOf(object("com_member_id").value) === -1 && object("com_member_id").value > 0 ){ uids.push(object("com_member_id").value); };			
		})
		.close();
		
	if ( uids.length > 0 ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql("Select * From blog_members Where id in (" + uids.join(",") + ")")
			.open()
			.each(function(object){
				u[object("id") + ""] = {
					nick: object("member_nick").value,
					avatar: object("member_avatar").value
				}
			})
			.close();
	}
	
	for ( var i = 0 ; i < keep.length ; i++ ){
		var nick, avatar;
		if ( keep[i].com_member_id > 0 ){
			nick = u[keep[i].com_member_id + ""].nick;
			avatar = u[keep[i].com_member_id + ""].avatar;
		}else{
			nick = keep[i].com_username;
			avatar = blog.AppPlatForm + "/avatar/" + md5.make(keep[i].com_usermail).toLowerCase();
		}
		outs.push({
			nick: nick,
			avatar: avatar,
			id: keep[i].id,
			aid: keep[i].com_article_id,
			content: keep[i].com_content,
			time: keep[i].com_postdate
		});
	}
		
	return {
		setting: setting,
		datas: outs
	};
});

return TopCommentModule;