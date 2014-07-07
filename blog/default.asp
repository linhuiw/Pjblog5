<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){
	LAYOUT.extend("Articles", function( conditions, page ){
		var rec = new this.dbo.RecordSet(this.conn),
			params = [],
			that = this;
			
		rec.DualTopPage("blog_articles", "*", conditions.join(" AND "), "art_postdate DESC", "art_postdate ASC", this.params.global.blog_articlepage, page, function( object ){
			var categorys = that.getCategory(object("art_category").value);
			params.push({
				id: object("id").value,
				title: object("art_title").value,
				des: object("art_des").value,
				category: categorys.cate_name,
				catehref: blog.web + "/default.asp?cate=" + categorys.id,
				tags: that.getTags(object("art_tags").value),
				tname: object("art_tname").value,
				posttime: new Date(object("art_postdate").value).getTime(),
				comments: object("art_comment_count").value,
				cover: blog.web + "/" + object("art_cover").value
			});
		});
		
		this.add("articles", params);
	});
	
	LAYOUT.extend("categorys", function( id, page ){
		var conditions = ["art_draft=0"];
		if ( id > 0 ){ conditions.push("art_category=" + id); };	
		this.Articles(conditions, page);
	});
	
	LAYOUT.extend("tags", function( id, page ){
		var conditions = ["art_draft=0"];	
		if ( id > 0 ){ conditions.push("art_tags like '%{" + id + "}%'"); };	
		this.Articles(conditions, page);
	});
	
	(new LAYOUT()).createServer(function( req ){
		var cate = req.query.cate,
			page = req.query.page,
			tag = req.query.tag;
		
		if ( !page || page.length === 0 ){ page = "1"; };
		page = Number(page);
		if ( page < 1 ){ page = 1; };
		if ( !cate || cate.length === 0 ){ cate = "0"; };
		cate = Number(cate);
		if ( !tag || tag.length === 0 ){ tag = "0"; };
		tag = Number(tag);
		
		this.navigation();
		this.loadTags();

		if ( tag > 0 ){ this.tags( tag, page ); }
		else{ this.categorys( cate, page ); };
		
		this.render("default.asp");
	});
})( require("public/library/layout") );
%>