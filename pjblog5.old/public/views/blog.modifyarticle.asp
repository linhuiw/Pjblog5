<script type="text/javascript" charset="utf-8" src="appjs/assets/ueditor/ueditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="appjs/assets/ueditor/ueditor.all.min.js"></script>
<script type="text/javascript" charset="utf-8" src="appjs/assets/ueditor/lang/zh-cn/zh-cn.js"></script>
<%
;(function( dbo, conn, fs, fns, http, m ){
	// 获取模块
	var categoryModule = require("public/services/category");
		categoryModule.add("dbo", dbo);
		categoryModule.add("conn", conn);
		
	var category = new categoryModule();
	
	// 处理数据
	var categorys = category.list();
	var categoryIndexs = categorys.k;
	var categoryQueens = categorys.s;
	
	var id = Number(http.query("id") || 0),
		arc = {
			id: id,
			art_title: "",
			art_des: "",
			art_category: 0,
			art_content: "",
			art_tags: "",
			art_cover: ""
		};;
		
	var tags = require("public/services/tag"),
		tag = new tags();
	
	(function( rec ){
		rec
			.sql("Select * From blog_articles Where id=" + id)
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					arc.id = id;
					arc.art_title = object("art_title").value;
					arc.art_des = object("art_des").value;
					arc.art_category = object("art_category").value;
					arc.art_content = object("art_content").value;
					arc.art_tags = object("art_tags").value;
					arc.art_cover = object("art_cover").value;
				}
			});
	})( new dbo.RecordSet(conn) );
	
	function ResponseCategorys(){
%>
<ul>
<%
		for ( var i in categoryQueens ){
%>
	<li>
    	<a href="javascript:;" class="wordCut setCate <%=arc.art_category === Number(i) ? "active" : ""%>" app-cate="<%=i%>"><i class="fa <%=categoryQueens[i].icon%>"></i><%=categoryQueens[i].name%></a>
        <%
			if ( categoryQueens[i].items ){
		%>
        <ul>
        <%
				for ( var j in categoryQueens[i].items ){
		%>
        	<li><a href="javascript:;" class="wordCut setCate <%=arc.art_category === Number(j) ? "active" : ""%>" app-cate="<%=j%>"><i class="fa <%=categoryQueens[i].items[j].icon%>"></i><%=categoryQueens[i].items[j].name%></a></li>
        <%		
				}
		%>
        </ul>
        <%	
			}
		%>
    </li>
<%		
		}	
%>
</ul>
<%
	};
%>
<div id="artlist">
	<div class="art-side">
        <div class="art-cate-zone">
        <%ResponseCategorys();%>
        </div>
    </div>
    <div class="art-wrap">
    	<div class="art-zone">
        	<form action="public/async.asp?m=article&p=save" method="post" id="postArticle">
            <input type="hidden" value="<%=arc.id%>" name="id" />
            <input type="hidden" value="<%=arc.art_tags%>" name="art_tags" />
            <input type="hidden" value="<%=arc.art_category%>" name="art_category" />
            <input type="hidden" value="<%=arc.art_cover%>" name="art_cover" />
    		<div class="dc-title"><input type="text" name="art_title" value="<%=arc.art_title%>" placeholder="标题" class="col-x-4" /></div>
            <div class="dc-des">
            	<textarea name="art_des" style="width:100%;min-height:100px;" placeholder="写入日志预览内容.."><%=arc.art_des%></textarea>
            </div>
            <div class="dc-html">
            	<textarea id="editor" name="art_content" style="width:100%;min-height:500px;">
				<%=arc.art_content.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;")%>
                </textarea>
            </div>
            <div class="dc-tags">
            	<div class="tag-title"><i class="fa fa-tags"></i>日志标签</div>
            	<div class="tags clearfix">
                	<%
					
						if ( arc.art_tags && arc.art_tags.length > 0 ){
							arc.art_tags = arc.art_tags.replace(/^\{/, "").replace(/\}$/, "").split("}{");
							if ( arc.art_tags.length > 0 ){
								for ( var o = 0 ; o < arc.art_tags.length ; o++ ){
									var name = tag.read(arc.art_tags[o]);
									if ( name && name.length > 0 )	{
					%>
                    <div class="tag-item">
                    	<input type="text" value="<%=name%>" class="tag-input" placeholder="新建标签" />
                        <i class="fa fa-close"></i>
                    </div>
                    <%
									}
								}
							}
						};
					%>
                </div>
                <div class="tag-action"><input type="button" value="添加标签" id="addTags" /></div>
            </div>
            <div class="dc-submit">
            	<input type="button" value="保存日志" class="submit" id="submit" />
            </div>
            </form>
    	</div>
    </div>
</div>
<%
})( dbo, conn, fs, fns, http, m );
%>
