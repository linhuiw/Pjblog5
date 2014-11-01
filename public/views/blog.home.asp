<%
;var cookie = require("cookie"),
	welcome = cookie.get(blog.cookie + "_welcome");

	if ( !welcome || welcome != "ok" ){
%>
<div id="welcome" class="track5">
	<div class="welcome-wrap">
    	<div class="svg SvgAnimate">
        	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="300px" height="200px" viewBox="0 0 300 200" enable-background="new 0 0 300 200" xml:space="preserve">
				<g>
					<path fill="none" stroke="rgba(255,255,255,.8)" d="M119.722,122.442h39.041c14.813,0,26.743-3.957,35.781-11.75h0.048l0.008-0.046
						c9.521-8.238,15.82-20.751,18.78-37.541c5.802-32.906-6.704-49.589-37.174-49.589h-74.271l-2.31,13.1l-6.786,38.485l-6.276,35.59
						l-2.072,11.75h0.76H119.722z M108.821,96.003h49.923c6.732,0,15.064-1.749,16.535-10.087c0.415-2.354,1.678-9.516-12.751-9.516
						h-45.29l-2.377-2.886l8.395-32.528h64.494l-1.582,8.969h-56.228l-4.485,17.474h38.654c14.871,0,22.211,6.738,20.139,18.487
						c-2.073,11.755-12.452,19.058-27.087,19.058h-49.923L108.821,96.003z"/>
					<path fill="none" stroke="rgba(255,255,255,.8)" d="M86.963,161.305c-0.922,5.228-3.424,8.709-12.642,8.709H57.286l-0.857,4.863h17.034
						c10.596,0,16.774-4.566,18.362-13.572l3.724-21.119h-4.863L86.963,161.305z"/>
					<path fill="none" stroke="rgba(255,255,255,.8)" d="M146.775,161.305l3.724-21.119h-4.863l-3.724,21.119c-1.611,9.133,2.83,13.572,13.576,13.572h17.454
						l0.858-4.863h-17.455C147.128,170.014,145.853,166.533,146.775,161.305z"/>
					<path fill="none" stroke="rgba(255,255,255,.8)" d="M201.66,139.831c-11.706,0-22.917,2.144-25.66,17.7c-2.743,15.557,7.711,17.701,19.417,17.701
						c11.707,0,22.917-2.144,25.66-17.701C223.821,141.976,213.367,139.831,201.66,139.831z M216.215,157.531
						c-1.692,9.598-6.724,12.838-19.939,12.838c-13.215,0-17.104-3.239-15.412-12.838c1.692-9.598,6.724-12.838,19.939-12.838
						C214.018,144.694,217.907,147.933,216.215,157.531z"/>
					<path fill="none" stroke="rgba(255,255,255,.8)" d="M241.53,145.049h25.779l0.858-4.863h-25.779c-10.685,0-17.129,5.821-19.153,17.301
						c-2.035,11.539,2.351,17.39,13.036,17.39h26.045l2.362-13.395l0.828-4.695l0.03-0.168h-11.783l-0.857,4.863h6.92l-1.504,8.532
						h-21.182c-7.983,0-10.599-3.629-9.03-12.527C229.656,148.653,233.547,145.049,241.53,145.049z"/>
					<path fill="none" stroke="rgba(255,255,255,.8)" d="M74.36,151.362c1.16-6.58-2.917-11.176-9.915-11.176H37.201l-0.857,4.863h4.863h2.839h19.542
						c5.184,0,6.423,3.401,5.909,6.313c-0.513,2.911-2.952,6.313-8.136,6.313H41.819H38.98h-4.863l-3.033,17.203h4.863l2.176-12.34
						h22.381C67.501,162.538,73.199,157.942,74.36,151.362z"/>
					<path fill="none" stroke="rgba(255,255,255,.8)" d="M130.18,140.186h-24.467l-0.857,4.863h24.467c4.13,0,5.939,1.617,5.377,4.804
						c-0.557,3.158-2.933,4.758-7.063,4.758h-24.467l-0.857,4.863h25c6.063,0,5.819,4.051,5.6,5.292
						c-0.217,1.231-1.396,5.247-7.459,5.247h-25l-0.857,4.863h25c7.872,0,12.292-5.078,13.179-10.11
						c0.467-2.647-0.039-5.804-2.395-7.889c2.19-1.683,3.671-4.125,4.19-7.07C140.617,143.874,137.019,140.186,130.18,140.186z"/>
				</g>
			</svg>
            <div class="logs">
            	<h1 class="animated fadeInUpBig">因为有你们，我们一直在努力。</h1>
                <p class="animated fadeInUpBig w1">历时三年的技术积累带给你们一套最好的独立博客程序。</p>
                <p class="animated fadeInUpBig w2">让我们一起见证ASP的奇迹吧！</p>
            </div>
        </div>
    </div>
</div>
<%	
		cookie.set(blog.cookie + "_welcome", "ok");
		cookie.expire(blog.cookie + "_welcome", 12 * 60 * 60 * 1000);	
	}
%>
<!--HTML CONTENT-->
    <ul class="waterfull">
    	<li id="versions">
            <div class="detail">
                <h5 class="detail-head">
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
                <h5 class="detail-head">
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
                <h5 class="detail-head">
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
                <h5 class="detail-head">
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
                <h5 class="detail-head">
                    <div class="title"><i class="fa fa-picture-o"></i> 最新云端主题</div>
                    <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A3 clearfix" id="platthemes"></div>
                </div>
            </div>
        </li>
        
        <li>
            <div class="detail">
                <h5 class="detail-head">
                    <div class="title"><i class="fa fa-xing-square"></i> 最新云端插件</div>
                    <div class="more"><a href="" class="fa fa-arrow-circle-right"></a></div>
                </h5>
                <div class="detail-body clearfix">
                    <div class="detail-body-A3 clearfix" id="platplugins"></div>
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