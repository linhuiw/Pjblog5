<form action="<%=iPress.setURL("async", "article", { m: "save" })%>" method="post" class="ajax-form">
<input type="hidden" name="id" value="<%=article.id || 0%>" />
<input type="hidden" name="art_draft" value="0" />
<input type="hidden" name="art_cover" value="" />
<div class="iPress-wrap">
	<div class="row">
    	<div class="col-lg-12">
            <div class="title"><input type="text" class="form-control" name="art_title" placeholder="日志标题" value="<%=article.art_title || ""%>" /></div>
        </div>
    </div>
    <div class="row write-box">
    	<div class="col-lg-12">
        	<!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
              <li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab">日志内容</a></li>
              <li role="presentation"><a href="#profile" role="tab" data-toggle="tab">分类摘要</a></li>
              <li role="presentation"><a href="#messages" role="tab" data-toggle="tab">SEO 设置</a></li>
              <li role="presentation"><a href="#settings" role="tab" data-toggle="tab">其他设置</a></li>
            </ul>
            
            <!-- Tab panes -->
            <div class="tab-content">
              <div role="tabpanel" class="tab-pane active" id="home">
              		<div class="write-content">
                    	<div class="loading">正在加载编辑器，请稍后...</div>
                    	<textarea id="editor" name="art_content" style="width:100%;min-height:500px;" class="hide"><%=(article.art_content || "").replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;")%></textarea>
                    </div>
              </div>
              <div role="tabpanel" class="tab-pane" id="profile">
              	<div style="padding:10px 15px;">
              		<div class="row">
                    	<div class="col-sm-5 categorys">
                        	<ul>
								<%
                                    categorys.queens.forEach(function( cate ){
                                        var detail = categorys.indexs[cate.id + ''];
                                %>
                                <li>
                                    <label for="cate_<%=detail.id%>">
                                    	<input type="radio" value="<%=detail.id%>" name="art_category" id="cate_<%=detail.id%>" <%=(article.art_category || 0) === detail.id ? "checked": ""%> />
                                        <i class="fa <%=detail.cate_icon%>"></i><%=detail.cate_name%>
                                    </label>
                                    <%
                                        if ( cate.items && cate.items.length > 0 ){
                                    %>
                                    <ul>
                                        <%
                                            cate.items.forEach(function(_id){
                                                var o = categorys.indexs[_id];
                                        %>
                                        <li>
                                        <label for="cate_<%=o.id%>">
                                            <input type="radio" value="<%=o.id%>" name="art_category" id="cate_<%=o.id%>" <%=(article.art_category || 0) === o.id ? "checked": ""%> />
                                            <i class="fa <%=o.cate_icon%>"></i><%=o.cate_name%>
                                        </label>
                                        </li>
                                        <%		
                                            });
                                        %>
                                    </ul>
                                    <%		
                                        }
                                    %>
                                </li>
                                <%		
                                    });
                                %>
                            </ul>
                        </div>
                        <div class="col-sm-7">
                        	<div class="des_title"><i class="fa fa-rss"></i> 编写日志摘要</div>
                        	<textarea name="art_des" style="width:100%;min-height:250px;" placeholder="写入日志预览内容.." id="write-des" class="form-control"><%=article.art_des || ""%></textarea>
                            <p style="color:#ccc; padding-top:10px;"><i class="fa fa-volume-up"></i> 日志摘要会显示在你的首页，作为预览文章的文字。</p>
                        </div>
                    </div>
                 </div>
              </div>
              <div role="tabpanel" class="tab-pane" id="messages">
              	<div class="row form-horizontal" style="padding:10px 30px;">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">日志关键字</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="<%=article.art_tname || ""%>" name="art_tname">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-sm-2 control-label">日志SEO描述</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" value="<%=article.art_tdes || ""%>" name="art_tdes">
                        </div>
                    </div>
                 </div>
              </div>
              <div role="tabpanel" class="tab-pane" id="settings">
              	<div style="padding:10px 15px;">
                	<div class="tags-title"><i class="fa fa-tags"></i> 请输入你的标签：</div>
                    <%
						var tags = article.art_tags, tagInputs = [];
						tags.forEach(function(o){
							tagInputs.push(o.tag_name);
						});
					%>
              		<input type="text" name="art_tags" data-role="tagsinput" value="<%=tagInputs.join(',')%>" />
                </div>
              </div>
            </div>
        </div>
        
        <div class="col-lg-12 submitzone">
            <div class="form-group">
                <button class="btn btn-primary" type="submit">保存内容</button>
            </div>
        </div>
    </div>
</div>
</form>