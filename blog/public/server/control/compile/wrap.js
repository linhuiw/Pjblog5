var wrap = new Class(function( querys, getforms ){
    this.data = {};
    
    this.data.system = [];
    this.data.plugins = [];
    this.data.crumbs = [];
    this.data.crumbIcon = 'fa-star';
    this.data.crumbTitle = '未知';
    this.req = {};
    this.data.files = {};
    
    this.isPlugin = false;
    
    this.caches = {};
    this.caches.menu = require(':public/menu.json');
    this.caches.pmenu = require(':public/pmenu.json');
    this.caches.plugins = require(':private/caches/plugins.json');
	this.caches.global = require(':private/caches/global.json');
    
    this.getRequest(querys, getforms);
    this.getSystemList();
    this.getPluginList();
    this.getCrumbs();
    this.getFiles();
    this.compiles(querys, getforms);
	this.themeiPressFile();
    
    return this.data;
});

wrap.add('getRequest', function(querys, getforms){
    var m = querys.m || '',
        p = querys.p || '',
        t = Number(querys.t || '0');
    
    if ( t  > 0 && m.length === 0 ){
        this.isPlugin = true;
    };
    
    this.req.m = m;
    this.req.p = p;
    this.req.t = t;
    
	if ( !this.isPlugin && this.req.m.length == 0 ){
		this.req.m = 'home';
	}
});

/*
   control: {
       name: ..,
       icon: ..,
       hide: ...,
       childs: [
           { name: .., icon: .. },
           ...
       ]
   },
   nav: {
       name: ..,
       icon: ...,
       active: ..,
       drops: ..,
       url: ..,
       childs: [
           {
               name: ..,
               icon: ..,
               active: ..,
               url: ..
           },
           ...
       ]
   }
*/
wrap.add('getSystemList', function(){
    for ( var i in this.caches.menu ){
        var menu = this.caches.menu[i];
        var _menu = {};
        if ( menu.hide ){ continue; }
        
        var active = i === this.req.m && !this.isPlugin ? 'active' : '';
        var drops = menu.childs ? 'treeview' : '';
        var url = menu.childs ? 'javascript:;' : iPress.setURL('control', 'wrap', { m: i });
        
        _menu.name = menu.name;
        _menu.icon = menu.icon;
        _menu.active = active;
        _menu.drops = drops;
        _menu.url = url;
        
        if ( menu.childs ){
            _menu.childs = [];
            for ( var j in menu.childs ){
                var child = menu.childs[j];
                if ( child.hide ){ continue; };
                var _active = i === this.req.m && j === this.req.p && !this.isPlugin ? 'active' : '';
                var _url = iPress.setURL('control', 'wrap', { m: i, p: j });
                _menu.childs.push({
                    name: child.name,
                    icon: child.icon,
                    active: _active,
                    url: _url
                });
            }
        }
        
        this.data.system.push(_menu);
    }
});

wrap.add('getPluginList', function(){
    for ( var i in this.caches.pmenu ){
        var menu = this.caches.pmenu[i];
        var _menu = {};
        if ( menu.hide ){ continue; };
        
        var active = Number(i) === this.req.t && this.isPlugin ? 'active' : '';
        var drops = menu.childs ? 'treeview' : '';
        var url = menu.childs ? 'javascript:;' : iPress.setURL('control', 'wrap', { t: i });
        
        _menu.name = menu.name;
        _menu.icon = menu.icon;
        _menu.active = active;
        _menu.drops = drops;
        _menu.url = url;
        
        if ( menu.childs ){
            _menu.childs = [];
            for ( var j in menu.childs ){
                var child = menu.childs[j];
                if ( child.hide ){ continue; };
                var _active = Number(i) === this.req.t && j === this.req.p && this.isPlugin ? 'active' : '';
                var _url = iPress.setURL('control', 'wrap', { t: i, p: j });
                _menu.childs.push({
                    name: child.name,
                    icon: child.icon,
                    active: _active,
                    url: _url
                });
            }
        }
        
        this.data.plugins.push(_menu);
    } 
});

