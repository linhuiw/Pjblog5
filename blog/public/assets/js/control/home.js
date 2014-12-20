(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(
			[
				'jquery',
				'http://app.webkits.cn/private/version/static/pjblog5.list',
				'http://app.webkits.cn/private/caches/news/static/recently',
				'http://app.webkits.cn/private/caches/apps/static/theme.recently',
				'http://app.webkits.cn/private/caches/apps/static/plugin.recently'
			], 
		mod);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.home = mod(window.jQuery);
    }
})(function ( $, versions, news, themes, plugins ) {
	var home = new Class(function(){
		this.version();
	});
	
	home.add('version', function(){
		var activeVersions = [];
		for ( var version in versions ){
			if ( Number(version) > blog.version ){
				versions[version].id = Number(version);
				activeVersions.push(versions[version]);
			}
		}

		if ( activeVersions.length > 0 ){
			activeVersions = activeVersions.sort(function(a, b){
				return a.id - b.id;
			});
			getFirstVersion(activeVersions, function(){
				$('#versions').html('<span style="padding: 5px; line-height:20px;">您已是最新版本V' + blog.version + '。无须升级。</span>');
			});
		}else{
			$('#versions').html('<span style="padding: 5px; line-height:20px;">您已是最新版本V' + blog.version + '。无须升级。</span>');
		}
	});
	
	function getFirstVersion(vers, callback){
		if ( vers[0] ){
			var id = vers[0].id,
				des = vers[0].des,
				file = vers[0].file,
				time = vers[0].time;

			var h = '';
			h +=	'<h6><strong>升级版本：</strong>从 <code>v' + blog.version + '</code> 到 <code>v' + id + '</code> </h6>';
			h +=	'<h6><strong>更新日期：</strong>' + jsDateDiff(time) + '</h6>';
			h +=	'<h6><strong>版本描述：</strong>' + des + '</h6>';
			h +=	'<div class="tip">';
			h +=		'<i class="fa fa-info-circle"></i>升级过程如果遇到错误，请不用担心。您可以查阅官方升级日志来解决您的问题！<br>';
			h +=		'<a href="http://app.webkits.cn/articles">http://app.webkits.cn/articles</a>';
			h +=	'</div>';
			h +=	'<p class="doUpdate"><button class="btn btn-success btn-sm"><i class="fa fa-plug"></i>开始更新新版本</button></p>'
			
			$('#versions').html(h).find('.doUpdate button').on('click', function(){
				$.ajax({
					url: iPress.setURL('async', 'online', { m : 'UpdateVersion' }),
					type: 'post',
					dataType: 'json',
					data: {
						id: id,
						file: file
					},
					success: function(msg){
						if ( msg.success ){
							vers.splice(0, 1);
							blog.version = id;
							getFirstVersion(vers, callback);
						}else{
							$('#versions').html('<span style="padding: 5px; line-height:20px;">更新失败：' + msg.message + '</span>');
						}
					},
					error: function(){
						$('#versions').html('<span style="padding: 5px; line-height:20px;">更新失败：服务端出错。</span>');
					}
				});
			});
		}else{
			callback();
		}
	}
	
	function jsDateDiff(publishTime){       
		var d_minutes,d_hours,d_days;       
		var timeNow = parseInt(new Date().getTime()/1000);       
		var d;       
		d = timeNow - publishTime;       
		d_days = parseInt(d/86400);       
		d_hours = parseInt(d/3600);       
		d_minutes = parseInt(d/60);       
		if(d_days>0 && d_days<4){       
			return d_days+"天前";       
		}else if(d_days<=0 && d_hours>0){       
			return d_hours+"小时前";       
		}else if(d_hours<=0 && d_minutes>0){       
			return d_minutes+"分钟前";       
		}else{       
			var s = new Date(publishTime*1000);       
			// s.getFullYear()+"年";
			return (s.getMonth()+1)+"月"+s.getDate()+"日";       
		}       
	}
	
	return home;

});