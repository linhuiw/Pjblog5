(function(mod) {
    if ( 
		typeof exports == "object" || 
		typeof exports === 'function' && 
		typeof module == "object" 
	){ module.exports = mod(); }
    else if ( typeof define == "function" && define.amd ){
        return define([], mod);
    }
    else{
        window.fns = mod();
    }
})(function(){
	var iSet = new Class(function( data ){
		this.data = data;
		this.iBox = new iBox();
	});
	
	iSet.add('toHTML', function(){
		var html = '';
		for ( var i in this.data ){
			if ( this.iBox[this.data[i].type] ){
				html += this.iBox[this.data[i].type](i, this.data[i]);
			}
		}
		return html;
	});
	
	var iBox = new Class();
	
	/*
	 *	name: {
	 *		type: 'text',
	 *		value: 'xxx'
	 *	}
	 */
	iBox.add('text', function(name, data){
		return '<input type="text" value="' + data.value + '" name="' + name + '" />';
	});
	
	/*
	 *	name: {
	 *		type: 'textarea',
	 *		value: 'xxx',
	 *	}
	 */
	iBox.add('textarea', function(name, data){
		return '<textarea name="' + name + '">' + data.value + '</textarea>';
	});
	
	/*
	 *	name: {
	 *		type: 'password',
	 *		value: 'xxx'
	 *	}
	 */
	iBox.add('password', function(name, data){
		return '<input type="password" value="' + data.value + '" name="' + name + '" />';
	});
	
	/*
	 *	name: {
	 *		type: 'tel',
	 *		value: 'xxx'
	 *	}
	 */
	iBox.add('tel', function(name, data){
		return '<input type="tel" value="' + data.value + '" name="' + name + '" />';
	});
	
	/*
	 *	name: {
	 *		type: 'email',
	 *		value: 'xxx'
	 *	}
	 */
	iBox.add('email', function(name, data){
		return '<input type="email" value="' + data.value + '" name="' + name + '" />';
	});
	
	/*
	 *	name: {
	 *		type: 'radio',
	 *		value: 'xxx',
	 *		childrens: ['1', 1, 0, 'zzz']
	 *	}
	 */
	iBox.add('radio', function(name, data){
		var template = '<input type="radio" name="' + name + '" value="{value}" {selected} >',
			html = '';
			
		if ( data.childrens && data.childrens.length > 0 ){
			data.childrens.forEach(function( o ){
				var _template = template;
				_template = _template.replace('{value}', o);
				if ( data.value == (o + '') ){
					_template = _template.replace('{selected}', 'checked="checked"');
				}else{
					_template = _template.replace('{selected}', '');
				};
				
				html += _template;
			});
		}
		
		return html;
	});
	
	/*
	 *	name: {
	 *		type: 'radio',
	 *		value: 'xxx',
	 *		childrens: [
	 			{ text: '', value: '' }
	 		]
	 *	}
	 */
	iBox.add('select', function(name, data){
		var template = '<option value="{value}" {selected}>{text}</option>',
			html = '';
			
		if ( data.childrens && data.childrens.length > 0 ){
			html += '<select name="' + name + '">';
			data.childrens.forEach(function( o ){
				var _template = template;
				_template = _template.replace('{value}', o.value).replace('{text}', o.text);
				if ( data.value == (o.value) ){
					_template = _template.replace('{selected}', 'selected="selected"');
				}else{
					_template = _template.replace('{selected}', '');
				};
				
				html += _template;
			});
			html += '</select>';
		}
		
		return html;
	});
	
	/*
	 *	name: {
	 *		type: 'file'
	 *	}
	 */
	iBox.add('file', function(name, data){
		return '<input type="file" name="' + name + '" />';
	});
	
	return iSet;
});