wrap.add('getCrumbs', function(){
    var crumbs = ['iPress管理系统'];
    if ( this.isPlugin ){
        crumbs.push('插件');
        if ( this.caches.pmenu[this.req.t] ){
            crumbs.push(this.caches.pmenu[this.req.t].name);
            if ( this.req.p.length > 0 ){
                crumbs.push(this.caches.pmenu[this.req.t].childs[this.req.p].name);
                this.data.crumbIcon = this.caches.pmenu[this.req.t].childs[this.req.p].icon;
                this.data.crumbTitle = this.caches.pmenu[this.req.t].childs[this.req.p].name;
            }else{
                this.data.crumbIcon = this.caches.pmenu[this.req.t].icon;
                this.data.crumbTitle = this.caches.pmenu[this.req.t].name;
            }
        }else{
            crumbs.push('未知插件');
        }
    }else{
        crumbs.push('系统');
        if ( this.caches.menu[this.req.m] ){
            crumbs.push(this.caches.menu[this.req.m].name);
            if ( this.req.p.length > 0 ){
                crumbs.push(this.caches.menu[this.req.m].childs[this.req.p].name);
                this.data.crumbIcon = this.caches.menu[this.req.m].childs[this.req.p].icon;
                this.data.crumbTitle = this.caches.menu[this.req.m].childs[this.req.p].name;
            }else{
                this.data.crumbIcon = this.caches.menu[this.req.m].icon;
                this.data.crumbTitle = this.caches.menu[this.req.m].name;
            }
        }else{
            crumbs.push('未知系统功能');
        }
    }
    
    this.data.crumbs = crumbs;
});

wrap.add('getFiles', function(){
    var asp = 'views/404.asp', js = 'js/404.js', css = 'css/404.css', compile = 'compiles/404.js', folder;
    if ( this.isPlugin ){
        if ( this.caches.plugins && this.caches.plugins.indexs[this.req.t] ){
            folder = ':private/plugins/' + this.caches.plugins.indexs[this.req.t].plu_folder;
            if ( this.caches.pmenu[this.req.t] ){
                // 二级页面
                if ( this.req.p.length > 0 && this.caches.pmenu[this.req.t].childs && this.caches.pmenu[this.req.t].childs[this.req.p] ){
                    asp = folder + '/views/' + this.req.p + '.asp';
                    css = folder + '/css/' + this.req.p + '.css';
                    js = folder + '/js/' + this.req.p + '.js';
                    compile = folder + '/compiles/' + this.req.p + '.js';
                }
                // 一级页面
                else if ( this.req.p.length === 0 ) {
                    asp = folder + '/views/' + this.caches.pmenu[this.req.t].page + '.asp';
                    css = folder + '/css/' + this.caches.pmenu[this.req.t].page + '.css';
                    js = folder + '/js/' + this.caches.pmenu[this.req.t].page + '.js';
                    compile = folder + '/compiles/' + this.caches.pmenu[this.req.t].page + '.js';
                }
            }
        }
    }
    else{
        if ( this.caches.menu[this.req.m] ){
            if ( this.req.p.length > 0 && this.caches.menu[this.req.m].childs && this.caches.menu[this.req.m].childs[this.req.p] ){
                asp = ':public/server/control/views/' + this.req.m + '.' + this.req.p + '.asp';
                css = ':public/assets/css/control/' + this.req.m + '.' + this.req.p + '.css';
                js = ':public/assets/js/control/' + this.req.m + '.' + this.req.p + '.js';
                compile = ':public/server/control/compile/' + this.req.m + '.' + this.req.p + '.js';
            }
            else if ( this.req.p.length === 0 ){
                asp = ':public/server/control/views/' + this.req.m + '.asp';
                css = ':public/assets/css/control/' + this.req.m + '.css';
                js = ':public/assets/js/control/' + this.req.m + '.js';
                compile = ':public/server/control/compile/' + this.req.m + '.js';
            }
        }
    };
    
    this.data.files = {
        asp: asp,
        css: css,
        js: js,
        compile: compile
    };
});

wrap.add('compiles', function(querys, forms){
    if ( this.data.files.compile && this.data.files.compile.length > 0 ){
        var that = this;
        fs(resolve(this.data.files.compile)).exist().then(function(){
    		var moduled = require(that.data.files.compile);
    		if ( that.isPlugin ){
        		if ( that.caches.plugins && that.caches.plugins.indexs[that.req.t] ){
            		moduled.add('pid', that.req.t);
            		moduled.add('pmark', that.caches.plugins.indexs[that.req.t].plu_mark);
            		moduled.add('pfolder', that.caches.plugins.indexs[that.req.t].plu_folder);
        		}
    		}
    		that.data.compiles = new moduled(querys, forms) || {};
    	});
    }
});

wrap.add('themeiPressFile', function(){
	var that = this;
	fs(contrast(':private/themes/' + this.caches.global.blog_theme + '/iPress.js')).exist().then(function(){
		that.data.iPressFile = ':private/themes/' + that.caches.global.blog_theme + '/iPress.js';
	});
});

module.exports = wrap;