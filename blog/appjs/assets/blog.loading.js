define(function( require, exports, module ){
	var createDiv = function(){
		var div = document.createElement('div');
		$('body').append(div);
		$(div).addClass('dialog');
		return div;
	}
	
	var removeDiv = function(element){
		if ( element ) { $(element).remove(); };
	}
	
	var timer;
	
	$(window).on('resize', function(){
		var masker = document.getElementById('masker'),
			loading = document.getElementById('loading'),
			success = document.getElementById('success'),
			error = document.getElementById('error'),
			centeror = document.getElementById('centeror');
		
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
			$(loading).css({ "top": (($(window).height() - $(loading).outerHeight()) / 2) + "px", "left": (($(window).width() - $(loading).outerWidth()) / 2) + "px" });
		};
		
		if ( centeror ){
			$(centeror).css('position', 'fixed');
			$(centeror).css({ "top": (($(window).height() - $(centeror).outerHeight()) / 2) + "px", "left": (($(window).width() - $(centeror).outerWidth()) / 2) + "px" });
		};
		
		if ( success ){ $(success).css('position', 'fixed'); $(success).css({ "top": "52px", "right": "20px" }); };
		if ( error ){ $(error).css('position', 'fixed'); $(error).css({ "top": "52px", "right": "20px" }); };
	});
	
	exports.loading = function(text){
		var masker = document.getElementById('masker'),
			loading = document.getElementById('loading');
		
		this.close();
		
		if ( !masker ){
			masker = createDiv();
			masker.id = 'masker';
		}
		
		if ( !loading ){
			loading = createDiv();
			loading.id = 'loading';
			loading.innerHTML = text ? '<i class="fa fa-refresh fa-spin"></i> ' + text : '<i class="fa fa-refresh fa-spin"></i> 正在发送数据，请稍后..';
		}else{
			loading.innerHTML = text ? '<i class="fa fa-refresh fa-spin"></i> ' + text : '<i class="fa fa-refresh fa-spin"></i> 正在发送数据，请稍后..';
		}
		
		$(window).trigger('resize');
	};
	
	exports.success = function(text){
		var masker = document.getElementById('masker'),
			success = document.getElementById('success'),
			that = this;
			
		this.close();
		
		if ( !success ){
			success = createDiv();
			success.id = 'success';
			success.innerHTML = '<h5><i class="fa fa-check"></i> Server Success 200 :</h5><div class="msg">' + (text || '操作成功') + '</div>';
			$(success).addClass('animated fadeInDown')
		}
			
		$(window).trigger('resize');
		timer && clearTimeout(timer);
		timer = setTimeout(function(){ that.close(); }, 3000);
	};
	
	exports.error = function(text){
		var error = document.getElementById('error'),
			that = this;
			
		this.close();
		
		if ( !error ){
			error = createDiv();
			error.id = 'error';
			error.innerHTML = '<h5><i class="fa fa-times"></i> Server Error 500 :</h5><div class="msg">' + (text || '服务端500错误，请联系管理员或者开发者！') + '</div>';
			$(error).addClass('animated fadeInDown')
		}
			
		$(window).trigger('resize');
		timer && clearTimeout(timer);
		timer = setTimeout(function(){ that.close(); }, 3000);
	};
	
	exports.center = function(html){
		var centeror = document.getElementById('centeror'),
			masker = document.getElementById('masker'),
			that = this;
		
		this.close();
		
		masker = createDiv();
		masker.id = 'masker';
		$(masker).css({
			opacity: ".5",
			"background-color": "#000",
			zIndex: 99998
		});
		
		if ( !centeror ){
			centeror = createDiv();
			centeror.id = 'centeror';
			centeror.innerHTML = html;
			$(centeror).addClass('animated bounceIn').css({
				zIndex: 99999
			});
		}else{
			centeror.innerHTML = html;
		}
		
		$(window).trigger('resize');
		
		return centeror;
	}
	
	exports.close = function(){
		removeDiv(document.getElementById('loading')); 
		removeDiv(document.getElementById('success')); 
		removeDiv(document.getElementById('error')); 
		removeDiv(document.getElementById('centeror'));
		removeDiv(document.getElementById('masker'));
	};
});