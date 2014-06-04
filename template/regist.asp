<%@LANGUAGE="JAVASCRIPT" CODEPAGE="65001"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
</head>

<body>
<form action="../blog/public/sync.asp?m=user&p=regist" method="post">
<input type="text" name="member_mark" placeholder="登入ID" /><br />
<input type="text" name="member_nick" placeholder="昵称" /><br />
<input type="text" name="member_mail" placeholder="邮箱" /><br />
<input type="password" name="password" placeholder="密码" /><br />
<input type="password" name="repeat_password" placeholder="重复密码" /><br />
<input type="submit" value="提交" />
</form>
</body>
</html>
