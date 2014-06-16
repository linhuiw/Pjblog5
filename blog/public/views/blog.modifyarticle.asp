<script type="text/javascript" charset="utf-8" src="appjs/assets/ueditor/ueditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="appjs/assets/ueditor/ueditor.all.min.js"></script>
<script type="text/javascript" charset="utf-8" src="appjs/assets/ueditor/lang/zh-cn/zh-cn.js"></script>
<%
;(function( dbo, conn, fs, fns, http, m, t ){
	var id = http.query("id"),
		category = require("public/services/category"),
		tags = require("public/services/tag"),
		tag = new tags(),
		categoryModule,
		categorys,
		categoryList,
		arc = {
			id: 0,
			art_title: '',
			art_des: '',
			art_category: '',
			art_content: '',
			art_tags: '',
			art_tname: '',
			art_cover: '',
			art_tdes: ''
		};
	
	category = new category();
	categoryModule = category.list();	
	categorys = categoryModule.k;
	categoryList = categoryModule.s;
	
	if ( !id || id.length === 0 ){ id = 0; };
	id = Number(id);

	if ( id > 0 ){
		(function( rec ){
			rec
				.sql("Select * From blog_articles Where id=" + id)
				.process(function(object){
					if ( !object.Bof && !object.Eof ){
						arc.id = id;
						arc.art_title = object('art_title').value;
						arc.art_des = object('art_des').value;
						arc.art_category = object('art_category').value;
						arc.art_content = object('art_content').value;
						arc.art_tags = object('art_tags').value;
						arc.art_tname = object('art_tname').value;
						arc.art_cover = object('art_cover').value;
						arc.art_tdes = object('art_tdes').value;
					}
				});
		})( new dbo.RecordSet(conn) );
	};
%>
<form action="public/async.asp?m=article&p=save" method="post" id="postArticle">
<input type="hidden" value="<%=arc.id%>" name="id" />
<input type="hidden" value="<%=arc.art_tags%>" name="art_tags" />
<input type="hidden" value="<%=arc.art_category%>" name="art_category" />
<input type="hidden" value="<%=arc.art_cover%>" name="art_cover" />
<div id="articles">
	<div class="list">
    	<div class="list-container">
        	<div class="list-top">
                <i class="fa fa-slack"></i> 模式 : <span><%=id > 0 ? "编辑" : "添加"%></span>
            </div>
        </div>
    </div>
    <div class="arc-title"><input type="text" name="art_title" value="<%=arc.art_title%>" placeholder="标题" class="col-x-4" /></div>
    <div class="arc-content clearfix">
    	<div class="mon-left">
            <div class="arc-des"><textarea name="art_des" placeholder="日志预览内容简述.."><%=arc.art_des%></textarea></div>
            <div class="arc-html"><textarea name="art_content" id="editor" style="width:100%;height:500px;"><%=arc.art_content%></textarea></div>
        </div>
        <div class="tool">
        	<div class="pannel">
                <h6><i class="fa fa-save"></i> 保存日志</h6>
                <input type="button" value="点击这里 保存这篇日志到数据库（<%=id > 0 ? "更新" : "添加"%>）" style="margin-left:37px;" id="submit" />
            </div>
        	<div class="pannel">
                <h6><i class="fa fa-image"></i> 日志封面</h6>
                <div class="photo">
                	<img src="<%=arc.art_cover%>" onerror="this.src='public/assets/img/face.jpg'" id="cover" />
                    <a href="javascript:;" id="upload"><i class="fa fa-cloud-upload"></i> 上传封面</a>
                </div>
            </div>
        	<div class="pannel">
                <h6><i class="fa fa-tags"></i> 日志标签</h6>
                <div class="tags">
                	<%
					
						if ( arc.art_tags && arc.art_tags.length > 0 ){
							arc.art_tags = arc.art_tags.replace(/^\{/, "").replace(/\}$/, "").split("}{");
							if ( arc.art_tags.length > 0 ){
								for ( var o = 0 ; o < arc.art_tags.length ; o++ ){
									var name = tag.read(arc.art_tags[o]);
									if ( name && name.length > 0 )	{
					%>
                    <div class="item"><span contenteditable="true"><%=name%></span><a href="javascript:;"><i class="fa fa-times"></i></a></div>
                    <%
									}
								}
							}
						};
					%>
                </div>
                <div class="tag-action">
                	<a href="javascript:;" id="addTags"><i class="fa fa-plus"> 添加</i></a>
                </div>
            </div>
        	<div class="pannel">
                <h6><i class="fa fa-share-alt"></i> 别名描述</h6>
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                	<tr>
                    	<td width="50" align="right"><i class="fa fa-angle-right"></i> 别名：</td>
                        <td><input type="text" name="art_tname" value="<%=arc.art_tname%>" class="col-x-2" /></td>
                    </tr>
                    <tr>
                    	<td width="50" align="right"><i class="fa fa-angle-right"></i> 描述：</td>
                        <td><input type="text" name="art_tdes" value="<%=arc.art_tdes%>" class="col-x-3" /></td>
                    </tr>
                </table>
            </div>
            <div class="pannel">
                <h6><i class="fa fa-xing-square"></i> 日志分类 <span>(点击白色区块选择你的分类)</span></h6>
                <ul class="root clearfix">
                    <%
                        ;(function(categoryList){
                            for ( var i in categoryList ){
                    %>
                    <li class="root">
                        <div class="root setCate"><%=categoryList[i].name%></div>
                        <ul class="child clearfix">
                        <%
                            for ( var j in categoryList[i].items ){
								if ( arc.art_category === Number(j) ){
						%>
                        	<li><a href="javascript:;" class="child setCate current" app-cate="<%=j%>"><%=categoryList[i].items[j]%></a></li>
                        <%			
								}else{
                        %>
                            <li><a href="javascript:;" class="child setCate" app-cate="<%=j%>"><%=categoryList[i].items[j]%></a></li>
                        <%	
								}
                            }
                        %>
                        </ul>
                    </li>
                    <%		
                            }
                        })(categoryList);
                    %>
                </ul>
            </div>
        </div>
    </div>
</div>
</form>
<%
})( dbo, conn, fs, fns, http, m, t );
%>
