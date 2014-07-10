(function( host ){
	/*!
	 * use strict
	 * Constructor: Loader JS
	 * Author: evio
	 * Email: evio@vip.qq.com
	 * Web: http://webkits.cn
	 */
	'use strict';
	if ( ![].indexOf ){
		Array.prototype.indexOf = function( value ){
			var j = -1;
			for ( var i = 0 ; i < this.length ; i++ ){
				if ( value === this[i] ){
					j = i;
					break;
				}
			}
			return j;
		};
		Array.prototype.lastIndexOf = function( value ){
			var j = -1;
			for ( var i = this.length - 1 ; i > -1 ; i-- ){
				if ( value === this[i] ){
					j = i;
					break;
				}
			}
			return j;
		};
	};
	if ( typeof JSON === "undefined" ){ window.JSON = new Object(); };
	var callType = function( object, type ){ 
			return Object.prototype.toString.call(object).toLowerCase() === "[object " + type + "]"; 
		},
	/*
	 * Class 原型
	 * 创建类的公用方法
	 * prototype: extend
	 * 返回一个实例对象 这个对象继承了原有的方法 extend
	 */	
	Class = window.Class = function( object ){
		object = object || {};
		
		if ( callType(object, 'function') ){ object = object(); };
		if ( !callType(object, 'object') ){ throw 'Argument is not an object.'; return; };

		var factory = function(){
			return this.initialize ? this.initialize.apply(this, arguments) : this;
		}

		factory.constructor = factory;
		factory.extend = this.extend;
		factory.parent = this;
		this.factory = factory;
		this.extend(object);
		
		return factory;
	};
	
	/*
	 * 对象继承的方法
	 * 依赖于this.factory || this.parent.factory
	 */
	Class.prototype.extend = function( object, func ){
		if ( func ){
			var _object = {};
			_object[object] = func;
			object = _object;
		}
		
		this.factory = this.factory || this.parent.factory;
		for ( var i in object ){
			if ( ['extend', 'constructor', 'parent'].indexOf(i) === -1 ){
				this.factory.prototype[i] = object[i];
			}else{
				throw 'Can not extend ' + i;
			}
		}
	};
	
	/*
	 * 加载器基本属性设置
	 */
	var _host = host.origin ? host.origin : host.href.split('/').slice(0, 3).join('/'),
		_base = _host,
		_file = host.href.split('?')[0].split('/').slice(0, -1).join('/');
		
	var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
		UA = navigator.userAgent, 
		isWebKit = ~UA.indexOf('AppleWebKit'),
		isOldWebKit = (UA.replace(/.*AppleWebKit\/(\d+)\..*/, "$1")) * 1 < 536,
		isIE = UA.indexOf('MSIE') > -1;
	
	var application = new Class({
		httpDomain: host.origin,
		httpBase: host.origin,
		regx_root: /^\/.+/,
		regx_http: /^http\:\/\//i,
		regx_parent: /^\.\.\/.+/,
		regx_self: /^\.\/.+/,
		regx_local: /^\:.+/,
		regx_REQUIRE_RE: /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
		regx_SLASH_RE: /\\\\/g,
		maps: {},
		modules: {},
		isIE: isIE,
		isOldWebKit: isOldWebKit,
		isWebKit: isWebKit,
		cache: true,
		charset: 'UTF-8',
		delay: 10
	});
	
	// 设置加载器映射
	application.extend('onMap', function( selector ){
		this.maps[str] = selector;
		return this;
	});
	
	// 设置加载器基址
	application.extend('setBase', function( str ){
		if ( str && str.length > 0 ){
			if ( /^http:/i.test(str) ){
				this.httpBase = str;
				this.httpDomain = str.split('/').slice(0, 3).join('/');
			}
			else{
				this.httpBase += '/' + str;
			}
		};
		
		if ( /\/$/.test(this.httpBase) ){
			this.httpBase = this.httpBase.replace(/\/$/, '');
		};
		
		return this;
	});
	
	// 接口转移方法
	application.extend('proxy', function( fn, context ){
		return function(){
			var args = arguments;
			return fn.apply(context, args);
		};
	});
	
	// 去除重复方法
	application.extend('unique', function(arr){
		var obj = {};
		var ret = [];

		for ( var i = 0, len = arr.length; i < len; i++ ) {
			var item = arr[i];
			if ( obj[item] !== 1 ){
			  obj[item] = 1;
			  ret.push(item);
			}
		}

		return ret;
	});
	
	//处理依赖关系方法
	application.extend('parseDependencies', function( code ){
		var ret = [], m;
			
		this.regx_REQUIRE_RE.lastIndex = 0
		code = code.replace(this.regx_SLASH_RE, "");

		while ((m = this.regx_REQUIRE_RE.exec(code))) {
			if (m[2]) ret.push(m[2]);
		}

		return this.unique(ret);
	});
	
	// script标签加载完毕回调
	application.extend('ScriptLoaded', function( node, url, callback ){
		node.onload = node.onerror = node.onreadystatechange = function(){
			if ( /loaded|complete|undefined/i.test(node.readyState) ) {
				node.onload = node.onerror = node.onreadystatechange = null;
				callback.call(node, url);
			}
		}
	});
	
	// 统一的文件加载过程
	application.extend('request', function( url, callback ){
		var node,
			isCss = /\.css(?:\?|$)/i.test(url),
			isScript = /\.js(?:\?|$)/i.test(url),
			__url;
		
		// 根据是否需要缓存写入文件stamp来是否组织缓存
		if ( !this.cache ){
			if ( url.indexOf('?') > -1 ){
				__url = url + '&stamp=' + new Date().getTime();
			}else{
				__url = url +  '?stamp=' + new Date().getTime();
			};
		}else{
			__url = url;
		};
			
		if ( isCss ){
			node = document.createElement("link");
			if ( this.charset && this.charset.length > 0 ){ node.charset = this.charset; };
			node.rel = 'stylesheet'; 
			node.href = __url; 
			head.appendChild( node );
			callback.call(node, url);
		}
		else if ( isScript ){
			node = document.createElement("script");
			if ( this.charset && this.charset.length > 0 ) node.charset = this.charset;
			this.ScriptLoaded(node, url, callback);
			node.async = true;
			node.src = __url;
			head.insertBefore( node, head.firstChild );
		}
		else{
			// ajax
		}
	});
	
	application.extend('CopyJSON', function( data ){
		var rets = {};
		
		for ( var i in data ){
			rets[i] = data[i];
		}
		
		return rets;
	});
	
	// 获取当前正在执行SCRIPT文件方法
	application.extend('getCurrentScript', function(){
		var scripts = head.getElementsByTagName("script");
	
		for ( var i = scripts.length - 1; i >= 0; i-- ) {
			var script = scripts[i];
			if (script.readyState === "interactive") {
				 return script;
			}
		}
	});
	
	// 全局define方法
	application.extend('define', function( deps, factory ){
		if ( !deps ){ return; };
		if ( !factory ){
			if ( typeof deps === 'function' ){
				factory = deps;
				deps = [];
			}
			else{
				factory = function(){};
			};
		};
		if ( !callType(deps, 'array') ){
			deps = [deps];
		};
		if ( typeof factory === "function" ){ 
			deps = deps.concat(this.parseDependencies(factory.toString())); 
		};
		
		var meta = { deps: deps, factory: factory };
		
		if ( isIE ){
			var script = this.getCurrentScript();
			if ( script ){
				meta.id = script.src;
				script.meta = meta;
			}
		}else{
			this.currentParams = meta;
		}
	});
	
	// 实例化全局方法
	var Library = window.Library = new application();
	
	// 设置加载模式
	Library.define.AMD = false;
	window.define = Library.proxy(Library.define, Library);
	
	// REQUIRE模块方法
	var REQUIRE = new Class({
		initialize: function( __filename ){
			this.deps = [];
			this.callbacks = [];
			this.indexs = {};
			this.doing = false;
			this.modules = [];
			this.__filename = __filename;
			this.__dirname = __filename.split('/').slice(0, -1).join('/');
		}
	});
	
	REQUIRE.extend('ResolveParentSelector', function( p ){
		var parentNode = p.replace(Library.host, "");
			
		if ( /^\//.test(parentNode) ){
			parentNode = parentNode.replace(/^\//, "");
		}
		
		var parentArrays = parentNode.split("/"),
			index = parentArrays.indexOf("..");
			
		if ( index > -1 ){
			index--;
			if ( index < 0 ){
				index = 0;
				parentArrays.splice(0, 1);
			}else{
				parentArrays.splice(index, 2);
			}
			var x = parentArrays.join("/");
			if ( !Library.regx_http.test(x) ){
				x = Library.host + "/" + x;
			}
			return this.ResolveParentSelector(x);
		}else{
			var b = parentArrays.join("/");
			if ( !Library.regx_http.test(b) ){
				b = Library.host + "/" + b;
			}
			return b;
		}
	});
	
	REQUIRE.extend('contrast', function( str ){
		if ( str === undefined || typeof str !== 'string' ){
			throw 'Tronjs Error Message: Error Selector String. It Must Be Exist. Now It Is Undefined.';
			return;
		};
		
		if ( Library.maps[str] ){ str = Library.maps[str]; };
		
		// root like /a/b/c
		if ( Library.regx_root.test(str) ){ str = Library.httpDomain + str; }
		else if ( Library.regx_http.test(str) ){ str = str; }
		// parent like ../a/b/c
		else if ( Library.regx_parent.test(str) ){ str = this.ResolveParentSelector(this.__dirname + '/' + str); }
		// self like ./a/b/c
		else if ( Library.regx_self.test(str) ){ str = this.__dirname + '/' + str.replace(/^\.\//, ''); }
		// local like :a/b/c
		else if ( Library.regx_local.test(str) ){ str = str.replace(/^:/, ''); }
		// base like a/b/c
		else{ str = Library.httpBase + '/' + str; }
		
		return str;
	});
	
	REQUIRE.extend('resolve', function( str ){
		str = this.contrast(str);
		
		if ( !str ) return;

		if ( /\.css$/i.test(str) ){ str = str; }
		else if ( /\.js$/i.test(str) ){ str = str; }
		else{ str += '.js'; }
		
		return str;
	});
	
	REQUIRE.extend('construct', function( deps, callback ){
		if ( !deps ){ return; };
		if ( !callback ){
			if ( typeof deps === 'function' ){
				callback = deps;
				deps = [];
			}else{
				callback = function(){};
			}
		};
		if ( !callType(deps, 'array') ){ deps = [deps]; };

		var __deps = [],
			j = this.callbacks.length,
			that = this;
		
		for ( var i = 0 ; i < deps.length ; i++ ){
			var file = this.resolve(deps[i]);
			__deps.push(file);
			if ( !Library.modules[file] ){
				Library.modules[file] = {
					loaded: 0, //0 未加载 1正在加载 2加载完成
					compile: 0,
					exports: {}
				};
				//console.log('添加模块' + file + ',0,0');
			}
		};
		
		this.deps = this.deps.concat(__deps);
		this.callbacks.push(callback);
		this.indexs[j + ''] = __deps;
		
		if ( !this.doing ){
			this.doing = true;
			setTimeout(function(){ that.terminate(); }, Library.delay);
		}
	});
	
	REQUIRE.extend('terminate', function(){
		if ( Library.define.AMD ){ this.AMD(); }
		else{ this.CMD(); };
	});
	
	REQUIRE.extend('AMD', function(){
		if ( this.deps.length > 0 ){
			this.AMDITEM(0);
		}else{
			this.end();
		}
	});
	
	REQUIRE.extend('AMDITEM', function(i){
		var that = this;
		if ( this.deps.length > 0 ){
			if ( i < this.deps.length ){
				var url = this.deps[i];
				if ( Library.modules[url].loaded === 0 ){
					Library.modules[url].loaded = 1;
					Library.request(url, function( u ){
						var params;
						if ( isIE ){
							if ( !this.meta ){ this.meta = { deps: [], factory: function(){} }; };
							
							this.meta.id = u;
							
							params = Library.CopyJSON(this.meta);
						}else{
							if ( !Library.currentParams ){ Library.currentParams = { deps: [], factory: function(){} }; };
							
							Library.currentParams.id = u;
							
							params = Library.CopyJSON(Library.currentParams);
							delete Library.currentParams;
						};
						that.Regist(params);
						that.AMDITEM( ++i );
					});
				}else{
					this.AMDITEM( ++i );
				}
			}else{
				this.complete(0);
			}
		}else{
			this.complete(0);
		}
	});
	
	REQUIRE.extend('CMD', function(){
		var j = this.deps.length,
			o = 0,
			that = this;
		
		if ( j > 0 ){
			for ( var i = 0 ; i < j ; i++ ){
				var url = this.deps[i];
				if ( Library.modules[url].loaded === 0 ){
					Library.modules[url].loaded = 1;
					//console.log('模块' + url + '正在加载中,1,0');
					Library.request(url, function( u ){
						var params;
						if ( isIE ){
							if ( !this.meta ){ this.meta = { deps: [], factory: function(){} }; };	
							this.meta.id = u;	
							params = Library.CopyJSON(this.meta);
						}else{
							if ( !Library.currentParams ){ Library.currentParams = { deps: [], factory: function(){} }; };
							Library.currentParams.id = u;	
							params = Library.CopyJSON(Library.currentParams);
							delete Library.currentParams;
						};
						that.Regist(params);
						++o;
						if ( j === o ){ 
							that.complete(0);
						};
					});
				}else{
					++o;
					if ( j === o ){ 
						this.complete(0);
					};
				}
			}
		}else{
			this.complete(0);
		}
	});
	
	REQUIRE.extend('Regist', function( params ){
		this.modules.push({
			factory: params.factory,
			deps: params.deps,
			exports: {},
			id: params.id
		});
		Library.modules[params.id].loaded = 2;
		//console.log('模块' + params.id + '加载完毕,2,0');
	});
	
	REQUIRE.extend('complete', function( i ){
		if ( this.modules[i] ){
			this.compile(i);
		}else{
			this.end();
		}
	});
	
	REQUIRE.extend('end', function(){
		for ( var j = 0 ; j < this.callbacks.length ; j++ ){
			var indexs = this.indexs[j],
				zoon = [];
			for ( var o = 0 ; o < indexs.length ; o++ ){
				zoon.push(this.inRequire(indexs[o]));
			};
			this.callbacks[j].apply(this, zoon);
		}
	});
	
	REQUIRE.extend('inRequire', function( selector ){
		return Library.modules[this.resolve(selector)].exports;
	});
	
	REQUIRE.extend('compile', function( i ){
		var module = this.modules[i],
			factory = module.factory,
			deps = module.deps,
			exports = module.exports,
			that = this;
		
		if ( Library.modules[module.id].compile > 0 ){
			//console.log('模块' + module.id + '正在编译中跳过,2,1')
			i++;
			that.complete(i);
			return;
		};
		//console.log('模块' + module.id + '正在编译中,2,1')
		Library.modules[module.id].compile = 1;
		var RequireModule = new REQUIRE( module.id );
		var require = RequireModule.inRequire;
		RequireModule.construct(deps, function(){
			var rets = factory.call(
				RequireModule, 
				Library.proxy(require, RequireModule), 
				exports, 
				module
			);
			if ( rets ){ exports = rets; };
			Library.modules[module.id].compile = 2;
			Library.modules[module.id].exports = exports;
			//console.log('模块' + module.id + '正在编译完成,2,2')
			i++;
			that.complete(i);
		});
	});
	
	var inRequire = new REQUIRE( host.href );
	window.require = Library.proxy(inRequire.construct, inRequire);
	
})( window.location );

// JSON department
(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());