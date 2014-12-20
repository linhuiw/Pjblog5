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
                    <div class="ibox-content" id="versions"><i class="fa fa-spin fa-spinner" style="margin-right:5px;"></i>正在获取最新版本信息，请稍后！</div>
                </div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-lg-12">
				<div class="ibox float-e-margins box">
                    <div class="ibox-title">
                        <h5>组件支持</h5>
                        <div class="ibox-tools">
                            <a class="close-link" href="<%=blog.appsite + '/download'%>" target="_blank"> <i class="fa fa-chevron-circle-right"></i> </a>
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
        
        <div class="row">
            <div class="col-sm-12">
            	<div class="ibox float-e-margins box">
                    <div class="ibox-title">
                        <h5>官方信息</h5>
                        <div class="ibox-tools">
                            <a class="close-link" href="<%=blog.appsite + '/articles'%>" target="_blank"> <i class="fa fa-chevron-circle-right"></i> </a>
                        </div>
                    </div>
                    <div class="ibox-content box-body" id="blog-news"></div>
                </div>
            </div>
            
            <div class="col-sm-12">
            	<div class="ibox float-e-margins box">
                    <div class="ibox-title">
                        <h5>程序开发与版权归属</h5>
                    </div>
                    <div class="ibox-content box-body" id="blog-author">
                    	<div class="detail-body-A2 copys">
                        	<h5>程序主创：</h5>
                            <p><a href="http://webkits.cn" target="_blank">沈赟杰</a></p>
                         	<h5>开发团队：</h5>
                            <p><a href="http://xybk.net" target="_blank">小影</a><a href="http://54bq.com" target="_blank">双木杉子</a></p>
                            <h5>版权所有：</h5>
                            <p><i class="fa fa-copyright"></i> 2004-2015 版权归<a href="http://www.pjhome.net" target="_blank">陈子舜</a><a href="http://webkits.cn" target="_blank">沈赟杰</a>所有，任何组织和个人不得用于个人商业盈利用途，主题或者插件除外，否则一切后果由该组织或个人承担！本程序团队组织不承担任何法律及连带责任。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		
	</div>
	<div class="col-md-8">
    	<div class="row">
        	<div class="col-sm-12">
            	<div class="ibox float-e-margins box">
                    <div class="ibox-title">
                        <h5>最新主题</h5>
                        <div class="ibox-tools">
                            <a class="close-link" href="<%=blog.appsite + '/themes'%>" target="_blank"> <i class="fa fa-chevron-circle-right"></i> </a>
                        </div>
                    </div>
                    <div class="ibox-content box-body" id="theme-box"></div>
                </div>
            </div>
        </div>
        <div class="row">
        	<div class="col-sm-12">
            	<div class="ibox float-e-margins box">
                    <div class="ibox-title">
                        <h5>最新插件</h5>
                        <div class="ibox-tools">
                            <a class="close-link" href="<%=blog.appsite + '/plugins'%>" target="_blank"> <i class="fa fa-chevron-circle-right"></i> </a>
                        </div>
                    </div>
                    <div class="ibox-content box-body" id="plugin-box"></div>
                </div>
            </div>
        </div>
	</div>
</div>
<div class="row">
<%
	var hooks = require(':public/library/hook.js'),
		hook = new hooks();
	hook.compile('iPress.home.advanse');
%>
</div>
</div>