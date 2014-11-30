<div id="category">
	<div id="cateTitle">
    	<div class="icon fleft">图标</div>
        <div class="name fleft">分类名</div>
        <div class="des fleft hide-des">分类说明</div>
        <div class="out fleft hide-out">外链？</div>
        <div class="outip fleft hide-ip">外链地址</div>
        <div class="tool fright">操作</div>
    </div>
    <div class="dd dd-draghandle">
        <ol class="dd-list" id="first">
<%
(function(){
	var rootCategorys = [];
	
	var rec = new dbo.RecordSet(conn);
	rec
		.sql("Select * From blog_categorys Where cate_parent=0 Order By cate_order ASC")
		.open(1)
		.each(function(object){
			rootCategorys.push({
				id: object("id").value,
				name: object("cate_name").value
			});
%>
			<li class="dd-item dd2-item" app-id="<%=object("id").value%>">
                <div class="dd-handle dd2-handle"><span class="fa <%=object("cate_icon").value%> track"></span></div>
                <div class="dd2-content clearfix">
                	<div class="cate_tool">
                    	<%if ( !object("cate_outlink").value ){%><a href="javascript:;" class="app-add"><i class="fa fa-plus"></i></a><%}%>
                    	<a href="javascript:;" app-icon="<%=object("cate_icon").value%>" class="app-icon"><i class="fa fa-image"></i></a>
                    	<a href="javascript:;" class="app-modify"><i class="fa fa-pencil-square-o"></i></a>
                    	<a href="javascript:;" class="app-delete"><i class="fa fa-trash-o"></i></a>
                    </div>
					<div class="cate_name"><%=object("cate_name").value%></div>
                    <div class="cate_des wordCut hide-des"><%=object("cate_des").value%></div>
                    <div class="cate_out hide-out">
                    	<%
							if ( object("cate_outlink").value ){
								Library.log('<i class="fa fa-check"></i>');
							}else{
								Library.log('<i class="fa fa-times"></i>');
							}
						%>
                    </div>
                    <div class="outip hide-ip"><%=object("cate_src").value%></div>
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
                        <div class="dd-handle dd2-handle"><span class="fa <%=obj("cate_icon").value%> track"></span></div>
                        <div class="dd2-content clearfix">
                        	<div class="cate_tool">
                            	<a href="javascript:;" app-icon="<%=obj("cate_icon").value%>" class="app-icon"><i class="fa fa-image"></i></a>
                            	<a href="javascript:;" class="app-modify"><i class="fa fa-pencil-square-o"></i></a>
                            	<a href="javascript:;" class="app-delete"><i class="fa fa-trash-o"></i></a>
                            </div>
							<div class="cate_name"><%=obj("cate_name").value%></div>
                    		<div class="cate_des wordCut hide-des"><%=obj("cate_des").value%></div>
                            <div class="cate_out hide-out">
                            	<%
									if ( obj("cate_outlink").value ){
										Library.log('<i class="fa fa-check"></i>');
									}else{
										Library.log('<i class="fa fa-times"></i>');
									}
								%>
                            </div>
                            <div class="outip hide-ip"><%=obj("cate_src").value%></div>
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
		LoadJscript(function(rootCategorys){ window.rootCategorys = rootCategorys; }, rootCategorys);
})();
%>
        </ol>            
    </div>
    <div class="sortSubmit">
    	<button id="addNewCategoryByRoot"><i class="fa fa-plus"></i> 添加新根分类</button>
    	<button id="savesort"><i class="fa fa-save"></i> 保存排序</button>
    </div>
</div>