<%
var t = http.query("t") || "local";
var data = require("./data");
if ( t === "online" ){
%>

<form action="?step=4&t=online" method="post">
  <input type="hidden" value="<%=folder%>" name="folder" />
  <input type="hidden" name="web" value="" id="web" />
  <div class="wrap">
    <div class="content copyright shadow">
      <h6>请输入安装信息</h6>
      <table cellpadding="0" cellspacing="0" width="100%" border="0">
        <tr>
          <td width="200">网站名称</td>
          <td><input type="text" value="<%=data.name || ""%>" name="name" style="width:400px;" /></td>
        </tr>
        <tr>
          <td width="200">安装目录</td>
          <td><%=folder.length === 0 ? "网站根目录安装" : folder%></td>
        </tr>
        <tr>
          <td width="200">网站域名</td>
          <td><div id="tweb"></div></td>
        </tr>
        <tr>
          <td>数据库名称</td>
          <td><input type="text" name="dbname" style="width:200px;" value="<%=data.dbname || ""%>" /></td>
        </tr>
        <tr>
          <td>数据库IP地址</td>
          <td><input type="text" value="<%=data.dbip || ""%>" name="dbip" style="width:200px;" id="dbip" />
            <span>如果空间和数据库在同一台服务器上，那么这里不需要填写。</span></td>
        </tr>
        <tr>
          <td>数据库用户名</td>
          <td><input type="text" value="<%=data.dbusername || ""%>" name="dbusername" style="width:200px;" /></td>
        </tr>
        <tr>
          <td>数据库密码</td>
          <td><input type="password" value="<%=data.dbpassword || ""%>" name="dbpassword" style="width:200px;" /></td>
        </tr>
        <tr>
          <td>PJBlog5官方平台授权的APPID</td>
          <td><input type="text" name="appid" style="width:500px;" value="<%=data.appid || ""%>" />
            <span>填写你在<a href="http://app.webkits.cn" target="_blank">官方平台</a>申请到的APPID</span></td>
        </tr>
        <tr>
          <td>PJBlog5官方平台授权的APPKEY</td>
          <td><input type="text" name="appkey" style="width:500px;" value="<%=data.appkey || ""%>" />
            <span>填写你在<a href="http://app.webkits.cn" target="_blank">官方平台</a>申请到的APPKEY</span></td>
        </tr>
      </table>
    </div>
    <div class="step">
      <input type="submit" value="下一步" class="btn" />
    </div>
  </div>
</form>
<%}else{%>
<form action="?step=4&t=local" method="post">
  <input type="hidden" value="<%=folder%>" name="folder" />
  <input type="hidden" name="web" value="" id="web" />
  <input type="hidden" name="appid" value="10001" />
  <input type="hidden" name="appkey" value="localappkey" />
  <div class="wrap">
    <div class="content copyright shadow">
      <h6>请输入安装信息</h6>
      <table cellpadding="0" cellspacing="0" width="100%" border="0">
        <tr>
          <td width="200">网站名称</td>
          <td><input type="text" value="<%=data.name || ""%>" name="name" style="width:400px;" /></td>
        </tr>
        <tr>
          <td width="200">安装目录</td>
          <td><%=folder.length === 0 ? "网站根目录安装" : folder%></td>
        </tr>
        <tr>
          <td width="200">网站域名</td>
          <td><div id="tweb"></div></td>
        </tr>
        <tr>
          <td>数据库名称</td>
          <td><input type="text" name="dbname" style="width:200px;" value="<%=data.dbname || ""%>" /></td>
        </tr>
        <tr>
          <td>数据库IP地址</td>
          <td><input type="text" value="<%=data.dbip || ""%>" name="dbip" style="width:200px;" id="dbip" />
            <span>如果空间和数据库在同一台服务器上，那么这里不需要填写。</span></td>
        </tr>
        <tr>
          <td>数据库用户名</td>
          <td><input type="text" value="<%=data.dbusername || ""%>" name="dbusername" style="width:200px;" /></td>
        </tr>
        <tr>
          <td>数据库密码</td>
          <td><input type="password" value="<%=data.dbpassword || ""%>" name="dbpassword" style="width:200px;" /></td>
        </tr>
      </table>
    </div>
    <div class="step">
      <input type="submit" value="下一步" class="btn" />
    </div>
  </div>
</form>
<%}%>
<script>
var web = document.getElementById('web');
var tweb = document.getElementById('tweb');
if ( web ){
	web.value = window.location.origin;
};
if ( tweb ){
	tweb.innerHTML = window.location.origin;
};
</script>