var layout = new Class();

// 模板数据源
layout.add('data', {});
// 页面请求数据源
layout.add('req', {});

// 模板用户数据
layout.add('user', function(){ 
    this.data.user = blog.user;
    if ( blog.user.status >= 1 ){
        blog.user.login = true;
        blog.user.logout = iPress.setURL('oauth', 'logout');
    }else{
        blog.user.login = false;
        blog.user.jump = iPress.setURL('oauth', 'jump');
    }
});

// 模板全局数据
layout.add('global', function(){ this.data.global = require(':private/caches/global.json'); });

// 当前模板数据
layout.add('theme', function(){
    if ( !this.data.global ){
        this.global();
    }
    this.data.theme = {};
    this.data.theme.setting = require(':private/caches/themes.json');
    this.data.theme.configs = require(':private/themes/' + this.data.global.blog_theme + '/config.json');
});

// req数据
layout.add('createServer', function(querys, forms){
   this.req.query = querys;
   this.req.form = forms();
});

// 分类数据
layout.add('category', function(){
   var categories = require(':private/caches/categorys.json');
   var category = [];
   categories.queens.forEach(function( o ){
        var id = o.id,
            items = o.items;
        
        if ( categorys.indexs[id] ){
            var keep = GruntCategory(categorys.indexs[id]);
            if ( items && items.length > 0 ){
                keep.items = [];
                items.forEach(function(z){
                    if ( categorys.indexs[z] ){
                        keep.items.push(GruntCategory(categorys.indexs[z]));
                    }
                });
            }
            category.push(keep);
        }
        
   });
   
   this.data.categories = categories;
});

layout.add('support', function(){ new sups(this); });

function GruntCategory(data){
    if ( data.cate_outlink ){
        if ( /^iPress\:.+/i.text(data.cate_src) ){
            var regExec = /^iPress\:(.+)/i.exec(data.cate_src);
            if ( regExec && regExec[0] && regExec[1] && /^\[[^\]+]\]/.test(regExec[1]) ){
                var code = regExec[1];
                data.src = iPress.setURL.apply(iPress, JSON.parse(code));
            }else{
                data.src = iPress.setURL('page', 'articles', { id: data.id });
            }
        }else{
            if ( /^[a-z]+:\/\//i.test(data.cate_src) ){
                data.src = data.cate_src;
            }else{
                data.src = 'http://' + data.cate_src;
            }
        }
    }else{
        data.src = iPress.setURL('page', 'articles', { id: data.id });
    }
    delete data.cate_src;
    delete data.cate_outlink;
    
    return data;
};

var sups = new Class(function( layouts ){
    if ( !layouts.sups ){
        layouts.sups = this;  
    };
    this.layout = layouts;
});

sups.add('import', function(mark, datas){
    var compileJSON;
    if ( !this.layout.data.theme ){
        this.layout.theme();
    };
    if ( this.layout.data.theme.configs.plugins && this.layout.data.theme.configs.plugins[mark] ){
        var pluginMark = this.layout.data.theme.configs.plugins[mark].mark;
        var pluginTemplate = this.layout.data.theme.configs.plugins[mark].file;
        var pluginCompile = this.layout.data.theme.configs.plugins[mark].compile;
        var pluginCaches = require(':private/caches/plugins.json');
        var pluginFolder = pluginCaches.indexs[pluginCaches.queens[pluginMark]].plu_folder;
        var pid = pluginCaches.indexs[pluginCaches.queens[pluginMark]].id;
        var pmark = pluginMark;
        
        // 如果主题中支持此插件的编译文件
        if ( pluginCompile && pluginCompile.length > 0 ){
            fs(resolve(':private/plugins/' + pluginFolder + '/compiles/' + pluginCompile)).exist()
            .then(fucntion(){
                var compileModule = require(':private/plugins/' + pluginFolder + '/compiles/' + pluginCompile);
                compileJSON = new compileModule(pid, pmark, pluginFolder, this.layout);
            }).fail(function(){
                compileJSON = {};
            });
        }else{
            compileJSON = {};
        }
        
        compileJSON.pid = pid;
        compileJSON.pmark = pmark;
        compileJSON.pfolder = pluginFolder;
        
        if ( datas ){
            for ( var i in datas ){
                compileJSON[i] = datas[i];
            }
        }
        
        var expose = null;
        fs(resolve(':private/plugins/' + pluginFolder + '/exports')).exist().then(function(){
           var dat = require(':private/plugins/' + pluginFolder + '/exports');
           expose = new dat(pid, pmark, pluginFolder);
        });
        
        include(':private/themes/' + this.layout.data.global.blog_theme + '/' + pluginTemplate, {
            source: compileJSON,
            data: this.layout.data,
            req: this.layout.req,
            sups: this.layout.sups,
            exports: expose
        });
    };
});

module.exports = layout;