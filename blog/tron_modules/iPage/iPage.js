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
        window.pagination = mod();
    }
})(function(){
	
	var pagination = new Class(function( PageCount, PageIndex, limits ){
		this.compile( PageCount, PageIndex, limits );
	});
	
	pagination.add('compile', function( PageCount, PageIndex, limits ){
		var pages = {};
		limits = limits || 9;
		
		// 数据校验
		if ( PageCount < 1 ){
			PageCount = 1;
		};
		
		if ( PageIndex < 1 ){
			PageIndex = 1;
		};
		
		if ( PageIndex > PageCount ){
			PageIndex = PageCount;
		};
		
		if ( limits > PageCount ){
			limits = PageCount;
		};
		
		if ( limits < 1 ){
			limits = 1;
		};
		
		// 取得模
		var leftdeep = 0, rightdeep = 0;
		if ( (limits - 1) % 2 === 1 ){
			leftdeep = Math.floor( (limits - 1) / 2 );
			rightdeep = leftdeep + 1;
		}else{
			leftdeep = rightdeep = (limits - 1) / 2;
		}
		
		var from = 0, to = 0;
		from = PageIndex - leftdeep;
		to = PageIndex + rightdeep;
		
		if ( from < 1 ){
			from = 1;
			to = limits;
		}
		else if ( to > PageCount ) {
			to = PageCount;
			form = PageCount - limits + 1;
		}
		
		pages.from = from;
		pages.to = to;
		pages.first = 1;
		pages.last = PageCount;
		pages.prev = PageIndex - 1 < 1 ? 1 : PageIndex - 1;
		pages.next = PageIndex + 1 > PageCount ? PageCount : PageIndex + 1;
		pages.limits = limits;
		pages.index = PageIndex;
		
		this.value = pages;
	});
	
	pagination.add('toArray', function(){
		var group = [];
		for ( var i = this.value.from ; i <= this.value.to ; i++ ){
			group.push(i);
		}
		return group;
	});
	
	return pagination;
});