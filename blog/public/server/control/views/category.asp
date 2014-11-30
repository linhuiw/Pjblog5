<%
modules.scriptExec(function( data ){
	window.modules.category = data;
}, {
	url: iPress.setURL('async', 'category', { m: 'getdata' }),
	setParent: iPress.setURL('async', 'category', { m: 'setparent' })
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
					<a class="collapse-link" href="javascript:;"><i class="fa fa-plus"></i></a>
					<a class="collapse-link" href="javascript:;"><i class="fa fa-pencil"></i></a>
					<a class="collapse-link" href="javascript:;"><i class="fa fa-close"></i></a>
	  			</div>
	  		</div>
	  	</div>
	  	<ol class="{nodrop}" data-parent="{cate_parent}" data-order="{cate_order}" data-count="{count}" data-id="{id}" data-out="{cate_outlink}">{childrens}</ol>
	</li>
</script>
<script type="text/html" id="category-template-child">
	<li data-parent="{cate_parent}" data-order="{cate_order}" data-id="{id}" data-out="{cate_outlink}">
		<div class="category">
			<div class="row">
	  			<div class="col-md-1 handlemove text-right"><i class="fa {cate_icon}"></i></div>
	  			<div class="col-md-4">{cate_name}</div>
	  			<div class="col-md-5">{cate_des}</div>
	  			<div class="col-md-2 text-right action">
					<a class="collapse-link" href="javascript:;"><i class="fa fa-pencil"></i></a>
					<a class="collapse-link" href="javascript:;"><i class="fa fa-close"></i></a>
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
                    <a class="collapse-link"><i class="fa fa-plus"></i></a>
                    <a class="collapse-link" id="refresh"><i class="fa fa-refresh"></i></a>
                </div>
		    </div>
		    <div class="ibox-content">
		    	<div style="padding: 20px 15px; background-color: #f3f6fb;">
			    	<ol>
			    		<li>12323</li>
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