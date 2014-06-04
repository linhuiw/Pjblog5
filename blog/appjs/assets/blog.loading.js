define(function( require, exports, module ){
	var createDiv = function(){
		var div = document.createElement('div');
		$('body').append(div);
		return div;
	}
	
	exports.success = function( text ){
		tips(text, 'success');
	};
	
	exports.warning = function( text ){
		tips("错误信息：" + text, 'warning');
	};
	
	exports.info = function( text ){
		tips(text, 'info');
	};
	
	$(window).on('resize', function(){
		var masker = document.getElementById('masker'),
			loading = document.getElementById('loading');
		
		if ( masker ){
			$(masker).css({
				"position": "fixed",
				"top": "0px",
				"left": "0px",
				"height": $(window).height() + "px",
				"width": "100%"
			});
		};
		
		if ( loading ){
			$(loading).css('position', 'fixed');
			$(loading).css({
				"top": (($(window).height() - $(loading).outerHeight()) / 2) + "px",
				"left": (($(window).width() - $(loading).outerWidth()) / 2) + "px"
			});
		}
	});
	
	exports.loading = function(text){
		var masker = document.getElementById('masker'),
			loading = document.getElementById('loading');
		
		if ( !masker ){
			masker = createDiv();
			masker.id = 'masker';
		}
		
		if ( !loading ){
			loading = createDiv();
			loading.id = 'loading';
			loading.innerHTML = text || '<i class="fa fa-refresh fa-spin"></i> 正在发送数据，请稍后..';
		}
		
		$(window).trigger('resize');
	}
});