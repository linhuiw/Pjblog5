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
        <td><input type="text" value="" name="web" style="width:600px;" value="http://" id="web" readonly="readonly" /></td>
    </tr>
    <tr>
        <td>数据库名称</td>
        <td><input type="text" value="" name="dbname" style="width:200px;" value=""></td>
    </tr>
    <tr>
        <td>数据库IP地址</td>
        <td><input type="text" value="." name="dbip" style="width:200px;" id="dbip" /> (本地地址就不需要更改)</td>
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
        <td><input type="text" name="appid" style="width:300px;" value="10001"> (本地调试用户不要修改这里，线上安装的这里必须填写)</td>
    </tr>
    <tr>
        <td>PJBlog5官方平台授权的APPKEY</td>
        <td><input type="text" name="appkey" style="width:300px;" value="EWQREQRWEREW8QW4R4EWQ89R489WQE4R"> (本地调试用户不要修改这里，线上安装的这里必须填写)</td>
    </tr>
    <tr>
        <td></td>
        <td><input type="submit" value="保存数据"></td>
    </tr>
</table>
</form>
<script>
var web = document.getElementById('web');
if ( web ){
	web.value = window.location.origin;
}
</script>