<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){
	
	function checkRequests(){
		if ( !this.NameSpace.reqs.query.page || this.NameSpace.reqs.query.page.length === 0 ){ 
			this.NameSpace.reqs.query.page = "1"; 
		}; 
		this.NameSpace.reqs.query.page = Number(this.NameSpace.reqs.query.page); 
		if ( this.NameSpace.reqs.query.page < 1 ){ this.NameSpace.reqs.query.page = 1; };
		if ( !this.NameSpace.reqs.query.cate || this.NameSpace.reqs.query.cate.length === 0 ){ 
			this.NameSpace.reqs.query.cate = "-1"; 
		}; 
		this.NameSpace.reqs.query.cate = Number(this.NameSpace.reqs.query.cate);
		if ( !this.NameSpace.reqs.query.tag || this.NameSpace.reqs.query.tag.length === 0 ){ 
			this.NameSpace.reqs.query.tag = "0"; 
		}; 
		this.NameSpace.reqs.query.tag = Number(this.NameSpace.reqs.query.tag);
		if ( isNaN(this.NameSpace.reqs.query.cate) || isNaN(this.NameSpace.reqs.query.tag) ){
			this.error = 20002;
		};
	}
	
	function CheckArticles(){
		this.NameSpace.data.actives = {};
		if ( this.NameSpace.reqs.query.tag > 0 ){
			this.Articles(["art_draft=0", "art_tags like '%{" + this.NameSpace.reqs.query.tag + "}%'"], this.NameSpace.reqs.query.page); 
			this.NameSpace.data.actives.tag = this.getTagByID(this.NameSpace.reqs.query.tag);
			this.NameSpace.data.actives.url = blog.web + "default.asp?tag=" + this.NameSpace.reqs.query.tag;
		}
		else{ 
			var conditions = ["art_draft=0"];
			var id = this.NameSpace.reqs.query.cate;
			this.NameSpace.data.actives.url = blog.web + "/default.asp?cate=" + id;
			if ( this.NameSpace.reqs.query.cate > 0 ){
				if ( 
					this.NameSpace.data.categories.indexs[id + ""] && 
					this.NameSpace.data.categories.indexs[id + ""].cate_parent > 0 && 
					!this.NameSpace.data.categories.indexs[id + ""].cate_outlink 
				){
					conditions.push("art_category=" + id); 
					this.NameSpace.data.actives["category"] = this.NameSpace.data.categories.indexs[id + ""];
				}else{
					var c = [ id ];
					for ( var i in this.NameSpace.data.categories.indexs ){
						if ( 
							this.NameSpace.data.categories.indexs[i].cate_parent === id &&
							!this.NameSpace.data.categories.indexs[i].cate_outlink
						){
							c.push(Number(i));
						}
					}
					if ( c.length > 0 ){
						conditions.push("art_category in (" + c.join(",") + ")");
					};
					this.NameSpace.data.actives["category"] = this.NameSpace.data.categories.indexs[id + ""];
				};
			}
			else if ( this.NameSpace.reqs.query.cate === 0 ){
				conditions.push("art_category=0");
				this.NameSpace.data.actives["category"] = {
					cate_count: 0,
					cate_des: "这里列举出了所有未被分类的日志。",
					cate_icon: "fa-home",
					cate_name: "未分类日志",
					cate_outlink: false,
					cate_parent: 0,
					cate_src: "",
					id: 0
				} 
			}
			else if ( this.NameSpace.reqs.query.cate === -1 ){
				conditions.push("art_category>0"); 
				this.NameSpace.data.actives["category"] = {
					cate_count: 0,
					cate_des: "这里列举出了所有被分类的日志，不包括未分类的和草稿日志。",
					cate_icon: "fa-home",
					cate_name: "所有日志",
					cate_outlink: false,
					cate_parent: 0,
					cate_src: "",
					id: -1
				} 
			}
			else if ( this.NameSpace.reqs.query.cate === -2 ){
				if ( this.checkStatus("ControlSystem") ){
					conditions[0] = "art_draft=1";
					this.NameSpace.data.actives["category"] = {
						cate_count: 0,
						cate_des: "这里列举出了所有草稿日志，但是需要后台管理员权限才能看到。",
						cate_icon: "fa-home",
						cate_name: "草稿日志",
						cate_outlink: false,
						cate_parent: 0,
						cate_src: "",
						id: -2
					} 
				}
			}
			else{
				this.error === 20003;
			}
			this.Articles(conditions, this.NameSpace.reqs.query.page); 
		};
	}
	
	LAYOUT.add("Articles", function( conditions, page ){
		var rec = new this.NameSpace.coms.dbo.RecordSet(this.NameSpace.coms.conn),
			params = [],
			that = this;
			
		var DualPages = rec.DualTopPage(
			"blog_articles", 
			"*", 
			conditions.join(" AND "), 
			"art_postdate DESC", 
			"art_postdate ASC", 
			this.NameSpace.data.global.blog_articlepage, 
			page, 
		function( object ){
			var categorys = that.getCategoryItem(object("art_category").value);
			params.push({
				id: object("id").value,
				title: object("art_title").value,
				des: object("art_des").value,
				category: categorys.cate_name,
				categoryicon: categorys.cate_icon,
				catehref: blog.web + "/default.asp?cate=" + categorys.id,
				tags: that.getTagsByArray(object("art_tags").value),
				posttime: new Date(object("art_postdate").value).getTime(),
				comments: object("art_comment_count").value,
				cover: object("art_cover").value
			});
		});
		
		this.NameSpace.data.articles = params;
		this.NameSpace.data.pages = rec.BuildPage(DualPages.pageindex, DualPages.pageCount);
	});

	(new LAYOUT())
		.createServer()
		.reject(function(){ this.errorender("error.asp"); })
		.then(checkRequests)
		.then(CheckArticles)
		.render("default.asp")
		.destroy();
	
})( require("public/library/layout") );
%>