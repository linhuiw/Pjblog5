<div class="pannel">
<h6>最新日志</h6>
<%
source.forEach(function(o){
%>
<div class="guestitems">
    <p style="padding-bottom:5px; line-height:24px;"><a href="<%=o.src%>"><%=o.art_title%></a></p>
    <p><%=o.art_postdate%></p>
</div>
<%	
});
%>
</div>