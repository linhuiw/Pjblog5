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
        <h5><i class="fa fa-globe"></i> 平台授权账号信息（<%=blog.AppPlatForm%>）</h5>
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
            <tr>
                <td width="150">APPID</td>
                <td><input type="text" value="<%=object("blog_appid").value%>" name="blog_appid" class="col-x-3" /></td>
            </tr>
            <tr>
                <td width="150">APPKEY</td>
                <td><input type="text" value="<%=object("blog_appkey").value%>" name="blog_appkey" class="col-x-3" /></td>
            </tr>
        </table>
    </div>
    
    <div class="setform">
        <h5><i class="fa fa-file-text-o"></i> 日志设置，简单，方便，快捷！</h5>
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
        	<tr>
                <td width="150">前台显示每页日志数</td>
                <td><input type="text" value="<%=object("blog_articlepage").value%>" name="blog_articlepage" class="col-x-1" /></td>
            </tr>
            <tr>
                <td width="150">日志预览截取字数</td>
                <td><input type="text" value="<%=object("blog_articlecut").value%>" name="blog_articlecut" class="col-x-1" /></td>
            </tr>
            <tr>
                <td width="150">删除分类后日志转移</td>
                <td>
                	<select name="blog_categoryremove">
                        <option value="0" <%if ( object("blog_categoryremove").value === 0 || !object("blog_categoryremove").value ){Library.log('selected="selected"')}%>>转移到系统默认垃圾箱</option>
                        <option value="1" <%if ( object("blog_categoryremove").value === 1 ){Library.log('selected="selected"')}%>>直接将该分类下日志删除</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td width="150">删除分类后子分类转移</td>
                <td>
                	<select name="blog_categoryremovechild">
                        <option value="0" <%if ( object("blog_categoryremovechild").value === 0 || !object("blog_categoryremovechild").value ){Library.log('selected="selected"')}%>>子分类转化为顶级分类</option>
                        <option value="1" <%if ( object("blog_categoryremovechild").value === 1 ){Library.log('selected="selected"')}%>>直接将子分类删除</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td width="150">开启日志云端好友交互通知功能</td>
                <td>
                	<select name="blog_article_cloud_notice">
                        <option value="0" <%if ( object("blog_article_cloud_notice").value === 0 || !object("blog_article_cloud_notice").value ){Library.log('selected="selected"')}%>>关闭</option>
                        <option value="1" <%if ( object("blog_article_cloud_notice").value === 1 ){Library.log('selected="selected"')}%>>开启</option>
                    </select>
                </td>
            </tr>
        </table>
    </div>
    
    <div class="setform">
        <h5><i class="fa fa-comments"></i> 评论设置</h5>
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
        	<tr>
                <td width="150">前台显示每页评论数</td>
                <td><input type="text" value="<%=object("blog_comment_perpage").value%>" name="blog_comment_perpage" class="col-x-1" /></td>
            </tr>
            <tr>
                <td width="150">评论发表时间间隔（MS）</td>
                <td><input type="text" value="<%=object("blog_comment_delay").value%>" name="blog_comment_delay" class="col-x-1" /></td>
            </tr>
            <tr>
                <td>回复评论云端消息通知</td>
                <td>
                	<select name="blog_comment_cloud_notice">
                        <option value="0" <%if ( !object("blog_comment_cloud_notice").value ){Library.log('selected="selected"');}%>>关闭</option>
                        <option value="1" <%if ( object("blog_comment_cloud_notice").value ){Library.log('selected="selected"');}%>>开启</option>
                    </select>
                </td>
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