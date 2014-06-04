define(function( require, exports, module ){
	if ( window.onTransitioned ) return; // 防止重复加载

	// 获取当前适用的transitionEnd事件名称
	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'OTransition'		:'oTransitionEnd',
	      'MozTransition'	:'transitionend',
	      'WebkitTransition':'webkitTransitionEnd',
	      'transition'		:'transitionend'
	    }

	    var transitionFixers = {
	      'transition'		:'',
	      'OTransition'		:'-o-',
	      'MozTransition'	:'-moz-',
	      'WebkitTransition':'-webkit-'
	    }
	 
	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	        	transitionName = transitions[t];
	        	transitionFixer = transitionFixers[t];
	            return;
	        }
	    }
	}

	// 事件名称
	var transitionName, transitionFixer;

	var sTransitionCallbackNameSpace = 'app-css3-transitionend-callback',
		sTransitionFocusName = 'app-css3-transitionend-focus';

	whichTransitionEvent();

	// 每个页面只能加载一次这个模块
	// window上只能有这一个事件，且不能重复绑定
	$(window).on(transitionName, function( params ){
		var target = params.target,
			proname = params.originalEvent.propertyName,
			datas = $(target).data(sTransitionCallbackNameSpace);

		if ( datas ){
			var _target = datas.element,
				_proname = datas.proname || (transitionFixer + 'transform'),
				_callback = datas.callback;

			if ( 
				(target === _target) && 
				(proname === _proname )
			){
				$.isFunction(_callback) && _callback.call(target);
				//$(target).data(sTransitionCallbackNameSpace, null);
			}
		}
	});

	/**
	 *	params:
	 *		transform:
	 *		{
	 *			/rotate/i,
	 *			/scale/i,
	 *			/skew/i,
	 *			/translate/i,
	 *			/matrix/i
	 *		}
	 */
	var transFormMatch = function( arg ){
			var transforms = [/rotate/i, /scale/i, /skew/i, /translate/i, /matrix/i];
			for ( var i = 0 ; i < transforms.length ; i++ ){
				if ( transforms[i].test(arg) ){
					return true;
				}
			}
			return false;
		};

	$.fn.transition = function(options){
		options = $.extend({
			p: transitionFixer + 'transform',
			d: 1000,
			f: 'ease-out',
			t: 0
		}, options || {});

		this
			.css(transitionFixer + 'transition-property', options.p)
			.css(transitionFixer + 'transition-duration', options.d + 'ms')
			.css(transitionFixer + 'transition-timing-function', options.f)
			.css(transitionFixer + 'transition-delay', options.t + 'ms');

		return this;
	}

	$.fn.clearTransition = function(callback){
		$(this)
			.css(transitionFixer + 'transition-property', '')
			.css(transitionFixer + 'transition-duration', '')
			.css(transitionFixer + 'transition-timing-function', '')
			.css(transitionFixer + 'transition-delay', '');

		var _this = this;

		setTimeout(function(){
			callback && callback.call(_this);
		}, 10);
	}

	$.fn.clearTransitionEndListener = function(){
		this.data(sTransitionCallbackNameSpace, null);
	}

	$.fn.transitionend = function( animateParams, proName, callback ){
		if ( $.isFunction(proName) ){
			callback = proName;
			proName = null;
		};

		this.each(function(){
			var reJSON = {};

			//if ( proName ){
				reJSON.proname = proName;
			//}

			reJSON.element = this;
			reJSON.callback = callback;

			$(this).data(sTransitionCallbackNameSpace, reJSON);

			var transformArray = [],
				commons = {};

			for ( var j in animateParams ){
				if ( transFormMatch(j) ){
					transformArray.push(j + '(' + animateParams[j] + ')');
				}else{
					commons[j] = animateParams[j];
				}
			}

			if ( transformArray.length > 0 ){
				commons[transitionFixer + 'transform'] = transformArray.join(' ');
			}

			$(this).css(commons);
		});

		return this;
	}

	window.onTransitioned = true;
});