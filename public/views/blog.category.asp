<div class="alert alert-info alert-block">
  <button type="button" class="close" data-dismiss="alert">×</button>
  <h4><i class="fa fa-bell-alt"></i>导航分类页面提醒：</h4>
  <p>1. 拖动色块可以进行排序，排序完毕请点击保存排序按钮。</p>
<%
  	var GlobalCache = require("private/chips/" + blog.cache + "blog.global");
	if ( GlobalCache.blog_categoryremove === 0 ){
%>
  <p>2. 本站开启了 删除分类后日志转移到系统默认垃圾箱 功能</p>
<%	
	}else if ( GlobalCache.blog_categoryremove === 1 ) {
%>
  <p>2. 本站开启了 删除分类后直接将该分类下日志删除 功能。</p>
<%		
	};
	if ( GlobalCache.blog_categoryremovechild === 0 ){
%>
  <p>3. 本站开启了 删除分类后子分类转化为顶级分类 功能。</p>
<%	
	}else if ( GlobalCache.blog_categoryremovechild === 1 ){
%>
  <p>3. 本站开启了 删除分类后直接将子分类删除 功能。</p>
<%	
	}
%>
</div>
<div style="margin-bottom:10px;">
      <button class="btn btn-success" id="addNewCategoryByRoot" style="margin-right:6px;"><i class="fa fa-plus"></i> 添加新根分类</button>
      <button class="btn btn-info" id="savesort"><i class="fa fa-save"></i> 保存排序</button>
</div>
<%
;function Categorys( parent, callback ){
	var rec = new dbo.RecordSet(conn);
	rec.sql("Select * From blog_categorys Where cate_parent=" + parent + " Order By cate_order ASC")
	   .process(function(object){
	   		if ( !object.Bof && !object.Eof ){
				this.each(callback);
			}
	   });
};

function setCategorys(object, callback){
	var outs = {};
	for ( var i = 0 ; i < object.fields.count; i++ ){
		outs[object.fields(i).name] = object(object.fields(i).name).value;
	};
	if ( callback && typeof callback === "function" ){
		var x = callback(outs);
		if ( x ){ outs = x; };
	};
	return outs;
}

function setIcons(icon){
	var h = "<ul>";
	for ( var i = 0 ; i < icons.length ; i++ ){
		h +=	"<li></li>"
	}
	 	h +="</ul>"
}

var category = [],
	icons = [];

Categorys(0, function(object){
	setCategorys(object, function(msg){
		var a = [];
		Categorys(msg.id, function(obj){
			a.push(setCategorys(obj));
		});
		msg.childs = a;
		category.push(msg);
	});
});

fs.fileList(contrast("private/icons"), function(name){ icons.push(name); });
LoadJscript(function(icons){ window.icons = icons; }, icons);

if ( category.length === 0 ){
%>
<div class="alert alert-danger">
  <button type="button" class="close" data-dismiss="alert">×</button>
  <i class="fa fa-ban-circle"></i><strong>提示：</strong> 没有找到分类数据</div>
<%}else{%>
<div class="dd col-lg-12" id="nestable2" style="display:none;">
  <ol class="dd-list list-group gutter list-group-lg list-group-sp sortable">
<%
	for ( var i = 0 ; i < category.length ; i++ ){
%>
    <li class="dd-item" data-id="<%=category[i].id%>">
      <div class="dd-handle bg-info"> 
      	<span class="pull-right">
        	<a href="#" data-toggle="tooltip" data-placement="top" data-original-title="在这个分类下新增子分类" class="doadd <%=!category[i].cate_outlink ? "" : "hide"%>"><i class="fa fa-plus fa-fw m-r-xs"></i></a> 
            <a href="javascript:;" class="app-icon" app-icon="<%=category[i].cate_icon%>"><i class="fa fa-picture-o fa-fw m-r-xs"></i></a>
            <a href="#" data-toggle="tooltip" data-placement="top" data-original-title="编辑这个分类" class="app-modify"><i class="fa fa-pencil fa-fw m-r-xs"></i></a> 
            <a href="#" data-toggle="tooltip" data-placement="top" data-original-title="删除这个分类"><i class="fa fa-times fa-fw"></i></a> 
        </span> 
        <span class="pull-left media-xs"><i class="fa fa-sort text-muted fa m-r-sm"></i> <img src="private/icons/<%=category[i].cate_icon%>"></span>
        <div class="dd-item-content"><%=category[i].cate_name%></div>
      </div>
<%
		if ( category[i].childs && category[i].childs.length > 0 ){
%>
      <ol class="dd-list">
<%
			for ( var j = 0 ; j < category[i].childs.length ; j++ ){
%>
        <li class="dd-item" data-id="<%=category[i].childs[j].id%>">
          <div class="dd-handle bg-primary"> 
          	<span class="pull-right"> 
            	<a href="#" class="app-icon" app-icon="<%=category[i].childs[j].cate_icon%>"><i class="fa fa-picture-o fa-fw m-r-xs"></i></a> 
                <a href="#" data-toggle="tooltip" data-placement="top" data-original-title="编辑这个分类"><i class="fa fa-pencil fa-fw m-r-xs"></i></a> 
                <a href="#" data-toggle="tooltip" data-placement="top" data-original-title="删除这个分类"><i class="fa fa-times fa-fw"></i></a> 
            </span> <span class="pull-left media-xs"><i class="fa fa-sort text-muted fa m-r-sm"></i> <img src="private/icons/<%=category[i].childs[j].cate_icon%>"></span>
            <div class="dd-item-content"><%=category[i].childs[j].cate_name%></div>
          </div>
        </li>
<%
			};
%>
      </ol>
<%
		};
%>
    </li>
<%
	};
%>
  </ol>
</div>
<%};%>