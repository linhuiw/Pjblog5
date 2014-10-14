<!--HTML CONTENT-->
    <ul class="waterfull">
    	<li id="versions">
            <div class="detail">
                <h5 class="detail-head clearfix">
                    <div class="title"><i class="fa fa-git-square"></i> 最新版本信息</div>
                    <div class="more"><a href="<%=blog.AppPlatForm%>" class="fa fa-arrow-circle-right" target="_blank"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A3 zone">
                    </div>
                </div>
            </div>
        </li>
        <li>
            <div class="detail">
                <h5 class="detail-head clearfix">
                    <div class="title"><i class="fa fa-tachometer"></i> 系统综合数据</div>
                    <!--<div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>-->
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A1">
                        <div class="detail-body-A1-item">
                            <div class="detail-body-A1-item-content">
                                <div class="infobox infobox-green clearfix">
                                    <div class="infobox-icon">
                                        <i class="fa fa-file-text-o"></i>
                                    </div>

                                    <div class="infobox-data">
                                        <span class="infobox-data-number"><%=conn.Execute("Select count(id) From blog_articles")(0).value%></span>
                                        <div class="infobox-content">文章总数</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-body-A1-item">
                            <div class="detail-body-A1-item-content">
                                <div class="infobox infobox-green clearfix">
                                    <div class="infobox-icon">
                                        <i class="fa fa-user"></i>
                                    </div>

                                    <div class="infobox-data">
                                        <span class="infobox-data-number"><%=conn.Execute("Select count(id) From blog_members")(0).value%></span>
                                        <div class="infobox-content">用户总数</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-body-A1-item">
                            <div class="detail-body-A1-item-content">
                                <div class="infobox infobox-green clearfix">
                                    <div class="infobox-icon">
                                        <i class="fa fa-share-alt-square"></i>
                                    </div>

                                    <div class="infobox-data">
                                        <span class="infobox-data-number"><%=conn.Execute("Select count(id) From blog_plugins")(0).value%></span>
                                        <div class="infobox-content">插件总数</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </li>
        
        <li>
            <div class="detail">
                <h5 class="detail-head clearfix">
                    <div class="title"><i class="fa fa-joomla"></i> 系统组件支持</div>
                    <!--<div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>-->
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A2">
                    	<%
							;(function( params ){
								for ( var i in params ){
									if ( /^com\_/.test(i) ){
										try{
											new ActiveXObject(params[i]);
						%>
                        <div class="detail-body-A2-item clearfix">
                            <div class="fleft"><i class="fa fa-angle-right"></i> <%=params[i]%></div>
                            <div class="fright"><i class="fa fa-check"></i></div>
                        </div>
                        <%
										}catch(e){
						%>
                        <div class="detail-body-A2-item clearfix">
                            <div class="fleft"><i class="fa fa-angle-right"></i> <%=params[i]%></div>
                            <div class="fright"><i class="fa fa-times"></i></div>
                        </div>
                        <%				
										}
									}
								};
							})( Library );
						%>
                    </div>
                </div>
            </div>
        </li>
        
        <li>
            <div class="detail">
                <h5 class="detail-head clearfix">
                    <div class="title"><i class="fa fa-bullhorn"></i> 官方信息</div>
                    <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A2 clearfix" id="platnews"></div>
                </div>
            </div>
        </li>
        
        <li>
            <div class="detail">
                <h5 class="detail-head clearfix">
                    <div class="title"><i class="fa fa-picture-o"></i> 最新在线主题</div>
                    <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A3">
                    暂未开放，敬请期待！
                    </div>
                </div>
            </div>
        </li>
        
        <li>
            <div class="detail">
                <h5 class="detail-head clearfix">
                    <div class="title"><i class="fa fa-xing-square"></i> 最新在线插件</div>
                    <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A3">
                    暂未开放，敬请期待！
                    </div>
                </div>
            </div>
        </li>
        <%
			;(function( hooks ){
				var hook = new hooks();
				hook.get("ECM_UI_CONTROLIST").compile(dbo, conn, fs, fns, http, uid, token, openid);
			})( require("public/library/hook") );
		%>
    </ul>
<!--HTML CONTENT-->