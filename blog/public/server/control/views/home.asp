<div class="iPress-wrap">
<div class="row">
    <div class="col-lg-3 col-sm-6">
        <!-- small box -->
        <div class="small-box bg-aqua">
            <div class="inner">
                <h3>
                    <%=statistics.article%>
                </h3>
                <p>
                    	文章总数
                </p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'article'})%>" class="small-box-footer">
            <i class="fa fa-arrow-circle-right"></i>
            </a>
        </div>
    </div>
    <div class="col-lg-3 col-sm-6">
        <!-- small box -->
        <div class="small-box bg-yellow">
            <div class="inner">
                <h3>
                    <%=statistics.user%>
                </h3>
                <p>
                    	粉丝数
                </p>
            </div>
            <div class="icon">
                <i class="ion ion-person-add"></i>
            </div>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'user' })%>" class="small-box-footer">
             <i class="fa fa-arrow-circle-right"></i>
            </a>
        </div>
    </div>
    <div class="col-lg-3 col-sm-6">
        <!-- small box -->
        <div class="small-box bg-red">
            <div class="inner">
                <h3>
                    <%=statistics.plugin%>
                </h3>
                <p>
                    	插件数
                </p>
            </div>
            <div class="icon">
                <i class="fa fa-windows"></i>
            </div>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'plugin', p: 'local' })%>" class="small-box-footer">
             <i class="fa fa-arrow-circle-right"></i>
            </a>
        </div>
    </div>
    <div class="col-lg-3 col-sm-6">
    	<div class="small-box bg-green">
            <div class="inner">
                <h3>
                    <%=statistics.theme%>
                </h3>
                <p>
                    	主题数
                </p>
            </div>
            <div class="icon">
                <i class="fa fa-html5"></i>
            </div>
            <a href="<%=iPress.setURL('control', 'wrap', { m: 'theme', p: 'local' })%>" class="small-box-footer">
             <i class="fa fa-arrow-circle-right"></i>
            </a>
        </div>
    </div>
</div>

<!--data-placement="bottom" data-toggle="tooltip" data-original-title="前往云平台"-->
<div class="row">
	<div class="col-md-4">
		<div class="row">
			<div class="col-lg-12">
				<div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>云端更新</h5>
                        <div class="ibox-tools">
                            <a class="close-link" href="<%=blog.appsite + '/download'%>" target="_blank"> <i class="fa fa-vimeo-square"></i> </a>
                        </div>
                    </div>
                    <div class="ibox-content" id="versions"></div>
                </div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-lg-12">
				<div class="ibox float-e-margins box">
                    <div class="ibox-title">
                        <h5>组件支持</h5>
                        <div class="ibox-tools">
                            <a class="close-link" href="<%=blog.appsite + '/download'%>" target="_blank"> <i class="fa fa-location-arrow"></i> </a>
                        </div>
                    </div>
                    <div class="ibox-content box-body">
						<ul class="todo-list">
							<%
								;(function(){
									for ( var i in iis ){
							%>
							<li>                                         
                                
                                <%
                                	if ( iis[i] ){
                                %>
                                <small class="label label-info"><i class="fa fa-check"></i></small>
                                <%
                                	}else{
                                %>
                                <small class="label label-danger"><i class="fa fa-close"></i></small>
                                <%
                                	}
                                %>
                                <span class="text"><%=i.toUpperCase()%></span>
                            </li>
							<%
									}
								})();
							%>
                        </ul>
                    </div>
                </div>
			</div>
		</div>
		
	</div>
	<div class="col-md-8">
		2
	</div>
</div>
</div>