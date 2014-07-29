<%
var data = require("./data");
%>
<div class="wrap">
  <div class="content copyright shadow">
  	<%if ( data.t === "online" ){%>
    <h6>Oauth2.0 云平台登录授权</h6>
    <p>您即将进行云平台授权登录，登录完成后，此云平台账号将被视为本站的超级管理员。点击云平台授权开始登录。</p>
    <%}else{%>
    <h6>本地调试管理员账号授权</h6>
    <p>本地调试将不对网站设置管理员账号和密码，通过cookie直接授权的方式让您可以直接登录后台。登录后台后请不要退出登录。本地调试有效期为一个月。如果过期失效，请重新安装本程序。</p>
    <%};%>
  </div>
  <div class="step">
    <%if ( data.t === "online" ){ var oauth = require("public/library/oauth2");%> 
    <a href="<%=oauth.GetAuthorizeURL(data.appid, "install2/?step=12")%>" class="btn">云平台授权</a>
    <%}else{%>
    <a href="?step=12" class="btn">本地授权</a>
    <%}%>
  </div>
</div>
