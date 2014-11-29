var wrap = new Class(function(querys, forms){
	this.data = {};
	
	this.getMenu();
	this.getQuerys(querys);	
	this.getContentFile();
	
	return this.data;
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
		fs(contrast(':public/assets/css/' + asp)).exist().then(function(){
			file.css = ':public/assets/css/' + css;
		});
		fs(contrast(':public/assets/js/' + asp)).exist().then(function(){
			file.js = ':public/assets/js/' + js;
		});
		this.data.file = file;
	}
});

module.exports = wrap;