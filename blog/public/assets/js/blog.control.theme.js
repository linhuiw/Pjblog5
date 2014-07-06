// JavaScript Document
define(['appjs/assets/jquery.lsotope','appjs/assets/jquery.form.min'], function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.waterFull();
			$('.app-setup').data('callback', function(){
				setTimeout(function(){
					window.location.reload();
				}, 1000);
			});
			$('.app-remove').data('callback', function(){
				$(this).parents('li:first').animate({ opacity: 0 }, 'slow', function(){
					$(this).remove();
					$('.wf').isotope('layout');
				});
			});
			this.onSettingFrom();
		},
		waterFull: function(){ 
			$('.wf').isotope({itemSelector: '.wf li'});
			$('img').each(function(){
				this.onload = this.onerror = function(){
					$('.wf').isotope('layout');
				};
			});
		},
		onSettingFrom: function(){
			var that = this;
			$('.app-setting').on('click', function(){
				that.tip.loading('正在获取参数数据和模板..');
				$.getJSON('public/async.asp', {
					m: 'theme',
					p: 'GetSettingValue'
				}, function( params ){
					if ( params.success ){
						that.onMakeBox(params.template, params.data);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		onMakeBox: function(template, data){
			var h = '';
			
			for ( var i in template ){
				if ( data[i] ){
					h += '<tr>';
					h +=	'<td width="100" align="right">' + template[i].des + '</td>';
					h +=	'<td>' + this.makeIns(data[i], template[i], i) + '</td>';
					h += '</tr>';
				}
			}
			
			h = '<div id="RightSettingbox"><h6>主题参数设定：</h6><form action="public/async.asp?m=theme&p=SaveThemesSettingValue" method="post" style="margin:0;"><table cellpadding="0" cellspacing="0" width="100%" border="0">' + h + '<tr><td></td><td><input type="submit" value="保存" /> <input type="button" value="关闭" class="close"></td></tr></table></form></div>';
			
			var z = this.tip.right(h);
			this.onBindEvent(z);
		},
		makeIns: function( value, tmp, name ){
			var v = '', i;
			switch ( tmp.type ){
				case 'textarea':
					v += '<textarea style="width:100%;height:50px;" name="' + name + '">' + value + '</textarea>';
					break;
				case 'select':
					v += '<select name="' + name + '">';
					for ( i = 0 ; i < tmp.childs.length ; i++ ){
						if ( tmp.childs[i].value === value ){
							v += '<option value="' + tmp.childs[i].value + '" selected="selected">' + tmp.childs[i].name + '</option>';
						}else{
							v += '<option value="' + tmp.childs[i].value + '">' + tmp.childs[i].name + '</option>';
						}
					};
					v += '</select>';
					break;
				case 'password':
					v += '<input type="password" name="' + name + '" value="' + value + '" style="width:100%;" />'
					break;
				default: 
					v += '<input type="text" name="' + name + '" value="' + value + '" style="width:100%;" />';
			}
			return v;
		},
		onBindEvent: function( element ){
			var that = this;
			$(element).find('.close').on('click', function(){ that.tip.close(); });
			$(element).find('form').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					that.tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
					}else{
						that.tip.error(params.message);
					}
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});