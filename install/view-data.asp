<%
	var data = require("./data.json");
	var folder = contrast("../").replace(contrast("/"), "").replace(/^\\/, "").replace(/\\$/, "");
%>
<div class="container content">
	<div class="nav shadow radius">安装 <i class="fa fa-angle-right"></i> 数据</div>
    <div class="box shadow">
    	<div class="title"><i class="fa fa-volume-up"></i>填写您的配置信息：</div>
        <div class="main">
        <form action="?m=save" method="post">
        	<table cellpadding="0" cellspacing="0" width="100%">
            	<tr>
                	<td width="100">安装模式</td>
                    <td><input type="radio" value="1" name="mode" checked /> 在线 <input type="radio" value="0" name="mode" /> 本地</td>
                </tr>
            	<tr>
                	<td>网站名称</td>
                    <td><input type="text" value="<%=data.name || ""%>" name="name" /></td>
                </tr>
                <tr>
                  <td>安装目录</td>
                  <td><input type="text" value="<%=folder.length === 0 ? "" : folder%>" name="folder" readonly /></td>
                </tr>
                <tr>
                  <td>网站域名</td>
                  <td><input type="text" value="" name="web" id="web" readonly /></td>
                </tr>
                <tr>
                  <td>数据表前缀</td>
                  <td><input type="text" value="<%=data.tb || "blog_"%>" name="tb" /></td>
                </tr>
                <tr>
                  <td>数据库名称</td>
                  <td><input type="text" name="dbname" value="<%=data.dbname || ""%>" /></td>
                </tr>
                <tr>
                  <td>数据库IP地址</td>
                  <td><input type="text" value="<%=data.dbip === "." ? "localhost" : (data.dbip || "localhost")%>" name="dbip" id="dbip" /></td>
                </tr>
                <tr>
                  <td>数据库用户名</td>
                  <td><input type="text" value="<%=data.dbusername || ""%>" name="dbusername" /></td>
                </tr>
                <tr>
                  <td>数据库密码</td>
                  <td><input type="password" value="<%=data.dbpassword || ""%>" name="dbpassword" /></td>
                </tr>
                <tr>
                  <td>APPID</td>
                  <td><input type="text" name="appid" value="<%=data.appid || ""%>" /></td>
                </tr>
                <tr>
                  <td>APPKEY</td>
                  <td><input type="text" name="appkey" value="<%=data.appkey || ""%>" /></td>
                </tr>
                <tr>
                	<td></td>
                    <td><input type="submit" value="保存数据" class="btn btn-info" /></td>
                </tr>
            </table>
        </form>
        </div>
    </div>
</div>
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