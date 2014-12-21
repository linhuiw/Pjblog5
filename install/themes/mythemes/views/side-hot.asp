						<div class="panel panel-success">
							<div class="panel-heading">
								<h3 class="panel-title"><a data-toggle="collapse" data-parent="#accordion-dmengrank-2" href="#search-dmengrank-2"><span class="glyphicon glyphicon-search"></span> 浏览次数最多的十篇日志</a></h3>
							</div>
							<div id="search-dmengrank-2" class="panel-collapse collapse ">
	<%
	source.forEach(function(o){
	%>
	<li class="list-group-item"><!--<span class="badge" title="19750次浏览">19750</span>--> <a href="<%=o.src%>" title="<%=o.art_title%>"><%=o.art_title%></a></li>
	<%
	});
	%>
							</div>
						</div>
<%
if (1==3){%>
						<div class="panel panel-info">
							<div class="panel-heading"><h3 class="panel-title"><a data-toggle="collapse" data-parent="#accordion-dmengrank-2" href="#comment-dmengrank-2"><span class="glyphicon glyphicon-volume-up"></span> 最多人评论的5篇内容</a></h3></div>
							<div id="comment-dmengrank-2" class="panel-collapse collapse "><li class="list-group-item"><span class="badge" title="1588条评论">1588</span> <a href="http://www.dmeng.net/dmeng-theme-2-0.html" title="多梦主题 2.0">多梦主题 2.0</a></li></div>
						</div>
						<div class="panel panel-warning">
							<div class="panel-heading"><h3 class="panel-title"><a data-toggle="collapse" data-parent="#accordion-dmengrank-2" href="#vote-dmengrank-2"><span class="glyphicon glyphicon-stats"></span> 按投票率排行的5篇内容</a></h3></div>
							<div id="vote-dmengrank-2" class="panel-collapse collapse ">
								<li class="list-group-item"><span class="badge" title="134人投票">134</span> <a href="http://www.dmeng.net/let-it-go/" title="DMENG 2.0 意见征集">DMENG 2.0 意见征集</a></li>
							</div>
						</div>
						<div class="panel panel-danger">
							<div class="panel-heading"><h3 class="panel-title"><a data-toggle="collapse" data-parent="#accordion-dmengrank-2" href="#view-dmengrank-2"><span class="glyphicon glyphicon-fire"></span> 按浏览次数排行的5篇内容</a></h3></div>
							<div id="view-dmengrank-2" class="panel-collapse collapse in">
								<li class="list-group-item"><span class="badge" title="19750次浏览">19750</span> <a href="http://www.dmeng.net/dmeng-theme-2-0.html" title="多梦主题 2.0">多梦主题 2.0</a></li>
							</div>
						</div><%
}
%>
