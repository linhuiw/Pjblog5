<%
modules.scriptExec(function( data ){
	window.modules.category = data;
}, {
	url: iPress.setURL('async', 'category', { m: 'getdata' }),
	setParent: iPress.setURL('async', 'category', { m: 'setparent' }),
	addRootCategory: iPress.setURL('async', 'category', { m: 'insdata' }),
	saveIcon: iPress.setURL('async', 'category', { m: 'seticon' }),
	saveSort: iPress.setURL('async', 'category', { m: 'setsort' }),
	delData: iPress.setURL('async', 'category', { m: 'deldata' })
})
%>

<script type="text/html" id="category-template-root">
	<li data-parent="{cate_parent}" data-order="{cate_order}" data-count="{count}" data-id="{id}" data-out="{cate_outlink}">
	  	<div class="category">
	  		<div class="row">
	  			<div class="col-md-1 handlemove"><i class="fa {cate_icon}"></i></div>
	  			<div class="col-md-4">{cate_name}</div>
	  			<div class="col-md-5">{cate_des}</div>
	  			<div class="col-md-2 text-right action">
					<a class="collapse-link addCategory" href="javascript:;" data-id="{id}"><i class="fa fa-plus"></i></a>
					<a class="collapse-link saveData" href="javascript:;"><i class="fa fa-pencil"></i></a>
					<a class="collapse-link changeIcon" href="javascript:;" data-icon="{cate_icon}" data-id="{id}"><i class="fa fa-image"></i></a>
					<a class="collapse-link remove" href="javascript:;" data-id="{id}"><i class="fa fa-close"></i></a>
	  			</div>
	  		</div>
			<div class="row category-edit-row hide">
				<div class="col-md-1">&nbsp;</div>
				<div class="col-md-11 bors">
					<form method="post" class="form-horizontal" action="<%=iPress.setURL('async', 'category', {m: 'setdata'})%>">
						<input type="hidden" name="id" value="{id}" />
						<div class="form-group">
							<label class="col-sm-2 control-label">分类名</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_name}" name="cate_name">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">分类描述</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_des}" name="cate_des">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">外链</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_src}" name="cate_src">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">排序</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_order}" name="cate_order">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">&nbsp;</label>
							<div class="col-sm-10">
								<button class="btn btn-success edit-save"><i class="fa fa-save"></i> 保存</button>
								<button class="btn btn-danger edit-close"><i class="fa fa-close"></i> 关闭</button>
							</div>
						</div>
					</form>
				</div>
			</div>
	  	</div>
	  	<ol class="{nodrop}" data-parent="{cate_parent}" data-order="{cate_order}" data-count="{count}" data-id="{id}" data-out="{cate_outlink}">{childrens}</ol>
	</li>
</script><script type="text/html" id="category-template-child">
	<li data-parent="{cate_parent}" data-order="{cate_order}" data-id="{id}" data-out="{cate_outlink}">
		<div class="category">
			<div class="row">
	  			<div class="col-md-1 handlemove text-right"><i class="fa {cate_icon}"></i></div>
	  			<div class="col-md-4">{cate_name}</div>
	  			<div class="col-md-5">{cate_des}</div>
	  			<div class="col-md-2 text-right action">
					<a class="collapse-link saveData" href="javascript:;"><i class="fa fa-pencil"></i></a>
					<a class="collapse-link changeIcon" href="javascript:;" data-icon="{cate_icon}" data-id="{id}"><i class="fa fa-image"></i></a>
					<a class="collapse-link remove" href="javascript:;" data-id="{id}"><i class="fa fa-close"></i></a>
	  			</div>
	  		</div>
			<div class="row category-edit-row hide">
				<div class="col-md-1">&nbsp;</div>
				<div class="col-md-11 bors">
					<form method="post" class="form-horizontal" action="<%=iPress.setURL('async', 'category', {m: 'setdata'})%>">
						<input type="hidden" name="id" value="{id}" />
						<div class="form-group">
							<label class="col-sm-2 control-label">分类名</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_name}" name="cate_name">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">分类描述</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_des}" name="cate_des">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">外链</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_src}" name="cate_src">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">排序</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" value="{cate_order}" name="cate_order">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">&nbsp;</label>
							<div class="col-sm-10">
								<button class="btn btn-success edit-save"><i class="fa fa-save"></i> 保存</button>
								<button class="btn btn-danger edit-close"><i class="fa fa-close"></i> 关闭</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</li>
</script>

<div class="iPress-wrap">
<div class="row">
	<div class="col-lg-12">
		<div class="ibox float-e-margins">
		    <div class="ibox-title">
		        <h5>分类导航管理</h5>
		        <div class="ibox-tools">
                    <a class="collapse-link" id="addroot"><i class="fa fa-plus"></i></a>
<!--                    <a class="collapse-link" id="savesort"><i class="fa fa-save"></i></a>-->
                    <a class="collapse-link" id="refresh"><i class="fa fa-refresh"></i></a>
                </div>
		    </div>
		    <div class="ibox-content">
		    	<div style="padding: 20px 15px; background-color: #f3f6fb;">
			    	<ol>
			    		<li>请尽量使用现代浏览器浏览本页面，如遇到不能拖动问题，请更换浏览器。</li>
			    		<li>注意：无法将存在子分类的顶级分类移动到其他顶级分类作为子分类。</li>
			    		<li>无法将分类转移到外部链接的分类导航下。</li>
			    		<li>分类导航功能涉及到的环境比较复杂，请谅解这样的操作方式。</li>
			    	</ol>
		       </div>
				<ol class="nested_with_switch vertical" id="category-list">
					<li>
					  <div class="category">正在加载数据，请稍后</div>
					</li>
				</ol>
		    </div>
		</div>
	</div>
</div>
</div>