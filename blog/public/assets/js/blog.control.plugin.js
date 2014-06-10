// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.onDeleteSystemPlugins();
			this.onInstallSystemPlugins();
			this.getPluginSettingData();
		},
		onDeleteSystemPlugins: function(){
			$('.app-delete').data('callback', function(){ $(this).parents('.plugins:first').animate({ opacity: '0' }, 'slow', function(){ $(this).remove(); }); });
		},
		onInstallSystemPlugins: function(){
			$('.app-setup, .app-runit, .app-stopit, .app-uninstall').data('callback', function(){ setTimeout(function(){ window.location.reload(); }, 2000) });
		},
		getPluginSettingData: function(){
			var that = this;
			$('.app-setting').on('click', function(){
				if ( !window.doing && $(this).parents('.plugins:first').find('.im .set form').size() === 0 ){
					window.doing = true;
					var id = $(this).attr('app-id');
					var parent = $(this).parents('.plugins:first');
					that.tip.loading('正在获取插件配置信息..');
					$.getJSON('public/async.asp', {
						m: 'plugin',
						p: 'getPluginSettingMessage',
						id: id
					}, function( params ){
						if ( params.success ){
							that.getPluginSettingTemplate(params.data, params.folder, parent, id);
						}else{
							window.doing = false;
							that.tip.error(params.message);
						}
					});
				}
			});
		},
		getPluginSettingTemplate: function(data, folder, parent, id){
			var that = this;
			that.tip.loading('正在获取插件配置模板..');
			$.getJSON('public/async.asp', {
				m: 'plugin',
				p: 'getPluginSettingTemplate',
				folder: folder
			}, function( params ){
				if ( params.success ){
					that.joinTemplate(data, params.data, parent, id);
				}else{
					window.doing = false;
					that.tip.error(params.message);
				}
			});
		},
		joinTemplate: function(data, tmp, parent, id){
			var h = '';
			for ( var i in tmp ){
				h += 	'<tr>';
				h += 		'<td valign="top" class="dname" width="100"><input type="hidden" name="par_id" value="' + data[i].id + '" />' + tmp[i].des + '</td>';
				h +=		'<td>' + this.filedType(data[i].value, tmp[i]) + '</td>';
				h +=	'</tr>';
			}
			
			h += '<tr><td>&nbsp;</td><td><input type="submit" value="保存" /> <input type="button" value="关闭" class="close" /></td></tr>'
			
			parent.find('.im .set').html('<form action="public/async.asp?m=plugin&p=SavePluginSetting&id=' + id + '" method="post" style="margin:0;" class="animated fadeIn"><table cellpadding="0" cellspacing="0" width="100%" border="0">' + h + '</table><div class="titletip">插件配置参数设置</div></form>');
			window.doing = false;
			this.tip.success('获取数据成功');
			this.onBindSettingForm(parent.find('.im .set form'));
		},
		filedType: function(value, tmp){
			var v = '', i;
			switch ( tmp.type ){
				case 'textarea':
					v += '<textarea style="width:100%;height:50px;" name="par_keyvalue">' + value + '</textarea>';
					break;
				case 'select':
					v += '<select name="par_keyvalue">';
					for ( i = 0 ; i < tmp.childs.length ; i++ ){
						if ( tmp.childs[i].value === value ){
							v += '<option name="' + tmp.childs[i].name + '" selected="selected">' + tmp.childs[i].value + '</option>';
						}else{
							v += '<option name="' + tmp.childs[i].name + '">' + tmp.childs[i].value + '</option>';
						}
					};
					v += '</select>';
					break;
				case 'password':
					v += '<input type="password" name="par_keyvalue" value="' + value + '" style="width:100%;" />'
					break;
				default: 
					v += '<input type="text" name="par_keyvalue" value="' + value + '" style="width:100%;" />';
			}
			return v;
		},
		onBindSettingForm: function(element){
			var that = this;
			
			element.ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( window.doing ){
						return;
					};
					window.doing = true;
					that.tip.loading();
				},
				success: function(params){
					window.doing = false;
					if ( params.success ){
						that.tip.success(params.message);
						element.find('.close').trigger('click');
					}else{
						that.tip.error(params.message);
					}
				}
			});
			
			element.find('.close').on('click', function(){
				element.remove();
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});