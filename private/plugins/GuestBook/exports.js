var GuestBookModule = new Class({
	initialize: function( configs ){
		if ( !configs ){
			configs = {};
		}
		this.configs = configs;
	}
});

GuestBookModule.extend('getList', function( perpage, page ){
	var rec = new this.dbo.RecordSet(this.conn),
		keep = [],
		ids = [],
		uids = {},
		outs = [],
		pages,
		md5 = require("md5"),
		date = require("date");
		
	var ac = rec.DualTopPage(
		"blog_messages", 
		"*", 
		false, 
		"msg_postdate DESC", 
		"msg_postdate ASC", 
		this.configs.perpage, 
		this.configs.page, 
		function( object ){
			keep.push({
				id: object("id").value,
				msg_member_id: object("msg_member_id").value,
				msg_content: object("msg_content").value,
				msg_postdate: date.format(new Date(object("msg_postdate").value), "y-m-d h:i:s"),
				msg_reply: object("msg_reply").value,
				msg_username: object("msg_username").value || "",
				msg_usermail: object("msg_usermail").value || ""
			});
			ids.push(object("msg_member_id").value);
		});
		
	pages = rec.BuildPage(ac.pageindex, ac.pageCount);
		
	if ( ids.length > 0 ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql("Select * From blog_members Where id in (" + ids.join(",") + ")")
			.open(1)
			.each(function(object){
				uids[object("id") + ""] = {
					nick: object("member_nick").value,
					avatar: object("member_avatar").value
				}
			})
			.close();
	}
	
	for ( var i = 0 ; i < keep.length ; i++ ){
		var nick, avatar;
		if ( keep[i].msg_member_id > 0 ){
			nick = uids[keep[i].msg_member_id + ""].nick;
			avatar = uids[keep[i].msg_member_id + ""].avatar;
		}else{
			nick = keep[i].msg_username;
			avatar = blog.AppPlatForm + "/avatar/" + md5.make(keep[i].msg_usermail).toLowerCase();
		}
		outs.push({
			nick: nick,
			avatar: avatar,
			id: keep[i].id,
			uid: keep[i].msg_member_id,
			content: keep[i].msg_content,
			time: keep[i].msg_postdate,
			reply: keep[i].msg_reply
		});
	}
	
	return {
		data: outs,
		pages: pages
	}
});

GuestBookModule.extend('getPluginCache', function(mark){
	var cachefile = require('private/chips/' + blog.cache + 'blog.uri.plugins'),
		outs = {};
	
	try{
		outs = cachefile.queens[mark];
	}catch(e){};
	
	return outs;
});

GuestBookModule.extend('getSettingValue', function(){
	var plugins = require("public/library/plugin");
		plugins.extend("dbo", this.dbo);
		plugins.extend("conn", this.conn);
	var plugin = new plugins(),
		setting = plugin.getSettingParams(this.getPluginCache(this.configs.mark).id);
		
	return setting;
});

GuestBookModule.extend('getSideValue', function(){
	var setting = this.getSettingValue();
	var rec = new this.dbo.RecordSet(this.conn);
	var date = require('date'), md5 = require('md5');
	var keep = [], ids = [], uids = {}, outs = [];
	
	rec
		.sql('Select top ' + setting.tops + ' * From blog_messages Order By msg_postdate DESC')
		.open()
		.each(function( object ){
			keep.push({
				id: object("id").value,
				msg_member_id: object("msg_member_id").value,
				msg_content: object("msg_content").value,
				msg_postdate: date.format(new Date(object("msg_postdate").value), "y-m-d h:i:s"),
				msg_username: object("msg_username").value || "",
				msg_usermail: object("msg_usermail").value || ""
			});
			ids.push(object("msg_member_id").value);
		})
		.close();
		
	if ( ids.length > 0 ){
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql("Select * From blog_members Where id in (" + ids.join(",") + ")")
			.open(1)
			.each(function(object){
				uids[object("id") + ""] = {
					nick: object("member_nick").value,
					avatar: object("member_avatar").value
				}
			})
			.close();
	}
	
	for ( var i = 0 ; i < keep.length ; i++ ){
		var nick, avatar;
		if ( keep[i].msg_member_id > 0 ){
			nick = uids[keep[i].msg_member_id + ""].nick;
			avatar = uids[keep[i].msg_member_id + ""].avatar;
		}else{
			nick = keep[i].msg_username;
			avatar = blog.AppPlatForm + "/avatar/" + md5.make(keep[i].msg_usermail).toLowerCase();
		}
		outs.push({
			nick: nick,
			avatar: avatar,
			id: keep[i].id,
			uid: keep[i].msg_member_id,
			content: keep[i].msg_content,
			time: keep[i].msg_postdate
		});
	}
		
	return {
		setting: setting,
		datas: outs
	};
});

return GuestBookModule;