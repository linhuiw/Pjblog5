// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.onGroupModify();
			this.onSaveGroupLevels();
			$('.app-level-remove, .addGroups').data('callback', function(){
				setTimeout(function(){
					window.location.reload();
				}, 1000);
			});
			$('.app-group-remove').data('callback', function(){
				var tr = $(this).parents('tr:first');
				tr.remove();
			});
		},
		onSaveGroupLevels: function(){
			var that = this;
			$('.app-group-levels-save').on('click', function(){
				var td = $(this).parents('td:first');
				var elements = $(td).find('p input:checked');
				var id = $(this).attr('app-id');
				var val = [];
				elements.each(function(index, element) {
                    val.push(Number($(this).val()));
                });
				$.getJSON('public/async.asp', {
					m: 'level',
					p: 'SaveGroupRights',
					id: id,
					j: JSON.stringify(val)
				}, function(params){
					if ( params.success ){
						that.tip.success(params.message);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		onGroupModify: function(){
			var that = this;
			$('body').on('click', '.app-group-modify', function( params ){
				var id = $(this).attr('app-id'),
					_this = this;
					
				that.tip.loading();
				$.getJSON('public/async.asp', {
					m: 'level',
					p: 'getGroupMessage',
					id: id
				}, function( params ){
					if ( params.success ){
						that.onMakeGroupModifyBox(params);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		onMakeGroupModifyBox: function( params ){
			var that = this;
			var h = '<div class="setforms modifylevel"><form action="public/async.asp?m=level&p=modifyGroupByForm" method="post"><input type="hidden" name="id" value="' + params.id + '" />';
				h	+=	'<table cellpadding="0" cellspacing="0" width="100%" border="0">';
				h 	+=	'<tr><td width="50">组名</td><td><input type="text" name="code_name" value="' + params.name + '" class="col-x-3" /></td></tr>';
				h	+=	'<tr><td>&nbsp;</td><td><input type="submit" value="保存"  /><input type="button" value="关闭" class="close" /></td></tr>';
				h	+=	'</table>';
				h += '</form></div>';
			that.tip.center(h);
			$('.modifylevel .close').on('click', function(){
				that.tip.close();
			});
			$('.modifylevel form').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					that.tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});