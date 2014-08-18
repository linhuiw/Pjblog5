// JavaScript Document
define('appjs/assets/jquery.form.min', function( require, exports, module ){
	return new Class({
		initialize: function(){
			var that = this;
			this.OpenSettingBox();
			$('#postform').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					that.tip.loading();
				},
				success: function(params){
					if ( params.success ){
						that.tip.success(params.message);
					}else{
						that.tip.error(params.message);
					}
				},
				error: function(){
					that.tip.error('系统错误');
				}
			});
		},
		OpenSettingBox: function(){
			var that = this;
			$('.opensetting').on('click', function(){
				var fo = $(this).attr('app-fo');
				that.tip.loading();
				$.getJSON('public/async.asp', {
					m: 'theme',
					p: 'getSettingContent',
					fo: fo
				}, function( data ){
					if ( data.success ){
						that.makebox(data.html);
					}else{
						that.tip.error(data.message);
					}
				});
			});
		},
		makebox: function(html){
			var that = this;
			var box = this.tip.center('<form action="public/async.asp?m=theme&p=saveSettingContent" method="post"><div style=" padding:10px;"><h6 style="padding-bottom:5px; border-bottom:1px solid #eee; margin-bottom: 10px; font-size:16px; height:20px; line-height:20px;">修改你的参数配置文件</h6><textarea style="width:600px; height:300px;" name="code">' + html + '</textarea><div style="margin:5px 0px;"><input type="submit" value="保存文件" /> <input type="button" class="close" value="关闭" /></div></div></form>');
			$(box).find('form .close').on('click', function(){
				that.tip.close();
			});
			$(box).find('form').ajaxForm({
				dataType: 'json',
				success: function(params){
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