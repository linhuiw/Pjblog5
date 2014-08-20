<%
	var rec = new dbo.RecordSet(conn);
	rec
		.sql("Select * From blog_global Where id=1")
		.process(function(object){
%>
<form action="public/async.asp?m=setting&p=save" method="post" style="margin:0;" id="postform" class="form-horizontal">
<div class="row">
	<div class="col-sm-12">
    	<section class="panel panel-info">
            <header class="panel-heading font-bold">
              <i class="fa fa-cogs"></i> 系统全局变量设置。
            </header>
            <div class="panel-body">
            
            	<div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-1">网站名称</label>
                  <div class="col-sm-4">
                    <input type="text" class="form-control" id="input-id-1" value="<%=object("blog_name").value%>" name="blog_name" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-2">网站副标题</label>
                  <div class="col-sm-8">
                    <input type="text" class="form-control" id="input-id-2" value="<%=object("blog_title").value%>" name="blog_title" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>

                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-3">网站简介</label>
                  <div class="col-sm-8">
                      <textarea class="form-control" style="height:80px; resize:none;" name="blog_des" id="input-id-3"><%=object("blog_des").value%></textarea>
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-4">博主邮箱</label>
                  <div class="col-sm-4">
                    <input type="text" class="form-control" id="input-id-4" value="<%=object("blog_mail").value%>" name="blog_mail" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-5">备案号</label>
                  <div class="col-sm-4">
                    <input type="text" class="form-control" id="input-id-5" value="<%=object("blog_copyright").value%>" name="blog_copyright" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                
                <div class="form-group">
                  <label class="col-sm-2 control-label">网站状态</label>
                  <div class="col-sm-3">
                    <label class="switch">
                      <input type="checkbox" value="1" name="blog_status" <%=object("blog_status").value ? "checked" : ""%> />
                      <span></span>
                    </label>
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-6">网站状态说明</label>
                  <div class="col-sm-8">
                      <textarea class="form-control" style="height:80px; resize:none;" name="blog_message" id="input-id-6"><%=object("blog_message").value%></textarea>
                  </div>
                </div>
 
            </div>
        </section>
    </div>
    
    
    <div class="col-sm-12">
    	<section class="panel panel-success">
            <header class="panel-heading font-bold">
              <i class="fa fa-rss-square"></i> SEO设置，让你的网站收录更快！
            </header>
            <div class="panel-body">
            	<div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-7">整站关键字</label>
                  <div class="col-sm-8">
                    <input type="text" class="form-control" id="input-id-7" value="<%=object("blog_keywords").value%>" name="blog_keywords" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-8">整站描述</label>
                  <div class="col-sm-8">
                      <textarea class="form-control" style="height:80px; resize:none;" name="blog_description" id="input-id-8"><%=object("blog_description").value%></textarea>
                  </div>
                </div>
            </div>
        </section>
    </div>
    
    
    <div class="col-sm-12">
    	<section class="panel panel-danger">
            <header class="panel-heading font-bold">
              <i class="fa fa-globe"></i> 平台授权账号信息（<a href="<%=blog.AppPlatForm%>" target="_blank"><%=blog.AppPlatForm%></a>）
            </header>
            <div class="panel-body">
            	<div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-9">APPID</label>
                  <div class="col-sm-2">
                    <input type="text" class="form-control" id="input-id-9" value="<%=object("blog_appid").value%>" name="blog_appid" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-10">APPKEY</label>
                  <div class="col-sm-8">
                    <input type="text" class="form-control" id="input-id-10" value="<%=object("blog_appkey").value%>" name="blog_appkey" />
                  </div>
                </div>
            </div>
        </section>
    </div>
    
    <div class="col-sm-12">
    	<section class="panel panel-info">
            <header class="panel-heading font-bold">
              <i class="fa fa-file-text-o"></i> 日志设置，简单，方便，快捷！
            </header>
            <div class="panel-body">
            	<div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-11">前台显示每页日志数</label>
                  <div class="col-sm-2">
                    <input type="text" class="form-control" id="input-id-11" value="<%=object("blog_articlepage").value%>" name="blog_articlepage" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-12">日志预览截取字数</label>
                  <div class="col-sm-2">
                    <input type="text" class="form-control" id="input-id-12" value="<%=object("blog_articlecut").value%>" name="blog_articlecut" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-13">删除分类后日志转移</label>
                  <div class="col-sm-3">
                    <select name="blog_categoryremove" class="form-control" id="input-id-13">
                      <option value="0" <%=object("blog_categoryremove").value === 0 ? "selected" : ""%>>转移到系统默认垃圾箱</option>
                      <option value="1" <%=object("blog_categoryremove").value === 1 ? "selected" : ""%>>直接将该分类下日志删除</option>
                    </select>
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-14">删除分类后子分类转移</label>
                  <div class="col-sm-3">
                    <select name="blog_categoryremovechild" class="form-control" id="input-id-14">
                      <option value="0" <%=object("blog_categoryremovechild").value === 0 ? "selected" : ""%>>子分类转化为顶级分类</option>
                      <option value="1" <%=object("blog_categoryremovechild").value === 1 ? "selected" : ""%>>直接将子分类删除</option>
                    </select>
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-15">开启日志云端好友通知功能</label>
                  <div class="col-sm-3">
                    <label class="switch">
                      <input type="checkbox" value="1" name="blog_article_cloud_notice" <%=object("blog_article_cloud_notice").value ? "checked" : ""%> />
                      <span></span>
                    </label>
                  </div>
                </div>
            </div>
        </section>
    </div>
    
    <div class="col-sm-12">
    	<section class="panel panel-warning">
            <header class="panel-heading font-bold">
              <i class="fa fa-comments"></i> 评论设置
            </header>
            <div class="panel-body">
            	<div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-16">前台显示每页评论数</label>
                  <div class="col-sm-2">
                    <input type="text" class="form-control" id="input-id-16" value="<%=object("blog_comment_perpage").value%>" name="blog_comment_perpage" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-17">评论发表时间间隔（MS）</label>
                  <div class="col-sm-2">
                    <input type="text" class="form-control" id="input-id-17" value="<%=object("blog_comment_delay").value%>" name="blog_comment_delay" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-18">评论字数控制</label>
                  <div class="col-sm-2">
                    <input type="text" class="form-control" id="input-id-18" value="<%=object("blog_comment_length").value%>" name="blog_comment_length" />
                  </div>
                </div>
                <div class="line line-dashed b-b line-lg pull-in"></div>
                <div class="form-group">
                  <label class="col-sm-2 control-label" for="input-id-19">开启日志云端好友通知功能</label>
                  <div class="col-sm-3">
                    <label class="switch">
                      <input type="checkbox" value="1" name="blog_comment_cloud_notice" <%=object("blog_comment_cloud_notice").value ? "checked" : ""%> />
                      <span></span>
                    </label>
                  </div>
                </div>
            </div>
        </section>
    </div>
    
    <div class="col-sm-12">
        <div class="form-group">
          <div class="col-sm-4 col-sm-offset-2">
            <input type="reset" class="btn btn-default" value="重置" />
            <input type="submit" class="btn btn-primary" value=" 保存 " />
          </div>
        </div>
    </div>
</div>
</form>
<%			
		});
%>