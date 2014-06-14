<%
;(function( dbo, conn, fs, fns, http, m, t ){
	var page = http.query("cate"),
		cate = http.query("cate"),
		category = require("public/services/category"),
		categoryModule,
		categorys,
		categoryList,
		rec;
	
	if ( !page || page.length === 0 ){ page = 1; };
	page = Number(page);
	if ( page < 1 ){ page = 1; };
	
	if ( !cate || cate.length === 0 ){ cate = 0; };
	cate = Number(cate);
	
	category = new category();
	category.dbo = dbo;
	category.conn = conn;
	categoryModule = category.list();
	categorys = categoryModule.k;
	categoryList = categoryModule.s;
	LoadJscript(function(arrays){ 
		window.page = arrays[0];
		window.cate = arrays[1]; 
		window.categorys = arrays[2];
	}, [page, cate, categorys]);
%>
<div id="articles" class="clearfix">
	<div class="list fleft">
    	<div class="list-container">
        	<div class="list-top">
                <i class="fa fa-slack"></i> 分类 : <span id="cates"><%=cate === 0 ? "全部分类日志(0)" : categorys[cate + ""] + "(" + cate + ")"%></span>
            </div>
            <div class="list-content">
            	<ul class="waterfull" id="waterfull"></ul>
            </div>
        </div>
    </div>
    <div class="tool">
    	<div class="pannel">
        	<h6><i class="fa fa-pinterest-square"></i> 发表日志</h6>
            <button><i class="fa fa-sign-in"></i> 快速发表日志</button>
            <button><i class="fa fa-pencil"></i> 发表日志（高级模式）</button>
        </div>
        <div class="pannel">
        	<h6><i class="fa fa-tags"></i> 日志分类</h6>
            <ul class="root clearfix">
            	<%
					;(function(categoryList){
						for ( var i in categoryList ){
				%>
                <li class="root">
                	<a href="javascript:;" class="root setCate" app-cate="<%=i%>"><%=categoryList[i].name%></a>
                    <ul class="child clearfix">
                    <%
						for ( var j in categoryList[i].items ){
					%>
                    	<li><a href="javascript:;" class="child setCate" app-cate="<%=j%>"><%=categoryList[i].items[j]%></a></li>
                    <%	
						}
					%>
                    </ul>
                </li>
                <%		
						}
					})(categoryList);
				%>
            </ul>
        </div>
    </div>
</div>
<%
})( dbo, conn, fs, fns, http, m, t );
%>