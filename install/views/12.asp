<%
var data = require("./data");
%>
<div class="wrap">
  <div class="content copyright shadow">
  	<%if ( data.t === "online" ){%>
    <h6>Oauth2.0 云平台登录授权结果</h6>
    <p>恭喜您，已成功设置管理员账号！请登录后台安装所有插件后开启插件。然后跳转至主题页面安装默认主题。</p>
    <p>至此，PJBlog5安装已全部完毕。尽情享受你的博客旅程吧！</p>
    <%}else{%>
    <h6>本地调试管理员账号授权结果</h6>
    <p>本地授权管理员已完成，请登录后台安装所有插件后开启插件。然后跳转至主题页面安装默认主题。</p>
    <p>至此，PJBlog5安装已全部完毕。尽情享受你的博客旅程吧！</p>
    <%};%>
    <p style="color:#ff0000;">注意：别忘记了删除install文件夹哦！</p>
  </div>
  <div class="step">
    <a href="../control.asp" class="btn">登录后台</a>
  </div>
</div>
