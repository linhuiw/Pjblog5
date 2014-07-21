<h6>填写你的安装信息：</h6>
<form action="?action=submit" method="post">
<table cellpadding="0" cellspacing="0" width="100%" border="0" class="info">
    <input type="hidden" value="<%=folder%>" name="folder" />
    <tr>
        <td width="200">网站名称</td>
        <td><input type="text" value="" name="name" style="width:400px;"></td>
    </tr>
    <tr>
        <td width="200">网站域名</td>
        <td><input type="text" value="" name="web" style="width:600px;" value="http://"></td>
    </tr>
    <tr>
        <td>数据库名称</td>
        <td><input type="text" value="" name="dbname" style="width:200px;" value=""></td>
    </tr>
    <tr>
        <td>数据库IP地址</td>
        <td><input type="text" value="" name="dbip" style="width:200px;" value="."> (本地地址就不需要更改)</td>
    </tr>
    <tr>
        <td>数据库用户名</td>
        <td><input type="text" value="" name="dbusername" style="width:200px;"></td>
    </tr>
    <tr>
        <td>数据库密码</td>
        <td><input type="password" value="" name="dbpassword" style="width:200px;"></td>
    </tr>
    <tr>
        <td>PJBlog5官方平台授权的APPID</td>
        <td><input type="text" value="" name="appid" style="width:300px;"></td>
    </tr>
    <tr>
        <td>PJBlog5官方平台授权的APPKEY</td>
        <td><input type="text" value="" name="appkey" style="width:300px;"></td>
    </tr>
    <tr>
        <td></td>
        <td><input type="submit" value="保存数据"></td>
    </tr>
</table>
</form>