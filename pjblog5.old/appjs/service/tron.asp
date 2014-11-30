<%@LANGUAGE="JAVASCRIPT" CODEPAGE="65001"%>
<script runat="SERVER" language="VBSCRIPT">
Function VB_AscB( s )
	VB_AscB = AscB( s )
End Function

Dim VB_BNCRLF : VB_BNCRLF = ChrB(13) & ChrB(10)
Dim VB_DOUBLEBNCRLF : VB_DOUBLEBNCRLF = VB_BNCRLF & VB_BNCRLF

Function VB_DRIVER( formData )
	VB_DRIVER = LeftB( formData, CInt( InstrB( formData, VB_BNCRLF ) ) - 1 )
End Function

Function VB_INSERTB( formdata, divider )
	VB_INSERTB = InstrB( formdata, divider )
End Function

Function VB_INSERTBS( startpos, formdata, divider )
	VB_INSERTBS = InstrB( startpos, formdata, divider )
End Function

Function VB_LENB( divider )
	VB_LENB = LenB( divider )
End Function

Function VB_MIDBS( a, b, c )
	VB_MIDBS = MidB( a, b, c )
End Function

Function VB_MIDB( a, b )
	VB_MIDB = MidB( a, b )
End Function
</script>
<%
Response.Charset = "UTF-8";
Response.Buffer = true;
Server.ScriptTimeOut = 999;
Session.CodePage = 65001;
Session.LCID = 2057;
Response.Charset = "UTF-8";

var JSON, Library, module, require, exports, contrast, resove, include, Class, LoadCssFile, LoadJsFile, LoadJscript;
var __filename = Server.MapPath(Request.ServerVariables("SCRIPT_NAME")),
	__dirname = Server.MapPath("./");
	
// 兼容前端define
var define = function(){};

