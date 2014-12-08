var plugin = new Class();

// 安装插件
plugin.add('install', function( folder ){	
	var msg = { success: false, message: '插件安装失败' },
		file_folder = contrast(":private/plugins/" + folder),
		file_config = file_folder + '\\config.json',
		file_config_exist = this.file_config_exist(file_config);
	
	var id = 0;
	
	if ( file_config_exist ){
		try{
		/*
		 * 第一步： 获取插件配置信息
		 * 		配置信息必须包含插件的标识
		 *		如果不存在标识，表示不明插件，不予安装。
		 *		插件标识必须为40位，由云平台生成。
		 */
			var plus_config_data = require(file_config);
				plus_config_data.folder = folder;
		/*
		 * 第二步： 确定插件是否已安装
		 * 		插件标识是否为40位编码
		 *		插件标识是否已存在于数据库中
		 */
			var plus_mark_exist = this.plus_mark_exist(plus_config_data);
			// 只有不存在数据库中的标识的插件才能被安装
			if ( !plus_mark_exist ){
			/*
			 * 第三步： 安装插件信息到数据库
			 * 		返回安装后插件所在数据库表中的ID
			 *		如果之后的操作失败，系统会回滚数据库信息到初始化。
			 */	
			 	id = this.plus_setup(plus_config_data);
				// id > 0 才能继续，表示已安装到数据库成功。
				if ( id > 0 ){
					/*
					 * 第四步： 更新插件系统缓存
					 * 		采用索引标识的模式，以便通过插件的ID或者标识来获取插件的信息。
					 *		前台插件页面建议采用插件标识来获取插件信息
					 */
					 	this.plus_set_cache();
					/*
					 * 第五步： 建立插件后台自定义页面数据
					 * 		如果存在插件自定义页面数据，那么就将插件信息输入到插件自定义数据内部
					 *		插件就能自动加载这些页面到侧边栏
					 */	
					 	this.plus_control_nav(id, plus_config_data.ControlNavs);
					/*
					 * 第六步： 安装插件前台导航
					 * 		只允许一个入口。其他页面希望插件作者自行提供页面方法
					 *		需要有很高的JS操作水平
					 */	
					 	if ( this.plus_assets_nav(id, plus_config_data.AssetNav) ){
							/*
							 * 第七步： 安装插件iSet信息
							 * 		检测文件是否存在 private/plugins/xxxx/iSet.json
							 *		调用iSet组件进行入库处理
							 */	
							 	if ( this.plus_iSet_add(id, folder) ) {
									/*
									 * 第八步： iSet信息缓存
									 * 		整合成根据插件ID存在的信息集合
									 */
									 	if ( (function(){
											var caches = require(':public/library/cache');
											var cache = new caches();
											return cache.params();
										})() ){
											/*
											 * 第九步： hook接入
											 * 		内嵌入系统内部功能
											 * 		自由组合自由生成
											 */
											 	this.plus_hook(id, folder);
											/*
											 * 第十步： 自定义安装数据库文件
											 * 		为系统添加插件自定义数据库代码
											 */
											 	this.plus_setup_sql(folder);
											/*
											 * 第十一步： 自定义安装文件
											 * 		允许用户自定义安装内容
											 */
											 	this.plus_setup_file(id, plus_config_data.mark, folder);
												
												msg.success = true;
												msg.message = '插件安装成功';
										}else{
											msg.message = '整合插件自定义配置参数缓存失败';
										}
								}else{
									msg.message = '添加自定义插件配置参数失败';
								}
						}else{
							msg.message = '添加分类导航失败';
						}
				}else{
					msg.message = '数据库数据安装失败';
				}
			}else{
				msg.message = '插件已安装';
			}
		}catch(e){}
	};
	
	return msg;	
});

