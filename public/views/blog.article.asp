<%
;(function( dbo, conn, fs, fns, http, m){
	
	var configs = {
		category: {
			all: { value: -1, name: "所有日志", icon: "fa-bug" },
			draft: { value: -2, name: "草稿箱日志", icon: "fa-bug"  },
			lost: { value: 0, name: "未分类日志", icon: "fa-bug"  }
		}
	}

	// 获取需要的参数
	var reqs = {
		category: Number(http.query("cate") || configs.category.all.value),
		page: Number(http.query("page") || 1)
	};
	if ( reqs.page < 1 ){
		reqs.page = 1;
	};
	
	// 获取模块
	var categoryModule = require("public/services/category");
		categoryModule.add("dbo", dbo);
		categoryModule.add("conn", conn);
		
	var category = new categoryModule();
	
	// 处理数据
	var categorys = category.list();
	var categoryIndexs = categorys.k;
	var categoryQueens = categorys.s;
	
	var rec = new dbo.RecordSet(conn),
		params = [],
		condition,
		checks = true,
		ac, pages;
		
	if ( reqs.category === configs.category.all.value ){
		condition = "art_draft=0";
	}
	else if ( reqs.category === configs.category.draft.value ) {
		condition = "art_draft=1";
	}
	else if ( reqs.category === configs.category.lost.value ){
		condition = "art_category=0 And art_draft=0";
	}else if ( reqs.category > 0 ) {
		condition = "art_category=" + reqs.category;
	}else{
		checks = false;
	}
	
	if ( checks ){		
		ac = rec.DualTopPage("blog_articles", "*", condition, "art_postdate DESC", "art_postdate ASC", 5, reqs.page, function( object ){
			params.push({
				id: object("id").value,
				title: object("art_title").value,
				des: object("art_des").value,
				category: categoryIndexs[object("art_category").value + ""],
				posttime: new Date(object("art_postdate").value).getTime(),
				cover: object("art_cover").value
			});
		});
		pages = rec.BuildPage(ac.pageindex, ac.pageCount);
	}
	
	
	// 以下为输出处理	
	function ResponseCategorys(){
%>
<ul>
	<li><a href="?m=<%=m%>&cate=<%=configs.category.all.value%>&page=<%=reqs.page%>" class="wordCut <%=reqs.category === configs.category.all.value ? "active" : ""%>"><i class="fa <%=configs.category.all.icon%>"></i><%=configs.category.all.name%></a></li>
    <li><a href="?m=<%=m%>&cate=<%=configs.category.draft.value%>&page=<%=reqs.page%>" class="wordCut <%=reqs.category === configs.category.draft.value ? "active" : ""%>"><i class="fa <%=configs.category.draft.icon%>"></i><%=configs.category.draft.name%></a></li>
    <li><a href="?m=<%=m%>&cate=<%=configs.category.lost.value%>&page=<%=reqs.page%>" class="wordCut <%=reqs.category === configs.category.lost.value ? "active" : ""%>"><i class="fa <%=configs.category.lost.icon%>"></i><%=configs.category.lost.name%></a></li>
<%
		for ( var i in categoryQueens ){
%>
	<li>
    	<a href="?m=<%=m%>&cate=<%=i%>&page=<%=reqs.page%>" class="wordCut <%=reqs.category === Number(i) ? "active" : ""%>"><i class="fa <%=categoryQueens[i].icon%>"></i><%=categoryQueens[i].name%></a>
        <%
			if ( categoryQueens[i].items ){
		%>
        <ul>
        <%
				for ( var j in categoryQueens[i].items ){
		%>
        	<li><a href="?m=<%=m%>&cate=<%=j%>&page=<%=reqs.page%>" class="wordCut <%=reqs.category === Number(j) ? "active" : ""%>"><i class="fa <%=categoryQueens[i].items[j].icon%>"></i><%=categoryQueens[i].items[j].name%></a></li>
        <%		
				}
		%>
        </ul>
        <%	
			}
		%>
    </li>
<%		
		}	
%>
</ul>
<%
	};
	
	function ResponseArticle(){
		if ( params.length > 0 ){
			for ( var i = 0 ; i < params.length ; i++ ){
%>
<div class="art-detail">
	<h6><a href="article.asp?id=<%=params[i].id%>"><%=params[i].title%></a></h6>
    <div class="art-msg clearfix">
    	<div class="img"><a href="article.asp?id=<%=params[i].id%>"><img src="<%=params[i].cover%>" onerror="this.src='public/assets/img/bj.jpg'"></a></div>
        <div class="info">
			<div class="des"><%=params[i].des%></div>
            <div class="action">
            	<a href="?m=modifyarticle&id=<%=params[i].id%>"><i class="fa fa-edit"></i>编辑</a>
                <a href="javascript:;" class="AutoSendAjax deletearticle" app-m="article" app-p="DelArticle" app-c="确定删除这个日志吗？" app-id="<%=params[i].id%>"><i class="fa fa-trash-o"></i>删除</a>
            </div>
        </div>
    </div>
</div>
<%				
			}
		}else{
%>
<div class="art-none"><i class="fa fa-exclamation-circle"></i>抱歉，没有找到数据！</div>
<%
		}
	};
	
	function ResponsePages(){
		if ( pages && pages.to > 1 ){
%>
<div class="pages">
	<%
		for ( var i = pages.from ; i <= pages.to ; i++ ){
			if ( i === pages.current ){
	%>
    <span><%=i%></span>
    <%			
			}else{
	%>
    <a href="?m=<%=m%>&cate=<%=reqs.category%>&page=<%=i%>"><%=i%></a>
    <%			
			};		
		};
	%>
</div>
<%		
		}
	}
%>
<div id="artlist">
	<div class="art-side">
    	<a href="?m=modifyarticle" class="write"><i class="fa fa-plus"></i>写日志</a>
        <div class="art-cate-zone">
        <%ResponseCategorys();%>
        </div>
    </div>
    <div class="art-wrap">
    	<div class="art-zone">
    	<%ResponseArticle();ResponsePages();%>
    	</div>
    </div>
</div>
<%
})( dbo, conn, fs, fns, http, m);
%>