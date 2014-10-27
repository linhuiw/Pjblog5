<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){
	
	function checkRequests(){
		if ( !this.NameSpace.reqs.query.id || this.NameSpace.reqs.query.id.length === 0 ){ 
			this.NameSpace.reqs.query.id = "0"; 
		}; 
		this.NameSpace.reqs.query.id = Number(this.NameSpace.reqs.query.id); 
		if ( this.NameSpace.reqs.query.id < 1 ){
			this.error = 20004;
		};
	}
	
	function getArticle(){
		var rec = new this.NameSpace.coms.dbo.RecordSet(this.NameSpace.coms.conn),
			params = {},
			that = this;
			
		rec
			.sql("Select * From blog_articles Where art_draft=0 And id=" + this.NameSpace.reqs.query.id)
			.process(function( object ){
				if ( !object.Bof && !object.Eof ){
					var categorys = that.getCategoryItem(object("art_category").value);
					params.art_title = object("art_title").value;
					params.art_categoryName = categorys.cate_name;
					params.art_categoryIcon = categorys.cate_icon;
					params.art_categoryHref =  blog.web + "/default.asp?cate=" + categorys.id;
					params.art_content = object("art_content").value;
					params.art_tags =  that.getTagsByArray(object("art_tags").value);
					params.art_postdate = new Date(object("art_postdate").value).getTime();
					params.art_modifydate = new Date(object("art_modifydate").value).getTime();
					params.art_comment_count = object("art_comment_count").value;
					params.id = that.NameSpace.reqs.query.id;
					that.NameSpace.data.article = params;
				}else{
					that.error = 20004;
				}
			});
	};
	
	function getPrevArticle(){
		var rec = new this.NameSpace.coms.dbo.RecordSet(this.NameSpace.coms.conn),
			rets = null,
			that = this;
			
		rec
			.sql("Select top 1 * From blog_articles Where id<" + this.NameSpace.reqs.query.id + " Order By id DESC")
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					rets = {};
					rets.title = object("art_title").value;
					rets.href = "article.asp?id=" + object("id").value;
				}
			});
		
		this.NameSpace.data.PrevArticle = rets;
	}
	
	function getNextArticle(){
		var rec = new this.NameSpace.coms.dbo.RecordSet(this.NameSpace.coms.conn),
			rets = null,
			that = this;
			
		rec
			.sql("Select top 1 * From blog_articles Where id>" + this.NameSpace.reqs.query.id + " Order By id ASC")
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					rets = {};
					rets.title = object("art_title").value;
					rets.href = "article.asp?id=" + object("id").value;
				}
			});
		
		this.NameSpace.data.NextArticle = rets;
	}
	
	(new LAYOUT())
		.createServer()
		.reject(function(){ this.errorender("error.asp"); })
		.then(checkRequests)
		.then(getArticle)
		.then(getPrevArticle)
		.then(getNextArticle)
		.render("article.asp");
	
})( require("public/library/layout") );
%>