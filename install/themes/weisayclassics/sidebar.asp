<div id="sidebar">
<div style="margin-top:15px;">
<%=coms.fns.unSQLStr(coms.fns.unHTMLStr(data.theme.setting.word))%>
</div>

<div id="tab-title">
<div class="tab">
<ul id="tabnav">
<li>最新日志</li>
<li class="selected">热评日志</li>
<li>随机日志</li>
</ul>
</div><div class="clear"></div>
	<div id="tab-content">
		<ul class="hide"><%sups.plugin("toparticle")%></ul>
		<ul><%sups.plugin("hotarticle")%></ul>
		<ul class="hide"><%sups.plugin("rndarticles")%></ul>
</div>
</div>

<div class="widget">
<%sups.plugin("topcomments", { genre: 0, dis: "评论" });%>
</div>

<div class="widget">
<%sups.plugin("topcomments", { genre: 1, dis: "留言" });%>
</div>

<div class="widget">
<%sups.plugin("tagcloud");%>
</div>

<div class="widget">
<%sups.plugin("blogstatistics");%>
</div>

<%if ( sups.position("home") ) {%>
<div class="widget">
<%sups.plugin("link");%>
</div>
<%};%>

<div class="widget">
<%sups.include("side-login.asp");%>
</div>

<div class="clear"></div>
</div>
