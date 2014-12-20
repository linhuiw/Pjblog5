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
	console.log(plugins);
	var home = new Class(function(){
		this.version();
		this.news();
		this.theme();
		this.plugin();
	});
	
	home.add('version', function(){
		var activeVersions = [];
		for ( var version in versions ){
			if ( Number(version) > blog.version ){
				versions[version].id = Number(version);
				activeVersions.push(versions[version]);
			}
		}
		
		var cb = function(){
			var time = versions[blog.version].time;
			var des = versions[blog.version].des;
			var h = '';
			h +=	'<h6><strong>最新版本：</strong><code>v' + blog.version + '</code> (已是最新)</h6>';
			h +=	'<h6><strong>更新日期：</strong>' + jsDateDiff(time) + '</h6>';
			h +=	'<h6><strong>版本描述：</strong>' + des + '</h6>';
			h +=	'<div class="tip">';
			h +=		'<i class="fa fa-info-circle"></i>版本更新只针对数据库更新，文件更新请点击<a href="' + iPress.setURL('control', 'wrap', { m: 'online' }) + '">这里</a><br>';
			h +=		'<i class="fa fa-link"></i>欢迎访问官网：<a href="http://app.webkits.cn" target="_blank">http://app.webkits.cn/</a>';
			h +=	'</div>';

			$('#versions').html(h);
		}

		if ( activeVersions.length > 0 ){
			activeVersions = activeVersions.sort(function(a, b){ return a.id - b.id; });
			getFirstVersion(activeVersions, cb);
		}else{
			cb();
		}
	});
	
	home.add('news', function(){
		var h = [];
		news.data.forEach(function(o){
			h.push('<li><div class="title"><a href="' + o.url + '" target="_blank">' + o.title + '</a></div><div class="time">' + o.time + '</div></li>');
		});
		$('#blog-news').html('<ul>' + h.join('') + '</ul>');
	});
	
	home.add('theme', function(){
		if ( themes.data.length > 0 ){
			var h = [];
			themes.data.forEach(function(o){
				var a = '';
					a +=	'<div class="col-sm-4">';
					a +=	'<div class="zbox">';
					a +=		'<div class="preview-logo"><img src="' + o.logo + '" class="img-responsive" /></div>'
					a +=		'<div class="contented trans">';
					a +=			'<div class="name text-auto-hide"><a href="' + o.url + '">' + o.name + '</a></div>';
					a +=			'<div class="clearfix">'
					a +=			'<div class="time pull-right">' + o.time + '</div>'
					a +=			'<div class="info pull-left"><img src="' + blog.appsite + '/' + o.avatar + '/16" />' + o.author + '</div>';
					a +=			'</div>'
					a +=		'</div>';
					a +=	'</div>';
					a +=	'</div>';
				h.push(a);
			});
			$('#theme-box').html('<div class="row">' + h.join('') + '</div>');
		}else{
			$('#theme-box').html('抱歉，没有最新主题内容。');
		}
	});
	
	home.add('plugin', function(){
		if ( plugins.data.length > 0 ){
			var h = [];
			plugins.data.forEach(function(o){
				var a = '';
					a +=	'<li class="clearfix">';
					a +=		'<div class="author pull-left">'
					a +=			'<img src="' + blog.appsite + '/' + o.avatar + '/64" />';
					a +=		'</div>'
					a +=		'<div class="info">'
					a +=			'<div class="name"><a href="' + o.url + '">' + o.name + '</a></div>'
					a +=			'<div class="c">' + o.author + '</div>'
					a +=			'<div class="time">' + o.time + '</div>'
					a +=			'<div class="d"><code>' + o.mark + '</code></div>'
					a +=		'</div>'
					a +=	'</li>';
				h.push(a);
			});
			$('#plugin-box').html('<ul>' + h.join('') + '</ul>');
		}else{
			$('#plugin-box').html('抱歉，没有最新插件内容。');
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
			h += 	'<div id="version-error"></div>';
			h +=	'<p class="doUpdate"><button class="btn btn-success btn-sm"><i class="fa fa-plug"></i>开始更新新版本</button></p>'
			
			$('#versions').html(h).find('.doUpdate button').on('click', function(){
				this.disabled = true;
				$(this).find('i').addClass('fa-spin');
				var _this = this;
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
							$('#version-error').html('<div class="alert alert-danger" role="alert">更新失败：' + msg.message + '</div>');
							_this.disabled = false;
							$(_this).find('i').removeClass('fa-spin');
						}
					},
					error: function(){
						$('#version-error').html('<div class="alert alert-danger" role="alert">更新失败：服务端出错。</div>');
						_this.disabled = false;
						$(_this).find('i').removeClass('fa-spin');
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