<%
var data = require("./data");
%>
  <div class="wrap">
    <div class="content copyright shadow">
      <h6>安装信息确认</h6>
      <table cellpadding="0" cellspacing="0" width="100%" border="0">
      	<tr>
          <td width="200">安装类型</td>
          <td><%=data.t === "online" ? "在线安装" : "本地安装"%></td>
        </tr>
        <tr>
          <td width="200">网站名称</td>
          <td><%=data.name || ""%></td>
        </tr>
        <tr>
          <td width="200">安装目录</td>
          <td><%=data.folder.length === 0 ? "网站根目录安装" : folder%></td>
        </tr>
        <tr>
          <td width="200">网站域名</td>
          <td><%=data.web%></td>
        </tr>
        <tr>
          <td>数据库名称</td>
          <td><%=data.dbname || ""%></td>
        </tr>
        <tr>
          <td>数据库IP地址</td>
          <td><%=data.dbip || ""%></td>
        </tr>
        <tr>
          <td>数据库用户名</td>
          <td><%=data.dbusername || ""%></td>
        </tr>
        <tr>
          <td>数据库密码</td>
          <td><%=data.dbpassword || ""%></td>
        </tr>
        <%if ( data.t === "online" ){%>
        <tr>
          <td>PJBlog5官方平台授权的APPID</td>
          <td><%=data.appid || ""%></td>
        </tr>
        <tr>
          <td>PJBlog5官方平台授权的APPKEY</td>
          <td><%=data.appkey || ""%></td>
        </tr>
        <%};%>
      </table>
    </div>
    <div class="step">
    	<a href="?step=3&t=<%=data.t%>" class="btn fleft">上一步</a>
      	<a href="?step=6" class="btn">安装数据</a>
    </div>
  </div>