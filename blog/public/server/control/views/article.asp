<div class="iPress-wrap">
	<div class="row">
		<div class="col-lg-12 title">
        	<a href="<%=iPress.setURL('control', 'wrap', { m: 'write' })%>" class="btn btn-info label-link"><i class="fa fa-pencil"></i>发表日志</a>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: 'all' })%>" class="btn btn-success label-link"><i class="fa fa-pencil"></i>全部日志</a>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: 0 })%>" class="btn btn-danger label-link"><i class="fa fa-pencil"></i>回收日志</a>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: 'draft' })%>" class="btn btn-warning label-link"><i class="fa fa-pencil"></i>草稿日志</a>
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
                	<div class="block">
                    	<div class="img">
                        	<a href="<%=iPress.setURL('page', 'article', { id: detail.id })%>" target="_blank">
                        	<img src="<%=detail.art_cover%>" onerror="this.src='public/assets/bootstrap/img/article_preview.png'" class="img-responsive trans" />
                            </a>
                            <div class="ArtTitle text-auto-hide trans"><%=detail.art_title%></div>
                       	</div>
                        <div class="ArtDes"><%=detail.art_des%></div>
                        <div class="ArtAction row">
                        	<a href="javascript:;" class="col-xs-6 trans"><i class="fa fa-pencil"></i></a>
                            <a href="javascript:;" class="col-xs-6 trans"><i class="fa fa-close"></i></a>
                        </div>
                    </div>
                </div>
            <%
				});
			%>
            </div>
            <%
				if ( pages.arrays.length > 1 ){
			%>
            <nav>
              <ul class="pagination">
              	<li class="<%=pages.value.index === pages.value.prev ? "disabled": ""%>">
                    <a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: pages.c, s: pages.value.prev })%>">
                        <i class="fa fa-angle-left"></i>
                    </a>
              	</li>
              <%
			  		pages.arrays.forEach(function( o ){
						if ( pages.value.index === o ){
			%>
            		<li class="disabled"><a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: pages.c, s: pages.s })%>"><%=o%></a></li>
            <%		
						}else{
			%>
            		<li><a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: pages.c, s: pages.s })%>"><%=o%></a></li>
            <%			
						}
					});
			%>
            	<li class="<%=pages.value.index === pages.value.next ? "disabled": ""%>">
                	<a href="<%=iPress.setURL('control', 'wrap', { m: 'article', c: pages.c, s: pages.value.next })%>">
                   		<i class="fa fa-angle-right"></i>
                    </a>
                </li>
              </ul>
            </nav>
            <%	
				}
			%>
        </div>
    </div>
</div>