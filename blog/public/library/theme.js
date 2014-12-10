var theme = new Class();

theme.add('install', function( folder ){
	var msg = { success: false, message: '安装失败' };
	/*
	 * 判断主题配置文件是否存在
	 * 不存在就不安装
	 */
	if ( this.iCheckSkinExist(folder) ){
	
		var configs = require(':private/themes/' + folder + '/config.json'),
			mark = configs.mark;
		 
		if ( mark && mark.length === 40 ){
			if ( this.downloadPluginsFromClouder(configs.plugins || {}) ){
				if ( this.iSetCompress(folder) ){
					try{
						(new dbo(blog.tb + 'global', blog.conn))
						.top(1).selectAll().open(3).set({
							blog_theme: folder,
							blog_themename: configs.name,
							blog_thememail: configs.mail,
							blog_themeweb: configs.site
						}).save().close();
						
						var caches = require('cache');
						var cache = new caches();
						cache.global();
						msg.success = true;
						msg.message = '安装主题成功';
					}catch(e){}
				}else{
					msg.message = '设置主题自定义参数失败';
				}
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
	return fs(contrast(':private/themes/' + folder), true)
		.exist()
		.then(function(){
			return true;
		}).fail(function(){
			return false;
		}).value();
});

theme.add('downloadPluginsFromClouder', function( plus ){
	if ( plus ){
		var pluginsCache = require(':private/caches/plugins.json');
		var globalCache = require(':private/caches/global.json');
		var plugins = require('plugin');
		var plugin = new plugins();
		var OAUTH = require(':public/library/oauth');
		var oAuth = new OAUTH(), status = true;
		
		oAuth.appid(globalCache.blog_appid).token(blog.user.token).openid(blog.user.openid);
		
		for ( var plugin in plus ){
			if ( pluginsCache.queens[plugin.mark] && pluginsCache.queens[plugin.mark] > 0 ){
				continue;
			}
			// 开始从云平台下载插件安装
			else{
				if ( oAuth.download(plugin.mark, 'plugins') ){
					var o = plugin.install(plugin.mark);
					if ( !o.success ){
						status = false;
						break;
					}
				}else{
					status = false;
					break;
				}
			}
		}
		return status;
	}else{
		return true;
	}
});

theme.add('iSetCompress', function(folder){
	return fs(contrast(':private/themes/' + folder + '/setting.json')).exist().then(function(){
		var Setting = require(':private/themes/' + folder + '/setting.json');
			iSets = require('iSet'),
			iSet = new iSets(Setting);
		
		var values = iSet.getDefaultValueToJSON();
		
		try{
			blog.conn.Execute('Delete From blog_themes');
			for ( var i in values ){
				(new dbo(blog.tb + 'themes', blog.conn))
				.selectAll().create().set({
					tm_key: i,
					tm_value: values[i]
				}).save().close();
			}
			
			var caches = require('cache');
			var cache = new caches();
			
			if ( cache.themes() ){
				return true;
			}else{
				return false;
			};
		}catch(e){
			return false;
		}
	}).fail(function(){
		return true;
	}).value();
});

theme.add('saveSetting', function(forms){
    var status = true;
    try{
        for ( var i in forms ){
            (new dbo(blog.tb + 'themes', blog.conn)).selectAll().and('tm_key', i).open().exec(function(){
                this.set('tm_value', forms[i]).save();
            }, function(){
                this.create().set({
                    tm_key: i,
                    tm_value: forms[i]
                }).save()
            }).close();
        }
        
        var caches = require('cache');
		var cache = new caches();
		
		if ( cache.themes() ){
			return true;
		}else{
			return false;
		};
    }catch(e){ status = false; }
    return status;
});

theme.add('remove', function(folder){
    var status = false;
    
	return fs(contrast(':private/themes/' + folder), true).exist().remove().then(function(){ 
    	status = true;
    });
    
    return status;
});

module.exports = theme;