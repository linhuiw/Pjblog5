<div class="clearfix" id="plugin">
	<div class="col-x-2 fleft">
    	<div class="tips">
        	<div class="clearfix">
            	<div class="install-block installed fleft"></div>
                <div class="install-block-info fleft">已安装插件</div>
                <div class="install-block uninstalled fleft"></div>
                <div class="install-block-info fleft">未安装插件</div>
            </div>
        </div>
        <div class="plugin-zone">
<%
	;(function(){
		fs.dirList(contrast("private/plugins"), function( name ){
			var dl = "private/plugins/" + name;
			if ( fs.exist(resolve(dl + "/config")) ){
				var mo = require(dl + "/config");
				if ( mo.mark ){
%>
			<div class="plugins uninstalled clearfix">
            	<div class="icon fleft"><img src="<%=mo.icon%>" onerror="this.src='public/assets/img/1402321265_Settings.png'" /></div>
                <div class="tool fright">
                	<a href="javascript:;" app-id="<%=name%>" class="app-setup AutoSendAjax" app-m="plugin" app-p="install" app-c="确定需要安装这个插件？"><i class="fa fa-repeat"></i> 安装</a><!--repeat-->
                    <a href="javascript:;" app-id="<%=name%>" class="app-delete AutoSendAjax" app-m="plugin" app-p="remove" app-c="确定删除？删除后无法恢复！"><i class="fa fa-trash-o"></i> 删除</a>
                </div>
                <div class="im">
                	<h6><%=mo.name%> <span class="mark"><i class="fa fa-share-alt-square"></i> <%=mo.mark%></span></h6>
                    <div class="name">
                    	<i class="fa fa-child"></i> <%=mo.author%> 
                        <a href="mailto:<%=mo.mail%>" target="_blank"><i class="fa fa-send"></i> <%=mo.mail%></a>
                        <a href="http://webkits.cn" target="_blank"><i class="fa fa-link"></i> <%=mo.site%></a>
                    </div>
                    <div class="des"><i class="fa fa-slack"></i> <%=mo.des%></div>
                </div>
            </div>
<%
				}
			}
		});
	})();
%>
<!--        	<div class="plugins installed clearfix">
            	<div class="icon fleft"><img src="" onerror="this.src='public/assets/img/1402321265_Settings.png'" /></div>
                <div class="tool fright">
                	<a href=""><i class="fa fa-play"></i> 启用</a>
                	<a href=""><i class="fa fa-undo"></i> 卸载</a>
                    <a href=""><i class="fa fa-cog"></i> 设置</a>
                    <a href=""><i class="fa fa-location-arrow"></i> 升级</a>
                </div>
                <div class="im">
                	<h6>最新日志插件 <span class="mark"><i class="fa fa-share-alt-square"></i> SFASFASFSF</span></h6> 
                    <div class="name">
                    	<i class="fa fa-child"></i> 沈赟杰 
                        <a href="mailto:evio@vip.qq.com" target="_blank"><i class="fa fa-send"></i> evio@vip.qq.com</a>
                        <a href="http://webkits.cn" target="_blank"><i class="fa fa-link"></i> http://webkits.cn</a>
                    </div>
                    <div class="des"><i class="fa fa-slack"></i> 而有关法新社等外媒报道MH370一些乘客家属欲筹款500万美元，奖励为失联事件提供线索的人，马方说已看到相关报道，尊重家属进行这一选择的权利。家属如果能分享调查结果，那么马方也表示欢迎。</div>
                </div>
            </div>
        
        	<div class="plugins installed clearfix">
            	<div class="icon fleft"><img src="" onerror="this.src='public/assets/img/1402321265_Settings.png'" /></div>
                <div class="tool fright">
                	<a href=""><i class="fa fa-power-off"></i> 停用</a>
                	<a href=""><i class="fa fa-undo"></i> 卸载</a>
                    <a href=""><i class="fa fa-cog"></i> 设置</a>
                    <a href=""><i class="fa fa-location-arrow"></i> 升级</a>
                </div>
                <div class="im">
                	<h6>最新日志插件 <span class="mark"><i class="fa fa-share-alt-square"></i> SFASFASFSF</span></h6>
                    <div class="name">
                    	<i class="fa fa-child"></i> 沈赟杰 
                        <a href="mailto:evio@vip.qq.com" target="_blank"><i class="fa fa-send"></i> evio@vip.qq.com</a>
                        <a href="http://webkits.cn" target="_blank"><i class="fa fa-link"></i> http://webkits.cn</a>
                    </div>
                    <div class="des"><i class="fa fa-slack"></i> 而有关法新社等外媒报道MH370一些乘客家属欲筹款500万美元，奖励为失联事件提供线索的人，马方说已看到相关报道，尊重家属进行这一选择的权利。家属如果能分享调查结果，那么马方也表示欢迎。</div>
                </div>
            </div>
            
            <div class="plugins uninstalled clearfix">
            	<div class="icon fleft"><img src="" onerror="this.src='public/assets/img/1402321265_Settings.png'" /></div>
                <div class="tool fright">
                	<a href=""><i class="fa fa-repeat"></i> 安装</a>
                    <a href=""><i class="fa fa-trash-o"></i> 删除</a>
                </div>
                <div class="im">
                	<h6>最新日志插件 <span class="mark"><i class="fa fa-share-alt-square"></i> SFASFASFSF</span></h6>
                    <div class="name">
                    	<i class="fa fa-child"></i> 沈赟杰 
                        <a href="mailto:evio@vip.qq.com" target="_blank"><i class="fa fa-send"></i> evio@vip.qq.com</a>
                        <a href="http://webkits.cn" target="_blank"><i class="fa fa-link"></i> http://webkits.cn</a>
                    </div>
                    <div class="des"><i class="fa fa-slack"></i> 而有关法新社等外媒报道MH370一些乘客家属欲筹款500万美元，奖励为失联事件提供线索的人，马方说已看到相关报道，尊重家属进行这一选择的权利。家属如果能分享调查结果，那么马方也表示欢迎。</div>
                </div>
            </div>-->
              
        </div>
    </div>
    <div class="col-x-2 fright"><i class="fa fa-cloud"></i> 此为云端插件，暂未开放，敬请期待！</div>
</div>