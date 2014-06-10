<%
	var rec = new dbo.RecordSet(conn);
	rec
		.sql("Select * From blog_global Where id=1")
		.process(function(object){
%>
<form action="public/async.asp?m=setting&p=save" method="post" style="margin:0;" id="postform">
    <div class="setform">
        <h5><i class="fa fa-hand-o-right"></i> 系统全局变量设置。你可以对本系统的系统功能进行细致的更改，记得更改后要保存哦！</h5>
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
            <tr>
                <td width="150">网站名称</td>
                <td><input type="text" value="<%=object("blog_name").value%>" name="blog_name" class="col-x-1" /></td>
            </tr>
            <tr>
                <td width="150">网站副标题</td>
                <td><input type="text" value="<%=object("blog_title").value%>" name="blog_title" class="col-x-2" /></td>
            </tr>
            <tr>
                <td width="150">网站简介</td>
                <td><textarea class="col-x-3" style="height:50px;" name="blog_des"><%=object("blog_des").value%></textarea></td>
            </tr>
            <tr>
                <td width="150">网站群发邮箱</td>
                <td><input type="text" value="<%=object("blog_mail").value%>" name="blog_mail" class="col-x-1" /></td>
            </tr>
            <tr>
                <td width="150">网站备案号</td>
                <td><input type="text" value="<%=object("blog_copyright").value%>" name="blog_copyright" class="col-x-2" /></td>
            </tr>
            <tr>
                <td width="150">网站状态</td>
                <td>
                    <select name="blog_status">
                        <option value="0" <%if ( object("blog_status").value === 0 || !object("blog_status").value ){Library.log('selected="selected"')}%>>运行</option>
                        <option value="1" <%if ( object("blog_status").value === 1 ){Library.log('selected="selected"')}%>>关闭</option>
                        <option value="2" <%if ( object("blog_status").value === 2 ){Library.log('selected="selected"')}%>>暂停</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td width="150">网站状态说明</td>
                <td><textarea class="col-x-3" style="height:50px;" name="blog_message"><%=object("blog_message").value%></textarea></td>
            </tr>
        </table>
    </div>
    
    <div class="setform">
        <h5><i class="fa fa-rss-square"></i> SEO设置，让你的网站收录更快！</h5>
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
            <tr>
                <td width="150">整站关键字</td>
                <td><input type="text" value="<%=object("blog_keywords").value%>" name="blog_keywords" class="col-x-3" /></td>
            </tr>
            <tr>
                <td width="150">整站描述</td>
                <td><textarea class="col-x-3" style="height:50px;" name="blog_description"><%=object("blog_description").value%></textarea></td>
            </tr>
        </table>
    </div>
    
    <div class="setform">
        <h5><input type="submit" value="保存" /></h5>
    </div>
</form>
<%			
		});
%>