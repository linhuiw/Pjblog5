var layout = new Class(function( querys, forms ){
    var that = this;
	this.load(querys, forms);
	this.getPlugin();
});

layout.add('getPlugin', function(){
	var id = this.req.query.id;
	if ( !id || id.length === 0 ){
        id = 0;
    };
    id = Number(id);
    if ( id < 1 ){
        this.error(10001);
	}else{
		var pluginCache = require(':private/caches/plugins.json'),
			that = this;
		if ( pluginCache.indexs[id] ){
			var pfolder = pluginCache.indexs[id].plu_folder;
			var pid = pluginCache.indexs[id].id;
			var pmark = pluginCache.indexs[id].plu_mark;
			
			if ( pluginCache.indexs[id].plu_stop ){
				this.error(10011);
				return;
			}
			
			fs(contrast(':private/plugins/' + pfolder + '/config.json')).exist().then(function(){
				var configs = require(':private/plugins/' + pfolder + '/config.json');
				if ( configs.AssetNav && configs.AssetNav.file ){
					var targetFile = configs.AssetNav.file;
					fs(contrast(':private/themes/' + that.data.global.blog_theme + '/views/' + targetFile)).exist().then(function(){
						var compileJSON = {};
						fs(contrast(':private/plugins/' + pfolder + '/compiles/' + targetFile + '.js')).exist().then(function(){
							var compileModule = require(':private/plugins/' + pfolder + '/compiles/' + targetFile + '.js');
                			var compiles = new compileModule(pid, pmark, pfolder, that);
							if ( compiles ){
								compileJSON = compiles;
							}
						});
						
						var expose = null;
						fs(resolve(':private/plugins/' + pfolder + '/exports')).exist().then(function(){
						   var dat = require(':private/plugins/' + pfolder + '/exports');
						   expose = new dat(pid, pmark, pfolder);
						});
						
						var _plugins = require(':public/library/plugin');
						var _plugin = new _plugins();
						var setting = _plugin.getConfigs(pid);
						
						that.data.plugin = {
							configs: pluginCache.indexs[id],
							setting: setting,
							exports: expose,
							source: compileJSON
						};
						
						this.position('plugin', id, {
							name: '插件',
							title: pluginCache.indexs[id].plu_name,
							src: iPress.setURL('page', 'plugin', { id: id })
						});
						
						that.render(targetFile);
						
					}).fail(function(){
						that.error(10004);
					});
				}else{
					that.error(10004);
				}
			}).fail(function(){
				that.error(10003);
			})
		}else{
			this.error(10002);
		}
	}
});

layout.extend(require(':public/library/layout'));

module.exports = layout;