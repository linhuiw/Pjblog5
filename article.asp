<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){
	
	LAYOUT.extend("Article", function( id ){
		var rec = new this.dbo.RecordSet(this.conn),
			params = {},
			that = this,
			error = true;
			
		rec
			.sql("Select * From blog_articles Where art_draft=0 And id=" + id)
			.process(function( object ){
				if ( !object.Bof && !object.Eof ){
					var categorys = that.getCategory(object("art_category").value);
					params.art_title = object("art_title").value;
					params.art_categoryName = categorys.cate_name;
					params.art_categoryHref =  blog.web + "/default.asp?cate=" + categorys.id;
					params.art_content = object("art_content").value;
					params.art_tags =  that.getTags(object("art_tags").value);
					params.art_tname = object("art_tname").value;
					params.art_postdate = new Date(object("art_postdate").value).getTime();
					params.art_modifydate = new Date(object("art_modifydate").value).getTime();
					params.art_comment_count = object("art_comment_count").value;
					params.art_tdes = object("art_tdes").value;
					params.id = id;
					that.add("article", params);
				}else{
					error = false;
					that.add("error", 2);
				}
			});

		return error;
	});
	
	LAYOUT.extend("Comments", function(id, page){
		var perpage = this.params.global.blog_comment_perpage;
		var rec = new this.dbo.RecordSet(this.conn);
		var md5 = require("md5");
		
		var params = {}, ids = [], uids = [], items = [], users = {}, outs = [];
		
		var ac = rec.DualTopPage("blog_comments", "*", "com_article_id=" + id + " And com_parent=0", "com_postdate DESC", "com_postdate ASC", perpage, page, function( object ){
			ids.push(object("id").value);
			if ( object("com_member_id").value > 0 && uids.indexOf(object("com_member_id").value) === -1 ) { 
				uids.push( object("com_member_id").value ); 
			};
			
			params[object("id").value + ""] = {
				id: object("id").value,
				com_article_id: object("com_article_id").value,
				com_member_id: object("com_member_id").value,
				com_content: object("com_content").value,
				com_parent: 0,
				com_postdate: new Date(object("com_postdate").value).getTime(),
				com_username: object("com_username").value,
				com_usermail: object("com_usermail").value,
				com_user: {},
				items: []
			};
		});
		
		this.add("pages", rec.BuildPage(ac.pageindex, ac.pageCount));
		
		if ( ids.length > 0 ){
			rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql("Select * From blog_comments Where com_parent in (" + ids.join(",") + ")")
				.open()
				.each(function(object){
					if ( object("com_member_id").value > 0 && uids.indexOf(object("com_member_id").value) === -1 ) { 
						uids.push( object("com_member_id").value ); 
					};
					
					items.push({
						id: object("id").value,
						com_article_id: object("com_article_id").value,
						com_member_id: object("com_member_id").value,
						com_content: object("com_content").value,
						com_parent: object("com_parent").value,
						com_postdate: new Date(object("com_postdate").value).getTime(),
						com_username: object("com_username").value,
						com_usermail: object("com_usermail").value,
						com_user: {}
					});
				})
				.close();
		}
		
		if ( uids.length > 0 ){	
			rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql("Select * From blog_members Where id in (" + uids.join(",") + ")")
				.open()
				.each(function(object){
					users[object("id").value + ""] = {
						id: object("id").value,
						nick: object("member_nick").value,
						mail: object("member_mail").value,
						birthday: new Date(object("member_birthday").value || 0).getTime(),
						address: object("member_address").value,
						website: object("member_website").value,
						sex: object("member_sex").value,
						avatar: object("member_avatar").value,
						token: object("member_token").value,
						openid: object("member_openid").value
					}
				})
				.close();
		}
			
		for ( var i = 0 ; i < items.length ; i++ ){
			var parents = items[i].com_parent;
			var uid = items[i].com_member_id;
			if ( uid > 0 && users[uid + ""] ){
				items[i].com_user = users[uid + ""];
			}else{
				items[i].com_user.nick = items[i].com_username;
				items[i].com_user.mail = items[i].com_usermail;
				items[i].com_user.avatar = blog.AppPlatForm + "/avatars/" + md5.make(items[i].com_usermail) + ".jpg";
				items[i].com_user.id = 0;
			}
			params[parents + ""].items.push(items[i]);
		};
		
		for ( var j in params ){
			var uid = params[j].com_member_id;
			if ( uid > 0 && users[uid + ""] ){
				params[j].com_user = users[uid + ""];
			}else{
				params[j].com_user.nick = params[j].com_username;
				params[j].com_user.mail = params[j].com_usermail;
				params[j].com_user.avatar = blog.AppPlatForm + "/avatars/" + md5.make(params[j].com_usermail) + ".jpg";
				params[j].com_user.id = 0;
			}
			outs.push(params[j]);
		}
		
		outs = outs.sort(function(a, b){
			return b.com_postdate - a.com_postdate;
		});
		
		this.add("comments", outs);
	});
	
	(new LAYOUT()).createServer(function( req ){
		var id = req.query.id,
			page = req.query.page,
			querys = {};
		
		if ( !page || page.length === 0 ){ page = "1"; }; page = Number(page); if ( page < 1 ){ page = 1; };
		if ( !id || id.length === 0 ){ id = "0"; }; id = Number(id);
		
		
		querys.id = id;
		querys.page = page;
		this.add("gets", querys);
		
		this.navigation();
		this.loadTags();

		this.add("errors", require("public/chips/blog.error"));
		
		if ( id < 1 ){ this.add("error", 1); this.render("error.asp"); return; };
		if ( !this.Article(id) ){ this.render("error.asp"); return; };
		
		this.Comments(id, page);
		
		this.render("article.asp");
	});
	
})( require("public/library/layout") );
%>