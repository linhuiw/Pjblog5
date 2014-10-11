<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){
	
	LAYOUT.add("Article", function( id ){
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
	
	LAYOUT.add("getPrevRecord", function(id){
		var rec = new this.dbo.RecordSet(this.conn),
			rets = null,
			that = this;
			
		rec
			.sql("Select top 1 * From blog_articles Where id<" + id + " Order By id DESC")
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					rets = {};
					rets.title = object("art_title").value;
					rets.href = "article.asp?id=" + object("id").value;
				}
			});
		
		rets && this.add("PrevArticle", rets);
	});
	
	LAYOUT.add("getNextRecord", function(id){
		var rec = new this.dbo.RecordSet(this.conn),
			rets = null,
			that = this;
			
		rec
			.sql("Select top 1 * From blog_articles Where id>" + id + " Order By id ASC")
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					rets = {};
					rets.title = object("art_title").value;
					rets.href = "article.asp?id=" + object("id").value;
				}
			});
		
		rets && this.add("NextArticle", rets);
	});
	
	(new LAYOUT()).createServer(function( req ){
		var id = req.query.id,
			page = req.query.page,
			querys = {};
			
		this.add("req", req);
		
		if ( !page || page.length === 0 ){ page = "1"; }; page = Number(page); if ( page < 1 ){ page = 1; };
		if ( !id || id.length === 0 ){ id = "0"; }; id = Number(id);
		
		querys.id = id;
		querys.page = page;
		this.add("gets", querys);
		
		this.navigation();
		this.loadTags();
		
		this.add("errors", require("public/chips/blog.error"));
		
		if ( this.params.error > 0 ){
			this.add("error", this.params.error); this.render("error.asp"); return;
		}
		
		if ( isNaN(id) || isNaN(page) ){
			this.add("error", 10); this.render("error.asp"); return;
		}

		if ( id < 1 ){ this.add("error", 1); this.render("error.asp"); return; };
		if ( !this.Article(id) ){ this.render("error.asp"); return; };
		
		this.getPrevRecord(id);
		this.getNextRecord(id);
		
		this.render("article.asp");
	});
	
})( require("public/library/layout") );
%>