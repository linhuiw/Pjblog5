<%
modules.scriptExec(function( ms ){
	window.pid = ms.pid;
}, {pid: pid});
%>
<div class="row">
  <div class="col-lg-10 col-md-10 col-sm-6 col-xs-6">
    <button type="button" class="btn btn-primary ShowForm" data-toggle="modal" data-target=".editpanel">添加友情链接</button>
  </div>
  <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
    <div class="btn-group pull-right">
      <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown">
    	筛选友情链接 <span class="caret"></span>
	  </button>
      <ul class="dropdown-menu">
        <li class="text-right"><a href="javascript:;" class="filter" action="1">已通过审核的链接</a></li>
        <li class="text-right"><a href="javascript:;" class="filter" action="2">未通过审核的链接</a></li>
        <li class="divider"></li>
        <li class="text-right"><a href="javascript:;" class="filter" action="3">允许模块展示的链接</a></li>
        <li class="text-right"><a href="javascript:;" class="filter" action="4">禁止模块展示的链接</a></li>
        <li class="divider"></li>
        <li class="text-right"><a href="javascript:;" class="filter" action="0">显示全部友情链接</a></li>
      </ul>
    </div>
  </div>
</div>
<div class="row">
<%
;(function(){
	for (var i=0; i<list.length; i++) {
%>
  <div class="col-md-4 blogLink" hide="<%=list[i].link_hide%>" index="<%=list[i].link_index%>">
	<div class="items">
	  <img class="pull-left" src="<%=list[i].link_icon%>" onerror="this.src='<%=icon%>'" app-img="<%=list[i].link_icon%>" />
	  <div>
		<div class="name"><%=list[i].link_name%></div>
        <div class="src"><a href="<%=list[i].link_src%>" target="_blank"><%=list[i].link_src%></a></div>
      </div>
      <div>
		<div class="des"><%=list[i].link_des%></div>
        <div class="tools">
        	<%if ( list[i].link_hide ){%>
        	<a href="javascript:;" appid="<%=list[i].id%>" class="AutoSend" title="审核通过该友情链接" method="pass">
            	<i class="fa fa-check"></i> 通过</a>
            <%}else{%>
            <a href="javascript:;" appid="<%=list[i].id%>" class="AutoSend" title="取消审核通过该友情链接" method="unpass">
            	<i class="fa fa-times"></i> 禁用</a>
            <%};%>
            <%if ( list[i].link_index ){%>
            <a href="javascript:;" appid="<%=list[i].id%>" class="AutoSend" title="取消首页显示该友情链接" method="unindex">
            	<i class="fa fa-link"></i> 取消</a>
            <%}else{%>
            <a href="javascript:;" appid="<%=list[i].id%>" class="AutoSend" title="允许首页显示该友情链接" method="index">
            	<i class="fa fa-link"></i> 置顶</a>
            <%};%>
            <a href="javascript:;" appid="<%=list[i].id%>" class="AutoSend" title="删除该友情链接" method="remove">
            	<i class="fa fa-trash-o"></i> 删除</a>
            <a href="javascript:;" appid="<%=list[i].id%>" class="EditForm" method="edit" data-toggle="modal" data-target=".editpanel">
            	<i class="fa fa-gear"></i> 编辑</a>
        </div>
	  </div>
    </div>
  </div>
<%	
	}
})();
%>
</div>

<!--编辑对话框-->
<div class="modal editpanel" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="link-dialog-title">添加友情链接</h4>
      </div>
      <div class="modal-body">
        <form class="form-horizontal" action="<%=iPress.setURL("async", "PluginRequestJSON", { t: pid, m: "post" })%>" method="post" id="linkform">
          <input type="hidden" name="link_id" id="link_id" />
          <div class="form-group">
            <label class="col-sm-2 control-label">网站名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="link_name" id="link_name">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">网站地址</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="link_src" id="link_src">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">网站图标</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="link_icon" id="link_icon">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">网站描述</label>
            <div class="col-sm-9">
              <textarea class="form-control" name="link_des" id="link_des" rows="5"></textarea>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button type="submit" class="btn btn-primary">保存友情链接</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>