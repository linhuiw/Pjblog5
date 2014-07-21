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
                                        <i class="fa fa-comments"></i>
                                    </div>

                                    <div class="infobox-data">
                                        <span class="infobox-data-number"><%=conn.Execute("Select count(id) From blog_comments")(0).value%></span>
                                        <div class="infobox-content">评论总数</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-body-A1-item">
                            <div class="detail-body-A1-item-content">
                                <div class="infobox infobox-green clearfix">
                                    <div class="infobox-icon">
                                        <i class="fa fa-send"></i>
                                    </div>

                                    <div class="infobox-data">
                                        <span class="infobox-data-number"><%=conn.Execute("Select count(id) From blog_messages")(0).value%></span>
                                        <div class="infobox-content">留言总数</div>
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
                        
                        <div class="detail-body-A1-item">
                            <div class="detail-body-A1-item-content">
                                <div class="infobox infobox-green clearfix">
                                    <div class="infobox-icon">
                                        <i class="fa fa-compress"></i>
                                    </div>

                                    <div class="infobox-data">
                                        <span class="infobox-data-number"><%=conn.Execute("Select count(id) From blog_links")(0).value%></span>
                                        <div class="infobox-content">友链总数</div>
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
                    <div class="title"><i class="fa fa-comment"></i> 最新评论</div>
                    <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A3">
                    	<%
						;(function( REC ){
							var rec = new REC(conn);
							var keep = [], uids = [];
							var md5 = require("md5");
							var date = require("date");
							var u = {};
							var outs = [];
							
							rec
								.sql('Select top 5 * From blog_comments Order By com_postdate DESC')
								.open()
								.each(function( object ){
									keep.push({
										id: object("id").value,
										com_article_id: object("com_article_id").value,
										com_member_id: object("com_member_id").value,
										com_content: object("com_content").value,
										com_postdate: new Date(object("com_postdate").value).getTime(),
										com_username: object("com_username").value,
										com_usermail: object("com_usermail").value
									});
									if ( uids.indexOf(object("com_member_id").value) === -1 && object("com_member_id").value > 0 ){ uids.push(object("com_member_id").value); };			
								})
								.close();

							if ( uids.length > 0 ){
								rec = new REC(conn);
								rec
									.sql("Select * From blog_members Where id in (" + uids.join(",") + ")")
									.open()
									.each(function(object){
										u[object("id") + ""] = {
											nick: object("member_nick").value,
											avatar: object("member_avatar").value
										}
									})
									.close();
							}

							for ( var i = 0 ; i < keep.length ; i++ ){
								var nick, avatar;
								if ( keep[i].com_member_id > 0 ){
									nick = u[keep[i].com_member_id + ""].nick;
									avatar = u[keep[i].com_member_id + ""].avatar;
								}else{
									nick = keep[i].com_username;
									avatar = blog.AppPlatForm + "/avatars/" + md5.make(keep[i].com_usermail);
								}
						%>
                        <div class="detail-body-A3-item clearfix">
                            <div class="photo fleft"><img src="<%=avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" /></div>
                            <div class="info">
                                <div class="name clearfix"><%=nick%><span><%=date.format(new Date(keep[i].com_postdate), "y-m-d h:i")%></span></div>
                                <div class="word"><a href="article.asp?id=<%=keep[i].com_article_id%>#comment_<%=keep[i].id%>" target="_blank"><%=keep[i].com_content%></a></div>
                            </div>
                        </div>
                        <%
							}
						})( dbo.RecordSet );
						%>
                    </div>
                </div>
            </div>
        </li>
        
<!--        <li>
            <div class="detail">
                <h5 class="detail-head clearfix">
                    <div class="title"><i class="fa fa-send"></i> 最新留言</div>
                    <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A3">
                        <div class="detail-body-A3-item clearfix">
                            <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                            <div class="info">
                                <div class="name clearfix">evio<span>2014.12.14</span></div>
                                <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                            </div>
                        </div>
                        <div class="detail-body-A3-item clearfix">
                            <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                            <div class="info">
                                <div class="name clearfix">evio<span>2014.12.14</span></div>
                                <div class="word">最新的版本很棒！</div>
                            </div>
                        </div>
                        <div class="detail-body-A3-item clearfix">
                            <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                            <div class="info">
                                <div class="name clearfix">evio<span>2014.12.14</span></div>
                                <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                            </div>
                        </div>
                        <div class="detail-body-A3-item clearfix">
                            <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                            <div class="info">
                                <div class="name clearfix">evio<span>2014.12.14</span></div>
                                <div class="word">最新的版本很棒！</div>
                            </div>
                        </div>
                        <div class="detail-body-A3-item clearfix">
                            <div class="photo fleft"><img src="http://tipoo.cn/assets/avatars/user.jpg" /></div>
                            <div class="info">
                                <div class="name clearfix">evio<span>2014.12.14</span></div>
                                <div class="word">最新的版本很棒！我想再买一套，不知道店家可以不？</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>-->
        
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
    </ul>
<!--HTML CONTENT-->