plugin.add('uninstall', function( id ){
	var rec = new dbo(blog.tb + 'plugins', blog.conn);
	var msg = { success: false, message: '操作失败' };
	var folder, mark, installed = false, that = this;;

	try{
		rec.selectAll().and('id', id).open().exec(function(object){
			folder = object('plu_folder').value;
			mark = object('plu_mark').value;
			installed = true;
		}).close();
		
		if ( installed && folder && folder.length > 0 ){
			fs(contrast(':private/plugins/' + folder + '/config.json')).exist().then(function(){
				if ( require(':private/plugins/' + folder + '/config.json').mark === mark ){
					that.plus_setup_sql(folder, true);
					that.plus_hook(id);
					that.plus_iSet_remove(id);
					if ( that.plus_assets_nav(id) ){
						if ( (function(){
							var caches = require(':public/library/cache');
							var cache = new caches();
							return cache.params();
						})() ){
							that.plus_control_nav(id);
							new dbo(blog.tb + 'plugins', blog.conn).selectAll().and('id', id).open(3).remove().close();
							that.plus_set_cache();
							that.plus_setup_file(id, mark, folder, true);
							msg.success = true;
							msg.message = '插件卸载成功';
						}else{
							msg.message = '更新自定义插件参数失败';
						}
					}else{
						msg.message = '删除插件前台分类导航失败';
					}
				}else{
					msg.message = '此插件云端标识与数据库中标识不匹配，无法卸载';
				}
			}).fail(function(){
				msg.message = '找不到插件配置文件';
			});
		}else{
			msg.message = '插件未安装，不需要删除';
		}
	}catch(e){}
	
	return msg;
});

// 写入插件的后台自定义页面属性到pmenu
plugin.add('plus_control_nav', function(id, data){
	fs(contrast(':public/pmenu.json')).unExist().create('{}');
	var navs = require(':public/pmenu.json');
	if ( data ){
		navs[id + ''] = data;
	}else{
		try{ delete navs[id + '']; }catch(e){};
	}
	fs(contrast(':public/pmenu.json')).create(JSON.stringify(navs));
});

// 插入插件的分类导航到系统
plugin.add('plus_assets_nav', function(id, data){
	var categoryModules = require(':public/library/category'),
		categoryModule = new categoryModules();
		
	var status = false, rec, nid = 0;
		
	if ( data ){
		nid = categoryModule.inst({
			cate_name: data.name,
			cate_des: data.des,
			cate_parent: 0,
			cate_src: 'iPress:' + JSON.stringify(['page', 'plugin', { id: id }]),
			cate_outlink: true,
			cate_isroot: 0,
			cate_order: 99,
			cate_icon: 'fa-star'
		});
		
		if ( nid > 0 ){
			rec = new dbo(blog.tb + 'params', blog.conn);
			rec.selectAll().create().set({
				par_keyword: 'iPress.Plugin.Navgation.ID',
				par_keyvalue: nid + '',
				par_pid: id,
				par_hide: 1
			}).save().close();
			
			status = true;
		};
	}else{
		rec = new dbo(blog.tb + 'params', blog.conn);
		rec.selectAll().and('par_pid', id).and('par_keyword', 'iPress.Plugin.Navgation.ID').and('par_hide', 1).open(3).exec(function(object){
			nid = object('par_keyvalue').value;
			if ( nid && nid.length > 0 && !isNaN(nid) ){ nid = Number(nid); };
			if ( nid > 0 ){ object.Delete(); };
		}).close();
		
		if ( nid > 0 ){
			status = categoryModule.removeCategory(nid);
		}else{
			status = true;
		}
	}
	
	return status;
});

// 检测插件配置文件存在
plugin.add('file_config_exist', function(file){
	return fs(file).exist().then(function(){ return true; }).fail(function(){ return false; }).value();
});

// 检测插件标识是否存在，即是否已安装
plugin.add('plus_mark_exist', function(plus_config_data){
	var exist = true;
	if ( plus_config_data.mark && plus_config_data.mark.length === 40 ){
		var count = blog.conn.Execute("Select Count(id) From " + blog.tb + "plugins Where plu_mark='" + plus_config_data.mark + "'")(0).value;
		if ( count === 0 ){
			exist = false;
		}
	};
	
	return exist;
});

