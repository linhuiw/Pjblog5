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
	  	<div class="category"><i class="fa fa-arrows-alt"></i>{cate_name}</div>
	  	<ol class="{nodrop}" data-parent="{cate_parent}" data-order="{cate_order}" data-count="{count}" data-id="{id}" data-out="{cate_outlink}">{childrens}</ol>
	</li>
</script>
<script type="text/html" id="category-template-child">
	<li data-parent="{cate_parent}" data-order="{cate_order}" data-id="{id}" data-out="{cate_outlink}"><div class="category"><i class="fa fa-arrows-alt"></i>{cate_name}</div></li>
</script>

<div class="iPress-wrap">
<div class="row">
	<div class="col-lg-12">
		<div class="ibox float-e-margins">
		    <div class="ibox-title">
		        <h5>分类导航管理</h5>
		        <div class="ibox-tools">
                    <a class="collapse-link"><i class="fa fa-plus"></i></a>
                    <a class="collapse-link"><i class="fa fa-save"></i></a>
                    <a class="collapse-link" id="refresh"><i class="fa fa-refresh"></i></a>
                </div>
		    </div>
		    <div class="ibox-content">
		    	<p>拖动排序后别忘记保存哦！</p>
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