(function(){
	'use strict';
	
	// JavaScript Document
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
	
	if ( ![].forEach ){
		Array.prototype.forEach = function( callback ){
			for ( var i = 0 ; i < this.length ; i++ ){
				if ( typeof callback === 'function' ){
					callback.call(this, this[i], i);
				}
			}
		};
	};
	
	if ( typeof JSON === "undefined" ){ JSON = new Object(); };
	
	var readVariableType = function( object, type ){
		if ( !type ){
			return Object.prototype.toString.call(object).toLowerCase();
		}else{
			return Object.prototype.toString.call(object).toLowerCase() === "[object " + type + "]"; 
		}
	};

	Class = function(){
		var ProtectMethods = ['__constructor__'],
			argc = arguments,
			that = this;

		var factory = function(){
			this.__constructor__ = 'ECM.CLASS.FACTORY';
			return typeof this.initialize === 'function' ? this.initialize.apply(this, arguments) : this;
		};
		
		this.constructor = factory;
		this.constructor.__constructor__ = this.__constructor__ = 'ECM.CLASS';
		
		this.constructor.extend = function( object ){
			if ( object.__constructor__ && object.__constructor__ === 'ECM.CLASS' ){
				if ( object.prototype ){
					for ( var i in object.prototype ){
						if ( ProtectMethods.indexOf(i) === -1 ){
							that.constructor.prototype[i] = object.prototype[i];
						}
					}
				}
			};
			
			return that.constructor;
		}
		
		this.constructor.toggle = function( objects ){
			if ( !objects ){ return that.constructor; };
			if ( readVariableType(objects) !== 'array' ){
				objects = [objects];
			};
			
			for ( var i = 0 ; i < objects.length ; i++ ){
				that.constructor.extend(objects[i]);
			}
			
			return that.constructor;
		}
		
		this.constructor.add = function(key, value){
			if ( !value ){
				for ( var i in key ){
					that.constructor.add(i, key[i]);
				}
			}else{
				that.constructor.prototype[key] = value;
			}
			
			return that.constructor;
		}

		if ( argc.length === 2 ){
			this.constructor.extend(argc[0]);
			this.constructor.add(argc[1]);
		}else if ( argc.length === 1 ){
			if ( argc[0] && argc[0].__constructor__ && argc[0].__constructor__ === 'ECM.CLASS' ){
				this.constructor.extend(argc[0]);
			}else{
				this.constructor.add(argc[0]);
			}
		}
		
		return this.constructor;
	};
	
	LoadJscript = function(callback, params){
		Library.log('<script language="javascript" type="text/javascript">' + ('(' + callback.toString() + ')(' + JSON.stringify(params) + ');') + '</script>\n');
	};
	
	LoadCssFile = function(urls){
		if ( !readVariableType(urls, 'array') ){
			urls = [urls];
		}
		for ( var i = 0 ; i < urls.length ; i++ ){
			if ( urls[i] && urls[i].length > 0 ){
				Library.log('<link rel="stylesheet" type="text/css" href="' + urls[i] + '">\n');
			}
		}
	};
	
	LoadJsFile = function(urls){
		if ( !readVariableType(urls, 'array') ){
			urls = [urls];
		}
		for ( var i = 0 ; i < urls.length ; i++ ){
			if ( urls[i] && urls[i].length > 0 ){
				Library.log('<script language="javascript" type="text/javascript" src="' + urls[i] + '"></script>\n');
			}
		}
	};
	
	var apptions = {
		host: Server.MapPath("/"),
		base: Server.MapPath("/"),
		map: {},
		charset: 'utf-8',
		modules: {},
		com_conn: 'ADODB.CONNECTION',
		com_record: 'ADODB.RECORDSET',
		com_fso: 'Scripting.FileSystemObject',
		com_stream: 'Adodb.Stream',
		com_xmlhttp: 'Microsoft.XMLHTTP',
		com_xml: 'Microsoft.XMLDOM',
		com_winhttp: 'WinHttp.WinHttpRequest.5.1',
		type: readVariableType
	};
	
	apptions.modules[__filename] = {};
	
	var app = new Class(apptions);
	
	app.add({
		
		customReplace: function( data ){
			return data
					.replace(/\\/g, '\\\\')
					.replace(/\"/g, '\\"')
					.replace(/\r/g, '\\r')
					.replace(/\f/g, '\\f')
					.replace(/\n/g, '\\n')
					.replace(/\s/g, ' ')
					.replace(/\t/g, '\\t');
		},
		
		textformat: function(t){
			if ( t.length > 0 ){
				return ";Response.Write(\"" + this.customReplace(t) + "\");";
			}else{
				return "";
			}
		},
		
		loader: function( path ){
			var f = new ActiveXObject(this.com_fso),
				text;
				
			if ( f.FileExists(path) ){
				try{
					var o = new ActiveXObject(this.com_stream);
						o.Type = 2; o.Mode = 3; 
						o.Open(); 
							o.Charset = this.charset; 
							o.Position = o.Size; 
							o.LoadFromFile(path);
						text = o.ReadText;
						o.Close;
						o = undefined;
				}catch(e){ text = ''; };
			}else{ text = ''; }
			
			return text;
		},
		
		syntax: function( selector ){
			if ( !/\.asp$/i.test(selector) ){ return ''; }
			
			var container = this.loader(selector), percent = '%', text = '';
			var arrs = container.split('<' + percent);

			for ( var i = 0 ; i < arrs.length ; i++ ){
				var r = arrs[i].indexOf(percent + '>');
				if ( r > -1 ){
					var temp = this.textformat(arrs[i].substring(r + 2));
					text += (/^\=/.test(arrs[i]) ? ";Response.Write(" + arrs[i].substring(1, r) + ");" : arrs[i].substring(0, r)) + temp;
				}else{
					text += this.textformat(arrs[i]);
				}
			}
			return text;
		},
		
		proxy: function( fn, context ) {
			return function(){
				var args = arguments;
				return fn.apply(context, args);
			};
		},
		
		doparent: function( p ){
			var parentNode = p.replace(this.host, "");
			if ( /^\\/.test(parentNode) ){ parentNode = parentNode.replace(/^\\/, ""); };
			var parentArrays = parentNode.split("\\"),
				index = parentArrays.indexOf("..");
				
			if ( index > -1 ){
				index--;
				if ( index < 0 ){
					index = 0;
					parentArrays.splice(0, 1);
				}else{
					parentArrays.splice(index, 2);
				}
				return this.doparent(this.host + "\\" + parentArrays.join("\\"));
			}else{
				return this.host + "\\" + parentArrays.join("\\");
			}
		},
		
		createGlobalFileByAsa: function(marks){
			var globalAsa = "/global.asa",
				fso = new ActiveXObject(this.com_fso),
				tpl = '<object id="' + marks + '" runat="server" scope="Application" progid="Scripting.Dictionary"></object>\n<script language="JScript" runat="Server">\nfunction Session_OnStart(){};\nfunction Session_OnEnd(){};\nfunction Application_OnStart(){};\nfunction Application_OnEnd(){};\n</script>';
			
			if ( !fso.FileExists(Server.MapPath(globalAsa)) ){
				var stream = new ActiveXObject(coms.stream);
					stream.Type = 2; 
					stream.Mode = 3; 
					stream.Open();
					stream.Charset = Response.Charset;
					stream.Position = stream.Size; 
					stream.WriteText = tpl;
					stream.SaveToFile(Server.MapPath(globalAsa), 2);
					stream.Close;
					stream = null;
			}        

			fso = null;             
		},
		
		onMap: function( str, selector ){
			this.map[str] = selector;
			return this;
		},
		
		log: function( str ){
			Response.Write(str);
		},
		
		json: function( jsonstr ){
			Response.Write(JSON.stringify(jsonstr));
		},
		time: new Date().getTime(),
		timer: function(){
			return (new Date().getTime()) - this.time;
		}
	});
	
	app.add('request', function( selector, dir ){
		if ( /^\w:\\.+$/.test(selector) ){
			return selector;
		}
		
		if ( this.map[selector] ){
			selector = this.map[selector];
		}
		
		var host = this.host,
			base = this.base,
			local = dir;

		if ( /^\//.test(selector) ){ selector = host + selector.replace(/\//g, "\\"); }
		else if( /^\.\//.test(selector) ){ selector = local + "\\" + selector.replace(/^\.\//, "").replace(/\//g, "\\"); }
		else if ( /^\.\.\//.test(selector) ){ selector = this.doparent(local + "\\" + selector.replace(/\//g, "\\")); }
		else{ selector = base + "\\" + selector.replace(/\//g, "\\"); }

		return selector;
	});
	
	app.add('setBase', function(str){
		if ( str === undefined ) { str = ""; }

		if ( str.length > 0 ){
			this.base = this.host + "\\" + str
		};
		
		if ( /\\+$/.test(this.base) ){
			this.base = this.base.replace(/\\+$/, '');
		};
	});
	
	var helper = Library = new app(),
		factory = new Class({
			exports: {}
		});
	
	factory.add('initialize', function( file, dir ){
		this.__shortname = file;
		this.__dirname = dir;
	});
	
	factory.add('include', function( path, params ){
		var sytaxText = helper.syntax(this.contrast(path));
		var allParams = [], allParamsValue = [];
		if ( params ){
			for ( var i in params ){
				allParams.push(i);
				allParamsValue.push(params[i]);
			}
		}
		var wrapper = ['return function (' + allParams.join(', ') + ') { ', sytaxText, '};'].join("\n"),
			__module = (new Function(wrapper))();

		__module.apply(this, allParamsValue);
	});
	
	factory.add('getFullFileName', function(){
		this.__filename = helper.request( this.__shortname, this.__dirname );
		if ( !/\.asp$/i.test(this.__filename) && !/\.js$/i.test(this.__filename) ){
			this.__filename += ".js";
		}
	});
	
	factory.add('checkModuleExist', function(){
		// Library.log('dir: ' + this.__dirname + ' - file: ' + this.__filename + '<br />' );
		return helper.modules[this.__filename] !== undefined;
	});
	
	factory.add('loadModuleContent', function(){
		var content = helper.loader(this.__filename), 
			percent = '%';
			
		if ( /\.asp$/i.test(this.__filename) ){
			var a = content.indexOf('<' + percent);
			var b = content.lastIndexOf(percent + '>');
			if ( a > -1 && b > -1 ){
				content = content.substring(a + 2, b);
			}
		}
		
		this.content = content;
	});
	
	factory.add('packageModuleContent', function(){
		var wrapper = ['return function (exports, require, module, include, __filename, __dirname, contrast, resolve) { ', this.content, '};'].join("\n"),
			__module = (new Function(wrapper))();
			
		return __module;
	});
	
	factory.add('reBuildModule', function(){
		this.getFullFileName();
		if ( this.checkModuleExist() ){
			return helper.modules[this.__filename];
		}else{
			this.loadModuleContent();
			this.exports = {};
			this.__dirname = this.__filename.split('\\').slice(0, -1).join('\\');
			var __module = this.packageModuleContent(),
				__retObj = __module(
					this.exports, 											// exports
					helper.proxy(this.inRequire, this), 					// require
					this, 													// module
					helper.proxy(this.include, this), 						// include
					this.__filename, 										// __filename
					this.__dirname,											// __dirname
					helper.proxy(this.contrast, this), 						// contrast
					helper.proxy(this.resolve, this)						// resolve
				);
			
			if ( __retObj ){
				this.exports = __retObj;
			}
			
			helper.modules[this.__filename] = this.exports;
			
			return this.exports;
		}
	});
	
	factory.add('inRequire', function( file ){
		var fc = new factory( file, this.__filename.split('\\').slice(0, -1).join("\\") );
		return fc.reBuildModule();
	});
	
	factory.add('contrast', function( file ){
		if ( file === '.' ){ file = ''; };
		return helper.request( file, this.__dirname );
	});
	
	factory.add('resolve', function( file ){
		var path = this.contrast( file );
		if ( !/\.asp$/i.test(path) && !/\.js$/i.test(path) ){
			path += ".js";
		}
		return path;
	});

	
	module = new factory( __filename, __dirname );
	module.reBuildModule();
	
	require = module.inRequire;
	exports = module.exports;
	contrast = module.contrast;
	resolve = module.resolve;
	include = module.include;
})();

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
%>