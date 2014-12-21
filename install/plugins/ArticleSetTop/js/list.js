(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery'], mod);
    }
})(function ( $ ) {
	return new Class({
		initialize: function(){
			this.ajaxTop();
			this.ajaxRec();
		},
		ajaxTop: function(){
			var that = this;
			$('.act-favorites').on('click', function(){
				var id = $(this).attr('appid');
				var title = $('#art_' + id).text();
				$.post(window.async.top,		// post url
					{
						id: id, title: title	// post data
					},
					function( params ){			// success
						if ( params.success ){
							window.alert(params.message);
							setTimeout(function(){
								window.location.reload();
							}, 1000);
						}else{
							window.alert(params.message);
						}
					},
					'json'						// data type
				);
			});
		},
		ajaxRec: function(){
			var that = this;
			$('.act-recommend').on('click', function(){
				var id = $(this).attr('appid');
				var title = $('#art_' + id).text();
				$.post(window.async.rec,		// post url
					{
						id: id, title: title	// post data
					},
					function( params ){			// success
						if ( params.success ){
							window.alert(params.message);
							setTimeout(function(){
								window.location.reload();
							}, 1000);
						}else{
							window.alert(params.message);
						}
					},
					'json'						// data type
				);
			});
		}
	});
});