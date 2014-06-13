<%
;(function( dbo, conn, fs, fns, http ){
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
	/*{"2":{"name":"生活","items":{"4":"在路上"}},"3":{"name":"技术","items":{"16":"Javscript","17":"jscript"}}}*/
%>
<div id="articles" class="clearfix">
	<div class="list fleft">
    	<div class="list-container">
        	<div class="list-top">
            	<i class="fa fa-send-o"></i> 当前页 : <span><%=page%></span> 
                <i class="fa fa-slack"></i> 分类 : <span><%=cate === 0 ? "全部分类日志(0)" : categorys[cate + ''] + "(" + cate + ")"%></span>
            </div>
            <div class="list-content">
            	<ul class="waterfull">
                	<li>111</li>
                    <li>111</li>
                    <li>111</li>
                    <li>111</li>
                    <li>111</li>
                    <li>111</li>
                    <li>111</li>
                    <li>111</li>
                    <li>111</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="tool">2</div>
</div>
<%
})( dbo, conn, fs, fns, http );
%>