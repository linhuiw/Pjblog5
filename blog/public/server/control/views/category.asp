<%
modules.scriptExec(function( data ){
	window.modules.category = data;
}, {
	url: iPress.setURL('async', 'category', { m: 'getdata' })
})
%>

<script type="text/html" id="category-template-root">
	<li>
	  	<div class="category"><i class="fa fa-arrows-alt"></i>{name}</div>
	  	<ol></ol>
	</li>
</script>
<script type="text/html" id="category-template-child">
	<li><div class="category"><i class="fa fa-arrows-alt"></i>{name}</div></li>
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
					  <div class="category"><i class="fa fa-arrows-alt"></i>Item 1</div>
					</li>
					<li>
					  <div class="category"><i class="fa fa-arrows-alt"></i>Item 2</div>
					</li>
					<li>
					  <div class="category"><i class="fa fa-arrows-alt"></i>Item 3</div>
					</li>
					<li>
					  <div class="category"><i class="fa fa-arrows-alt"></i>Item 4</div>
					  <ol>
					    <li><div class="category"><i class="fa fa-arrows-alt"></i>Item 3.1</div></li>
					    <li><div class="category"><i class="fa fa-arrows-alt"></i>Item 3.2</div></li>
					    <li><div class="category"><i class="fa fa-arrows-alt"></i>Item 3.3</div></li>
					    <li><div class="category"><i class="fa fa-arrows-alt"></i>Item 3.4</div></li>
					    <li><div class="category"><i class="fa fa-arrows-alt"></i>Item 3.5</div></li>
					    <li><div class="category"><i class="fa fa-arrows-alt"></i>Item 3.6</div></li>
					  </ol>
					</li>
					<li>
					  <div class="category"><i class="fa fa-arrows-alt"></i>Item 5</div>
					  <ol></ol>
					</li>
					<li>
					  <div class="category"><i class="fa fa-arrows-alt"></i>Item 6</div>
					</li>
				</ol>
		    </div>
		</div>
	</div>
</div>
</div>