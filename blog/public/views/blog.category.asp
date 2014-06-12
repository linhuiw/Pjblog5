<div class="clearfix" id="category">
	<div class="clearfix" id="cateTitle">
    	<div class="icon fleft">图标</div>
        <div class="name fleft">分类名</div>
        <div class="des fleft">分类说明</div>
        <div class="out fleft">外链？</div>
        <div class="outip fleft">外链地址</div>
        <div class="tool fright">操作</div>
    </div>
    <div class="dd dd-draghandle">
        <ol class="dd-list" id="first">
<%
(function(){
	var icons = [];
	fs.fileList(contrast("private/icons"), function(name){ icons.push(name); });
	LoadJscript(function(icons){
		window.icons = icons;
	}, icons);
	
	var rec = new dbo.RecordSet(conn);
	rec
		.sql("Select * From blog_categorys Where cate_parent=0 Order By cate_order ASC")
		.open(1)
		.each(function(object){
%>
			<li class="dd-item dd2-item" app-id="<%=object("id").value%>">
                <div class="dd-handle dd2-handle"><img src="private/icons/<%=object("cate_icon").value%>" /></div>
                <div class="dd2-content clearfix">
                	<div class="cate_tool">
                    	<%if ( !object("cate_outlink").value ){%><a href="javascript:;" class="app-add"><i class="fa fa-plus"></i></a><%}%>
                    	<a href="javascript:;" app-icon="<%=object("cate_icon").value%>" class="app-icon"><i class="fa fa-image"></i></a>
                    	<a href="javascript:;"><i class="fa fa-pencil-square-o"></i></a>
                    	<a href="javascript:;" class="app-delete"><i class="fa fa-trash-o"></i></a>
                    </div>
					<div class="cate_name"><%=object("cate_name").value%></div>
                    <div class="cate_des wordCut"><%=object("cate_des").value%></div>
                    <div class="cate_out">
                    	<%
							if ( object("cate_outlink").value ){
								Library.log('<i class="fa fa-check"></i>');
							}else{
								Library.log('<i class="fa fa-times"></i>');
							}
						%>
                    </div>
                    <div class="outip"><%=object("cate_src").value%></div>
                </div>
                <%
					var rs = new dbo.RecordSet(conn);
					rs
						.sql("Select * From blog_categorys Where cate_parent=" + object("id").value + " Order By cate_order ASC")
						.process(function(object){
							if ( !object.Bof && !object.Eof ){
%>
				<ol class="dd-list">
<%
								this.each(function(obj){
%>
					<li class="dd-item dd2-item" app-id="<%=obj("id").value%>">
                        <div class="dd-handle dd2-handle"><img src="private/icons/<%=obj("cate_icon").value%>" /></div>
                        <div class="dd2-content clearfix">
                        	<div class="cate_tool">
                            	<a href="javascript:;" app-icon="<%=obj("cate_icon").value%>" class="app-icon"><i class="fa fa-image"></i></a>
                            	<a href="javascript:;"><i class="fa fa-pencil-square-o"></i></a>
                            	<a href="javascript:;" class="app-delete"><i class="fa fa-trash-o"></i></a>
                            </div>
							<div class="cate_name"><%=obj("cate_name").value%></div>
                    		<div class="cate_des wordCut"><%=obj("cate_des").value%></div>
                            <div class="cate_out">
                            	<%
									if ( obj("cate_outlink").value ){
										Library.log('<i class="fa fa-check"></i>');
									}else{
										Library.log('<i class="fa fa-times"></i>');
									}
								%>
                            </div>
                            <div class="outip"><%=obj("cate_src").value%></div>
                       	</div>
                    </li>
<%	
								});
%>                
                </ol>
<%								
							}
						});
				%>
            </li>
<%			
		})
		.close();
})();
%>
        </ol>            
    </div>
    <div class="sortSubmit">
    	<button id="addNewCategoryByRoot"><i class="fa fa-plus"></i> 添加新根分类</button>
    	<button><i class="fa fa-save"></i> 保存排序</button>
    </div>
</div>