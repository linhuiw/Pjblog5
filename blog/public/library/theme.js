var theme = new Class();

theme.add('install', function( folder ){
	var msg = { success: false, message: '安装失败' };
	/*
	 * 判断主题配置文件是否存在
	 * 不存在就不安装
	 */
	if ( this.iCheckSkinExist(folder) ){
		
		var configs = require(folder + '\\config.json'),
			mark = configs.mark;
		 
		if ( mark && mark.length === 40 ){
			if ( this.downloadPluginsFromClouder(configs.plugins) ){
				
			}else{
				msg.message = '检测并云端下载插件失败';
			}
		}else{
			msg.message = '主题标识不正确';
		}
	}else{
		msg.message = '找不到主题配置文件';
	}
	
	return msg;
});

theme.add('iCheckSkinExist', function(folder){
	return fs(folder + '\\config.json')
		.exist()
		.then(function(){
			return true;
		}).fail(function(){
			return false;
		}).value();
});

theme.add('downloadPluginsFromClouder', function( plugins ){
	if ( plugins ){
		var pluginsCache = require(':private/caches/plugins.json');
		var globalCache = require(':private/caches/global.json');
		var OAUTH = require(':public/library/oauth');
		var oAuth = new OAUTH();
		oAuth.appid(globalCache.blog_appid).token(blog.user.token).openid(blog.user.openid);
		
		for ( var plugin in plugins ){
			if ( pluginsCache.queens[plugin.mark] && pluginsCache.queens[plugin.mark] > 0 ){
				continue;
			}
			// 开始从云平台下载插件安装
			else{
				if ( oAuth.download(plugin.mark, 'plugins') ){
					
				}else{
					
				}
			}
		}
		
	}else{
		return true;
	}
});

module.exports = theme;