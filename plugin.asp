<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;(function( LAYOUT ){

	var PluginFile;
	
	function checkRequests(){
		if ( !this.NameSpace.reqs.query.id || this.NameSpace.reqs.query.id.length === 0 ){ 
			this.NameSpace.reqs.query.id = "0"; 
		}; 
		this.NameSpace.reqs.query.id = Number(this.NameSpace.reqs.query.id); 
		if ( this.NameSpace.reqs.query.id < 1 ){
			this.error = 20005;
		};
	}

	function getPluginMessage(){
		var pluginModule = require("private/chips/" + blog.cache + "blog.uri.plugins"),
			mark;
			
		if ( pluginModule.indexs && pluginModule.indexs[this.NameSpace.reqs.query.id + ""] ){
			mark = pluginModule.indexs[this.NameSpace.reqs.query.id + ""];
		};
		
		if ( mark ){
			this.NameSpace.data.plugin = pluginModule.queens[mark];
			if ( this.NameSpace.data.plugin.stop ){
				this.error = 20008;
			}
		}else{
			this.error = 20006;
		}
	}
	
	function getPluginConfigs(){
		var configpath = "private/plugins/" + this.NameSpace.data.plugin.folder + "/config";
		if ( this.NameSpace.coms.fs.exist(resolve(configpath)) ){
			var configs = require(configpath);
			if ( !configs.AssetNav ){
			
				this.error = 20007;
				return;
			};
			if ( !configs.AssetNav.file || configs.AssetNav.file.length === 0 ){
				this.error = 20007;
				return;
			};
			if ( !this.NameSpace.coms.fs.exist(contrast(this.NameSpace.data.theme.dir + "/" + configs.AssetNav.file)) ){
				this.error = 20009;
				return;
			};
			
			PluginFile = configs.AssetNav.file;
			
			for ( var i in configs ){
				this.NameSpace.data.plugin[i] = configs[i];
			}
		}else{
			this.error = 20007;
		}
	}
	
	function getPluginSetting(){
		var plugins = require("public/library/plugin");
			plugins.add("dbo", this.NameSpace.coms.dbo);
			plugins.add("conn", this.NameSpace.coms.conn);
		var plugin = new plugins(),
			setting = plugin.getSettingParams(this.NameSpace.reqs.query.id);
		
		this.NameSpace.data.plugin.settings = setting;
	}
	
	(new LAYOUT())
		.createServer()
		.reject(function(){ this.errorender("error.asp"); })
		.then(checkRequests)
		.then(getPluginMessage)
		.then(getPluginConfigs)
		.then(getPluginSetting)
		.render(PluginFile);
	
})( require("public/library/layout") );
%>