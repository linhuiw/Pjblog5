﻿<div class="iPress-wrap">
	<div class="row">
		<div class="col-lg-12 title">
        	<a href="<%=iPress.setURL('control', 'wrap', { m: 'write' })%>" class="btn btn-info label-link"><i class="fa fa-pencil"></i>写日志</a>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: -1 })%>" class="btn btn-success label-link"><i class="fa fa-pencil"></i>全部日志</a>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: 0 })%>" class="btn btn-danger label-link"><i class="fa fa-pencil"></i>垃圾箱日志</a>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: -2 })%>" class="btn btn-warning label-link"><i class="fa fa-pencil"></i>草稿日志</a>
        </div>
    </div>
	<div class="row iPress-content">
    	<div class="col-sm-2 categorys">
        	<ul>
            	<%
					categorys.queens.forEach(function( cate ){
						var detail = categorys.indexs[cate.id + ''];
				%>
                <li>
                	<a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: detail.id })%>"><i class="fa <%=detail.cate_icon%>"></i><%=detail.cate_name%></a>
                    <%
						if ( cate.items && cate.items.length > 0 ){
					%>
                    <ul>
                    	<%
							cate.items.forEach(function(_id){
								var o = categorys.indexs[_id];
						%>
                        <li><a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: o.id })%>;"><i class="fa <%=o.cate_icon%>"></i><%=o.cate_name%></a></li>
                        <%		
							});
						%>
                    </ul>
                    <%		
						}
					%>
                </li>
                <%		
					});
				%>
            </ul>
        </div>
        <div class="col-sm-10">
        	<div class="row articles">
            <%
				articles.result.forEach(function( detail ){
			%>
            	<div class="col-md-4">
                	<div class="block">1</div>
                </div>
            <%
				});
			%>
            </div>
        </div>
    </div>
</div>