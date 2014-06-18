// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.onResizeGroups();
			this.onAddNewLevel();
			this.onLevelModify();
			this.onChangeRights();
			this.onSaveRights();
			this.onLevelDelete();
			$('.group-list li').trigger('install');
		},
		onResizeGroups: function(){
			var that = this;
			$('body').on('install', '.group-list li', function(){
				var mark = $(this).attr('mark');
				window.groups[mark] && that.tmpGroupsLevels(window.groups[mark], mark);
			});
		},
		tmpGroupsLevels: function( data, mark ){
			var h = '';
			
			for ( var i = 0 ; i < window.levels.length ; i++ ){
				var marks = window.levels[i];
				h += '<div class="grouplevels">';
				h +=	'<span>' + marks + '</span>';
				if ( data[marks] ){
				h +=	'<a href="javascript:;" app-status="1"><i class="fa fa-play"></i></a>'
				}else{
				h +=	'<a href="javascript:;" app-status="0"><i class="fa fa-power-off"></i></a>'	
				}
				h += '</div>';
			}
			
			$('#group-' + mark).find('.levels').html(h);
		},
		onAddNewLevel: function(){
			var that = this;
			$('#addnewlevel').on('click', function(){
				that.tip.loading();
				$.getJSON('public/async.asp', {
					m: 'level',
					p: 'addLevelByAuto'
				}, function( params ){
					if ( params.success ){
						that.onMakeLevelBox(params.data);
						that.tip.success(params.message);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		onMakeLevelBox: function( data ){
			var h = '';
			h +=		'<div class="mark cutWord">' + data.name + '</div>';
           	h +=		'<div class="des">';
            h +=	        '<div class="text"><i class="fa fa-check-square-o"></i> ' + data.des + '</div>';
            h +=	        '<div class="code"><i class="fa fa-code"></i> TronLevel.' + data.name + ' <i class="fa fa-angle-right"></i> <span class="true">True</span> or <span class="false">False</span></div>';
            h +=	        '<div class="action">';
            h +=	            '<a href="javascript:;" app-id="' + data.id + '" class="app-level-modify"><i class="fa fa-pencil-square-o"></i> 编辑</a>';
            h +=	            '<a href="javascript:;" app-id="' + data.id + '" class="app-level-remove"><i class="fa fa-trash-o"></i> 删除</a>';
            h +=	        '</div>';
			h +=			'<div class="editbox"></div>';
            h +=	    '</div>';
			var li = document.createElement('li');
			$('.level-list').append(li);
			$(li).addClass('clearfix').html(h);
			
			window.levels.push(data.name);
			for ( var i in window.groups ){
				window.groups[i][data.name] = false;
			};
			$('.group-list li').trigger('install');
		},
		onLevelModify: function(){
			var that = this;
			$('body').on('click', '.app-level-modify', function( params ){
				var id = $(this).attr('app-id'),
					_this = this;
					
				that.tip.loading();
				$.getJSON('public/async.asp', {
					m: 'level',
					p: 'getLevelMessage',
					id: id
				}, function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						that.onMakeLevelModifyBox(params.id, params.name, params.des, _this);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		onMakeLevelModifyBox: function( id, name, des, _this){
			var parent = $(_this).parents('li:first');
			var editbox = parent.find('.editbox');
			var that = this;
			var h = '<div class="setforms"><form action="public/async.asp?m=level&p=modifyLevelByForm" method="post"><input type="hidden" name="id" value="' + id + '" />';
				h	+=	'<table cellpadding="0" cellspacing="0" width="100%" border="0">';
				h 	+=	'<tr><td width="100">权限名</td><td><input type="text" name="code_name" value="' + name + '" class="col-x-3" /></td></tr>';
				h 	+=	'<tr><td width="100">权限描述</td><td><textarea name="code_des" class="col-x-4" style="height:60px;">' + des + '</textarea></td></tr>';
				h	+=	'<tr><td>&nbsp;</td><td><input type="submit" value="保存"  /><input type="button" value="关闭" class="close" /></td></tr>';
				h	+=	'</table>';
				h += '</form></div>';
			editbox.html(h);
			editbox.find('.close').on('click', function(){
				editbox.empty();
			});
			editbox.find('form').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( editbox.find("form input[name='code_name']").val().length === 0 ){
						that.tip.error('权限名不能为空');
						return false;
					};
					that.tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						editbox.find('.close').trigger('click');
						that.onLevelModifySuccessCallback(params.data);
					}else{
						that.tip.error(params.message);
					}
				}
			});
		},
		onLevelModifySuccessCallback: function( data ){
			window.location.reload();
		},
		onChangeRights: function(){
			$('body').on('click', '.group-list .des .levels a', function(){
				var status = $(this).attr('app-status');
				if ( status === '1' ){
					$(this).attr('app-status', '0');
					$(this).find('i').removeClass('fa-play').addClass('fa-power-off');
				}else{
					$(this).attr('app-status', '1');
					$(this).find('i').removeClass('fa-power-off').addClass('fa-play');
				}
			});
		},
		onSaveRights: function(){
			var that = this;
			$('body').on('click', '.app-save-group-rights', function(){
				var parent = $(this).parents('li:first'),
					lv = {},
					id = parent.attr('app-id');
					
				parent.find('.grouplevels').each(function(){
					var mark = $(this).find('span').text(),
						status = $(this).find('a').attr('app-status') === '1' ? true : false;
					lv[mark] = status;
				});

				that.tip.loading();
				$.post('public/async.asp?m=level&p=SaveGroupRights&id=' + id, {
					j: JSON.stringify(lv)
				}, function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						window.groups[parent.attr('mark')] = lv;
					}else{
						that.tip.error(params.message);
					}
				}, 'json');
			});
		},
		onLevelDelete: function(){
			var that = this;
			$('body').on('click', '.app-level-remove', function(){
				var id = $(this).attr('app-id'),
					parent = $(this).parents('li:first');
					
				that.tip.loading();
				$.getJSON('public/async.asp', {
					m: 'level',
					p: 'LevelRemove',
					id: id
				}, function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						parent.animate({
							opacity: 0
						}, 'slow', function(){
							$(this).remove();
							var mark = params.mark;
							var i = window.levels.indexOf(mark);
							if ( i > -1 ){
								window.levels.splice(i, 1);
								for ( var i in window.groups ){
									delete window.groups[i][mark];
								};
								$('.group-list li').trigger('install');
							}
						});
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});