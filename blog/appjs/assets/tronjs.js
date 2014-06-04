/*!
 * @author      Evio Shen
 * @version     1.0
 * @copyright	Distributed under the BSD License.
 */
(function( host ){
	'use strict';
	
	// rebuild indexof and lastindexof
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
	}
	
	/*
	 * 加载器基本方法
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
		host: _host,
		base: _base,
		file: _file,
		regx_root: /^\/.+/,
		regx_http: /^http\:\/\//i,
		regx_parent: /^\.\.\/.+/,
		regx_self: /^\.\/.+/,
		regx_local: /^\:.+/,
		regx_REQUIRE_RE: /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
		regx_SLASH_RE: /\\\\/g,
		maps: {},
		modules: {}
	});
	
	application.extend({
		
		// 去除重复方法
		unique: function(arr) {
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
		},
		
		//处理依赖关系方法
		parseDependencies: function(code) {
			var ret = [], m;
			
			this.regx_REQUIRE_RE.lastIndex = 0
			code = code.replace(this.regx_SLASH_RE, "");
	
			while ((m = this.regx_REQUIRE_RE.exec(code))) {
				if (m[2]) ret.push(m[2]);
			}
	
			return this.unique(ret);
		},
		
		// 复制JSON数据方法
		json: function( obj ){
			var ret = {};
			for ( var items in obj ){
				ret[items] = obj[items];
			}
			return ret;
		},
		
		// 获取当前SCRIPT文件方法
		getCurrentScript: function(){
			var scripts = head.getElementsByTagName("script");
	
			for ( var i = scripts.length - 1; i >= 0; i-- ) {
				var script = scripts[i];
				if (script.readyState === "interactive") {
					 return script;
				}
			}
		},
		
		// 接口转移方法
		proxy: function( fn, context ) {
			return function(){
				var args = arguments;
				return fn.apply(context, args);
			};
		},
		
		// 处理父路径方法
		doparent: function(p){
			var parentNode = p.replace(this.host, "");
			
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
				return this.doparent(this.host + "/" + parentArrays.join("/"));
			}else{
				return this.host + "/" + parentArrays.join("/");
			}
		},
		
		// 处理路径方法
		contrast: function( str, dirname ){
			if ( str === undefined || typeof str !== 'string' ){
				throw 'Appjs Error: Error Selector String.';
				return;
			};
			
			if ( this.maps[str] !== undefined ){ str = this.maps[str]; };
			if ( dirname === undefined ){ dirname = this.file; };
			
			// root like /a/b/c
			if ( this.regx_root.test(str) ){ str = this.host + str; }
			else if ( this.regx_http.test(str) ){ str = str; }
			// parent like ../a/b/c
			else if ( this.regx_parent.test(str) ){ str = this.doparent(dirname + '/' + str); }
			// self like ./a/b/c
			else if ( this.regx_self.test(str) ){ str = dirname + '/' + str.replace(/^\.\//, ''); }
			// local like :a/b/c
			else if ( this.regx_local.test(str) ){ str = str.replace(/^:/, ''); }
			// base like a/b/c
			else{ str = this.base + '/' + str; }
			
			return str;
		},
		
		// 自动补全文件名方法
		resolve: function( str, dirname ){
			str = this.contrast(str, dirname);
		
			if ( str === undefined ) return;
	
			if ( /\.css$/i.test(str) ){ str = str; }
			else if ( /\.js$/i.test(str) ){ str = str; }
			else{ str += '.js'; }
			
			return str;
		},
		
		request: function( uri, callback, charset ){
			var node = null;
	
			// 加载CSS文件
			if ( /\.css(?:\?|$)/i.test(uri) ){
				node = document.createElement("link");
				if ( charset ) node.charset = charset;
				node.rel = 'stylesheet'; 
				node.href = uri; 
				head.appendChild(node);
				callback.call(node);
			}
			
			// 加载js文件
			else if ( /\.js(?:\?|$)/i.test(uri) ){
				node = document.createElement("script");
				if ( charset ) node.charset = charset;
				this.jsload(node, callback);
				node.async = true; 
				node.src = uri; 
				head.insertBefore(node, head.firstChild);
			}
		},
		
		jsload: function( node, callback ){
			node.onload = node.onerror = node.onreadystatechange = function(){
				if ( /loaded|complete|undefined/i.test(node.readyState) ) {
					node.onload = node.onerror = node.onreadystatechange = null;
					callback.call(node);
				}
			}
		},
		
		inRequire: function( selector, dirname ){
			if ( selector === undefined ) return;
			var selector = this.resolve( selector, dirname );
			if ( this.modules[selector] === undefined ){
				return;
			}else{
				return this.modules[selector].exports;
			}
		},
		
		onMap: function( str, selector ){
			this.maps[str] = selector;
		}
	});
	
	application.extend('setBase', function( str ){
		if ( str === undefined ) { str = ""; }
		
		if ( str.length > 0 ){
			if ( /^http:/i.test(str) ){
				this.base = str;
				this.host = str.split('/').slice(0, 3).join('/');
			}else{
				this.base += '/' + str;
			}
		};
		
		if ( /\/$/.test(this.base) ){
			this.base = this.base.replace(/\/$/, '');
		};
	});
	
	application.extend('define', function( deps, factory ){
		if ( deps === undefined ){ return; };
		if ( factory === undefined ){ factory = deps; deps = []; };
		if ( typeof deps === "string" ){ deps = [deps]; };

		// 分析模块工厂函数的依赖关系
		if ( typeof factory === "function" ){ 
			deps = deps.concat(this.parseDependencies(factory.toString())); 
		};
		
		var meta = { deps: deps, factory: factory, exports: {} };
		
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
	
	application.extend('require', function( deps, callback, dirname ){
		if ( typeof deps === "string" ){ deps = [deps]; };
		
		var length = deps.length,
			ready = 0,
			keep = [],
			that = this;
			
		var __require = function( selector ){
			var __dirname = selector.split('/').slice(0, -1).join('/');
			return function(str){
				return that.inRequire(str, __dirname);
			}
		}
		
		var complete = function(){
			if ( ready === length ){
				var rets = [];
				for ( var j = 0 ; j < keep.length ; j++ ){
					var params = that.modules[keep[j]].factory(__require(keep[j]), that.modules[keep[j]].exports, that.modules[keep[j]]);
					if ( params ){
						that.modules[keep[j]].exports = params;
					}
					rets.push(that.modules[keep[j]].exports);
				}
				
				typeof callback === "function" && callback.apply( null, rets );
			}
		}

		// 并行循环
		for ( var i = 0 ; i < deps.length ; i++ ){
			var url = this.resolve( deps[i], dirname );
			keep.push(url);
			if ( this.watch && this.watchCallbacks && this.watchCallbacks.ready ){
				this.watchCallbacks.ready(url);
			}
			
			if ( this.modules[url] === undefined){
				this.request(url, function(){
					var id = this.src ? this.src : this.href,
						iscss = this.src ? false : true,
						__dirname = id.split('/').slice(0, -1).join('/');

					if ( isIE ){
						if ( !this.meta ){
							this.meta = { id: id, deps: [], factory: function(){}, exports: {} };
						};
						that.modules[id] = this.meta;
					}else{
						if ( !that.currentParams ){
							that.currentParams = { id: id, deps: [], factory: function(){}, exports: {} };
						}else{
							that.currentParams.id = id;
						};
						that.modules[id] = that.json(that.currentParams);
						that.currentParams = false;
					}
					
					ready++;
					
					if ( !iscss ) { this.parentNode.removeChild(this); };

					if ( that.watch && this.watchCallbacks && this.watchCallbacks.done ){
						that.watchCallbacks.done(id);
					}
					
					if ( that.modules[id].deps.length > 0 ){
						that.require(that.modules[id].deps, function(){
							complete();
						}, __dirname);
					}else{
						complete();
					}
				});
			}
			else{
				ready++;
				if ( that.watch && that.watchCallbacks && that.watchCallbacks.exist ){
					that.watchCallbacks.exist(url);
				}
				complete();
			}
		}
	});
	
	application.extend('initialize', function(){
		var that = this;
		/*
		 *!
		 * Global Define Method.
		 * Own deps factory
		 */
		window.define = function( deps, factory ){
			that.define(deps, factory);
		};
		
		/*
		 *!
		 * Global require Method.
		 * Own deps, callback, dirname
		 */
		window.require = function( deps, callback, dirname ){
			that.require(deps, callback, dirname);
		};
		
		// extend last versions.
		window.require.async = window.require;
	});
	
	window.module = new application();
	window.doing = false;

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