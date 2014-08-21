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

function getColor(colors, i){
	return colors[i % colors.length];
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

var colors = ["success", "info", "primary", "warning", "danger"];
var _colors = ["danger", "warning", "primary", "info", "success"];

if ( category.length === 0 ){
%>
<div class="alert alert-danger">
  <button type="button" class="close" data-dismiss="alert">×</button>
  <i class="fa fa-ban-circle"></i><strong>提示：</strong> 没有找到分类数据</div>
<%}else{%>
<div class="timeline comment-list">

<article class="timeline-item active">
    <div class="timeline-caption">
      <div class="panel bg-primary lt no-borders">
        <div class="panel-body">
          <span class="timeline-icon"><i class="fa fa-warning time-icon bg-primary"></i></span> 
          <span class="timeline-date">导航分类提醒：</span>
          <div class="text-sm" style="margin-bottom:25px;">
<%
			var GlobalCache = require("private/chips/" + blog.cache + "blog.global");
			if ( GlobalCache.blog_categoryremove === 0 ){
%>
  			<p>1. 本站开启了 删除分类后日志转移到系统默认垃圾箱 功能</p>
<%	
			}else if ( GlobalCache.blog_categoryremove === 1 ) {
%>
  			<p>1. 本站开启了 删除分类后直接将该分类下日志删除 功能。</p>
<%		
			};
			if ( GlobalCache.blog_categoryremovechild === 0 ){
%>
  			<p>2. 本站开启了 删除分类后子分类转化为顶级分类 功能。</p>
<%	
			}else if ( GlobalCache.blog_categoryremovechild === 1 ){
%>
  			<p>2. 本站开启了 删除分类后直接将子分类删除 功能。</p>
<%	
			};
%>
          </div>
          <div class="m-t-sm timeline-action">
            <button class="btn btn-sm btn-default btn-bg" id="savesort"><i class="fa fa-save"></i> 保存排序</button>
          </div>
        </div>
      </div>
    </div>
</article>

<%
	for ( var i = 0 ; i < category.length ; i++ ){
%>
                    <article class="timeline-item alt comment-item">
                        <div class="timeline-caption">                
                          <div class="panel panel-default">
                          	<header class="panel-heading">                      
                                  <%=category[i].cate_name%>
                                  <span class="text-muted m-l-sm pull-right">
                                    <a href="javascript:;" class="app-icon fa fa-picture-o" app-icon="<%=category[i].cate_icon%>"></a>
                                    <a href="#" data-toggle="tooltip" data-placement="top" data-original-title="编辑这个分类" class="app-modify fa fa-pencil"></a> 
                                    <a href="#" data-toggle="tooltip" data-placement="top" data-original-title="删除这个分类" class="fa fa-times"></a>
                                  </span>
                                </header>
                            <div class="panel-body">  
                              <span class="arrow right"></span>
                              <span class="timeline-icon"><i class="fa <%=category[i].cate_icon%> time-icon bg-<%=getColor(colors, i)%>"></i></span>
                              <div class="text-sm"><%=category[i].cate_des%></div>
                            </div>
                          </div>
                        </div>
                        <div class="timeline-caption-childs"><div class="timeline-caption-childs-zone"><%
								if ( category[i].childs && category[i].childs.length > 0 ){
									for ( var j = 0 ; j < category[i].childs.length ; j++ ){
%>
						<div class="timeline-caption-childs-item pull-left"><i class="fa <%=category[i].childs[j].cate_icon%> time-icon bg-<%=getColor(_colors, j)%>"></i></div>
<%
									};
								};
%>
						<%if ( !category[i].cate_outlink ){%><div class="timeline-caption-childs-item pull-left"><i class="fa fa-plus time-icon inline-block bg-dark"></i></div><%};%>
                        </div></div>
                    </article>
<%
	};
%>
  <div class="timeline-footer"><a href="#" id="addNewCategoryByRoot"><i class="fa fa-plus time-icon inline-block bg-dark"></i></a></div>
</div>
<%};%>