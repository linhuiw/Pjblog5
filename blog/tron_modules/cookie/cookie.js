(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery'], mod);
    }
    else {
        window.md5 = mod(jQuery);
    }
})(function ( $ ) {
	var server = false;
	if ( !$ ){
		var jQuery = $ = {}, server = true;
		$.isFunction = function(fn){ return typeof fn === 'function'; }
		$.isArray = function(fn){ return typeof fn === 'array'; }
		var hasOwnProperty  = Object.prototype.hasOwnProperty,  
			toString = Object.prototype.toString,
			isPlainObject = function(obj){  
				if(!obj || toString.call(obj) !== "[object Object]" ||obj.nodeType ||obj.setInterval){  
					return false;  
				}  
 
				if(obj.constructor && !hasOwnProperty.call(obj,"constructor")  
				   && !hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf")){  
					 return false;  
				}
				
				var key;  
				for(key in obj){}    
				return key === undefined || hasOwnProperty.call(obj,key);  
			};
			
		$.isPlainObject = isPlainObject;
		$.extend = function (){
			var target = arguments[0] || {},      
				i = 1,
				length = arguments.length,
				deep = false,      
				options,       
				name,      
				src,      
				copy;  

				if (typeof target === "boolean") {    
					deep = target;  
					target = arguments[1] || {}; 
					i = 2;  
				}  

				if (typeof target !== "object" && !jQuery.isFunction(target)) {  
					target = {};  
				}  
				if (length === i) {    
					target = this;  
					--i;  
				}  

				for (; i < length; i++) {  
					if ((options = arguments[i]) != null) {  
						for (name in options) {    
							src = target[name];  
							copy = options[name];  

							if (target === copy) {  
								continue;  
							}  

							if (deep && copy && (jQuery.isPlainObject(copy) || jQuery.isArray(copy))) {  
								var clone = src && (jQuery.isPlainObject(src) || jQuery.isArray(src)) ? src : jQuery.isArray(copy) ? [] : {};  
								target[name] = jQuery.extend(deep, clone, copy);  

							} else if (copy !== undefined) {   
								target[name] = copy;  
							}  
						}  
					}  
				}  

				return target;  
		};
		var document = {};
	}else{
		var jQuery = $;
	}

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
				// This is a quoted cookie as according to RFC2068, unescape...
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
				// Replace server-side written pluses with spaces.
				// If we can't decode the cookie, ignore it, it's unusable.
				// If we can't parse the cookie, ignore it, it's unusable.
				s = decodeURIComponent(s.replace(pluses, ' '));
				return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

			// Write
			if (value !== undefined && !$.isFunction(value)) {
					options = $.extend({}, config.defaults, options);

					if (typeof options.expires === 'number') {
							var days = options.expires, t = options.expires = new Date();
							t.setDate(t.getDate() + days);
					}
					
					var c = [
							encode(key), '=', stringifyCookieValue(value),
							options.expires ? '; expires=' + options.expires.toUTCString() : '',
							options.path    ? '; path=' + options.path : '',
							options.domain  ? '; domain=' + options.domain : '',
							options.secure  ? '; secure' : ''
					].join('');

					if ( server ){
						c = c.replace(/\;$/, '');
						c += "; HttpOnly";
						Response.AddHeader("Set-Cookie", c);
						return c;
					}else{
						window.document.cookie = c;
						return c;
					};
			}

			// Read

			var result = key ? undefined : {};

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			var cookies;
			if ( server ){
				cookies = String(Request.ServerVariables('HTTP_COOKIE')) || '';
				if ( cookies == 'undefined' ){
					cookies = '';
				}
				cookies = cookies && cookies.length > 0 ? cookies.split('; ') : [];
			}else{
				cookies = document.cookie ? document.cookie.split('; ') : [];
			}

			for (var i = 0, l = cookies.length; i < l; i++) {
					var parts = cookies[i].split('=');
					var name = decode(parts.shift());
					var cookie = parts.join('=');
					if (key && key === name) {
							// If second argument (value) is a function it's a converter...
							result = read(cookie, value);
							break;
					}

					// Prevent storing a cookie that we couldn't decode.
					if (!key && (cookie = read(cookie)) !== undefined) {
							result[name] = cookie;
					}
			}

			return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
			if ($.cookie(key) === undefined) {
					return false;
			}

			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return !$.cookie(key);
	};
	
	if ( server ){
		return $;
	}
});