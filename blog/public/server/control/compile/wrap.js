var wrap = new Class(function(querys, forms){
	this.data = {};
	this.data.compiles = {};
	
	
	this.getLocked();
	this.getMenu();
	this.getQuerys(querys);	
	this.getBreadcrumb(querys);
	this.getContentFile();
	this.getCompile(querys, forms);
	
	return this.data;
});

wrap.add('getCompile', function(querys, forms){
	var path = '', that = this;
	path += this.data.amenu + '.';
	if ( this.data.pmenu.length > 0 ){
		path += this.data.pmenu + '.';
	}
	path += 'js';
	fs(resolve(path)).exist().then(function(){
		var moduled = require(path);
		that.data.compiles = new moduled(querys, forms);
	});
});

wrap.add('getMenu', function(){
	this.data.menu = require(':public/menu.json');
	this.data.smenu = require(':public/pmenu.json');
});

wrap.add('getQuerys', function(querys){
	if ( !querys.m || querys.m.length === 0 ){
		querys.m = 'home';
	};
	if ( !querys.p ){
		querys.p = '';
	};
	if ( !querys.t || querys.t.length === 0 ){
		querys.t = '0';
	};
	querys.t = Number(querys.t);
	this.data.isPlugin = false;
	this.data.amenu = querys.m;
	this.data.pmenu = querys.p;
	this.data.tmenu = querys.t;
	if ( this.data.tmenu > 0 ){
		this.data.isPlugin = true;
	}
});

wrap.add('getContentFile', function(){
	var asp, css, js, file = {};
	if ( this.data.tmenu > 0 ){
		//{"70":{"name":"置顶日志管理","icon":"fa fa-thumbs-up","childs":{"sets":"置顶管理","list":"日志列表"}},"71":{"name":"友情链接插件","icon":"fa-chain-broken","page":"list"}}
		var ps = require(':public/pmenu.json');
		var pluginCaches = require(':private/caches/plugins.json');
		var folder;
		if ( pluginCaches.indexs[this.data.tmenu] ){
			folder = pluginCaches.indexs[this.data.tmenu].plu_folder;
			this.data.pid = this.data.tmenu;
			this.data.pmark = pluginCaches.indexs[this.data.tmenu].plu_mark;
			this.data.pfolder = folder;
			if ( ps[this.data.tmenu] ){
				if ( ps[this.data.tmenu].childs ){
					if ( ps[this.data.tmenu].childs[this.data.pmenu] ){
						folder = folder + '/plu.' + this.data.pmenu;
					}else{
						folder = folder + '/plu.404';
					}
				}else{
					folder = folder + '/plu.' + ps[this.data.tmenu].page;
				}
			}else{
				folder = folder + '/plu.404';
			}
		}else{
			folder = folder + '/plu.404';
		}
		css = folder + '.css';
		js = folder + '.js';
		asp = folder + '.asp';
		
		fs(contrast(':private/plugins/' + asp)).exist().then(function(){
			file.asp = ':private/plugins/' + asp;
		});
		fs(contrast(':private/plugins/' + css)).exist().then(function(){
			file.css = ':private/plugins/' + css;
		});
		fs(contrast(':private/plugins/' + js)).exist().then(function(){
			file.js = ':private/plugins/' + js;
		});
		this.data.file = file;
	}else{
		asp = '';
		if ( this.data.amenu.length > 0 ){
			asp += this.data.amenu + '.';
		}
		if ( this.data.pmenu.length > 0 ){
			asp += this.data.pmenu + '.';
		}
		css = asp + 'css';
		js = asp + 'js';
		asp += 'asp';
		fs(contrast('../views/' + asp)).exist().then(function(){
			file.asp = asp;
		});
		fs(contrast(':public/assets/css/control/' + css)).exist().then(function(){
			file.css = ':public/assets/css/control/' + css;
		});
		fs(contrast(':public/assets/js/control/' + js)).exist().then(function(){
			file.js = ':public/assets/js/control/' + js;
		});
		this.data.file = file;
	}
});

wrap.add('getBreadcrumb', function(querys){
	var title = '', 
		crumbs = ['iPresS'];
		
	if ( this.data.smenu[this.data.tmenu] ){
		crumbs.push('插件');
		this.data.crumbIcon = this.data.smenu[this.data.tmenu].icon;
		if ( this.data.pmenu.length > 0 ){
			if ( this.data.smenu[this.data.tmenu].childs && this.data.smenu[this.data.tmenu].childs[this.data.pmenu] ){
				title = this.data.smenu[this.data.tmenu].childs[this.data.pmenu];
				crumbs.push(this.data.smenu[this.data.tmenu].name);
				crumbs.push(title);
			}
		}else{
			title = this.data.smenu[this.data.tmenu].name;
			crumbs.push(title);
		}
	}	
	else if ( this.data.menu[querys.m] ){
		crumbs.push(this.data.menu[querys.m].name);
		title = this.data.menu[querys.m].name;
		this.data.crumbIcon = this.data.menu[querys.m].icon;
		
		if ( this.data.menu[querys.m].childs && this.data.menu[querys.m].childs[querys.p] ){
			crumbs.push(this.data.menu[querys.m].childs[querys.p]);
			title = this.data.menu[querys.m].childs[querys.p];
		}
	}
	
	this.data.crumbTitle = title;
	this.data.crumb = crumbs;
});

wrap.add('getLocked', function(){
	if ( Session(blog.pix + 'locked') ){
		
	}
});

module.exports = wrap;