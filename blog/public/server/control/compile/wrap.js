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
	this.data.amenu = querys.m;
	this.data.pmenu = querys.p;
	this.data.tmenu = querys.t;
});

wrap.add('getContentFile', function(){
	var asp, css, js, file = {};
	if ( this.data.tmenu > 0 ){
		//加载插件页面
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
		
	if ( this.data.menu[querys.m] ){
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