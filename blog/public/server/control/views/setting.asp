<div class="row">
    <div class="col-lg-12">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h5>博客基本设置参数<small style="margin-left: 15px;">控制博客的基本功能</small></h5>
            </div>
            <div class="ibox-content">
                <form method="post" class="form-horizontal ajax-form" action="<%=iPress.setURL('async', 'setting')%>">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客名称</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_name%>" name="blog_name">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客标题</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_title%>" name="blog_title">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客描述</label>
                        <div class="col-sm-10">
                            <textarea name="blog_des" class="form-control" style="height: 100px;"><%=gets.blog_des%></textarea>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客邮箱</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_mail%>" name="blog_mail">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">版权申明</label>
                        <div class="col-sm-10">
                            <textarea name="blog_copyright" class="form-control" style="height: 100px;"><%=gets.blog_copyright%></textarea>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客缺省SEO关键字</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_keywords%>" name="blog_keywords">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客缺省SEO描述</label>
                        <div class="col-sm-10">
                            <textarea name="blog_description" class="form-control" style="height: 100px;"><%=gets.blog_description%></textarea>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客运行状态</label>
                        <div class="col-sm-10">
                            <select name="blog_status" class="form-control">
                            	<option value="0" <%=gets.blog_status === 0 ? 'selected': ''%>>运行</option>
                            	<option value="1" <%=gets.blog_status === 1 ? 'selected': ''%>>关闭</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">博客关闭说明文案</label>
                        <div class="col-sm-10">
                            <textarea name="blog_message" class="form-control" style="height: 100px;"><%=gets.blog_message%></textarea>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">APPID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_appid%>" name="blog_appid">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">APPKEY</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_appkey%>" name="blog_appkey">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">首页日志每页显示数量</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_articlepage%>" name="blog_articlepage">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">日志摘要截取字数</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" value="<%=gets.blog_articlecut%>" name="blog_articlecut">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">删除分类后日志转移</label>
                        <div class="col-sm-10">
                            <select name="blog_categoryremove" class="form-control">
                            	<option value="0" <%=gets.blog_categoryremove === 0 ? 'selected': ''%>>转移到系统垃圾箱</option>
                            	<option value="1" <%=gets.blog_categoryremove === 1 ? 'selected': ''%>>直接将该分类下日志删除</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">删除分类后子分类转移</label>
                        <div class="col-sm-10">
                            <select name="blog_categoryremovechild" class="form-control">
                            	<option value="0" <%=gets.blog_categoryremovechild === 0 ? 'selected': ''%>>子分类转化为顶级分类</option>
                            	<option value="1" <%=gets.blog_categoryremovechild === 1 ? 'selected': ''%>>直接将子分类删除</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">云端博客圈日志共享</label>
                        <div class="col-sm-10">
                            <select name="blog_article_cloud_notice" class="form-control">
                            	<option value="0" <%=gets.blog_article_cloud_notice === 0 ? 'selected': ''%>>关闭</option>
                            	<option value="1" <%=gets.blog_article_cloud_notice === 1 ? 'selected': ''%>>开启</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-4 col-sm-offset-2">
                            <button class="btn btn-primary" type="submit">保存内容</button>
                            <button class="btn btn-white" type="reset">取消</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>