// 插件信息入库
plugin.add('plus_setup', function(params){
	var rec = new dbo(blog.tb + 'plugins', blog.conn);
	var id = 0;
	
	rec.selectAll().create().set({
		plu_mark: 	params.mark,
		plu_name: 	params.name,
		plu_des: 	params.des,
		plu_author: params.author,
		plu_mail: 	params.mail,
		plu_web: 	params.site,
		plu_icon: 	params.icon,
		plu_folder: params.folder,
		plu_stop: 	0
	}).save().exec(function(object){
		id = object('id').value;
	}).close();
	
	return id;
});

// 更新插件缓存
plugin.add('plus_set_cache', function(){
	var PluginModules = require(':public/library/cache');
	var PluginModule = new PluginModules();
	PluginModule.plugins();
});

// 添加插件自定义配置参数到数据库
plugin.add('plus_iSet_add', function(id, folder){
	var path = contrast(':private/plugins/' + folder + '/setting.json'),
		status = true;
		
	return fs(path)
		.exist()
		.then(function(){
			var Setting = require(path);
				iSets = require('iSet'),
				iSet = new iSets(Setting);
			
			var values = iSet.getDefaultValueToJSON();

			try{
				for ( var i in values ){
					(new dbo(blog.tb + 'params', blog.conn))
						.selectAll().create().set({
							par_keyword: i,
							par_keyvalue: values[i],
							par_pid: id,
							par_hide: 0
						}).save().close();
				}
				return true;
			}catch(e){
				return false;
			}
		})
		.fail(function(){ return true; })
		.value();
});

plugin.add('plus_iSet_remove', function(id){
	(new dbo(blog.tb + 'params', blog.conn))
	.selectAll().and('par_pid', id).open(3).each(function(object){
		if ( object('par_keyword').value !== 'iPress.Plugin.Navgation.ID' ){
			this.remove();
		};
	}).close();
});

plugin.add('plus_hook', function(id, folder){
	var hooks = require(':public/library/hook');
	var hook = new hooks();
	if ( folder && folder.length > 0 ){		
		var hookFile = resolve(':private/plugins/' + folder + '/hook.js');
		if ( fs(hookFile).exist().then(function(){ return true; }).fail(function(){ return false; }).value() ){
			hook.load(id, hookFile);
		}
	}else{
		hook.remove(id);
	}
});

plugin.add('plus_setup_sql', function(folder, type){
	var file = type ? contrast(':private/plugins/' + folder + '/uninstall.sql') : contrast(':private/plugins/' + folder + '/install.sql');
	fs(file).exist().read().then(function(text){
		if ( text.length > 0 ){
			text = text.replace(/\{\$tb\}/ig, blog.tb);
			try{
				blog.conn.Execute(text);
			}catch(e){}
		}
	});
});

plugin.add('plus_setup_file', function(id, mark, folder, type){
	var file = type ? resolve(':private/plugins/' + folder + '/uninstall.js') : resolve(':private/plugins/' + folder + '/install.js');
	fs(file).exist().then(function(){
		var CompileModule = require(file);
		new CompileModule(id, mark, folder);
	});
});

// 获取插件的自定义配置参数信息
// id 为插件标识（40位）或者插件的具体ID
plugin.add('getConfigs', function(id){
	if ( readVariableType(id, 'string') && id.length === 40 ){
		id = require(':private/caches/plugins.json').queens[id];
	};
	if ( id && !isNaN(id) ){
		return require(':private/caches/params.json')[id + ''];
	};
});

plugin.add('changeStatus', function(id, value){
	try{
		(new dbo(blog.tb + 'plugins', blog.conn)).selectAll().and('id', id).open(3).exec(function(object){
			this.set('plu_stop', value || !object('plu_stop').value).save();
		}).close();
		return true;
	}catch(e){ return false; };
});

plugin.add('remove', function(folder){
	return fs(contrast(':private/plugins/' + folder)).exist().remove().then(function(){ return true; }).fail(function(){ return false; }).value();
});

module.exports = plugin;