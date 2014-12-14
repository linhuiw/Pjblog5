(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define(['jquery', 'jquery.form.min'], mod);
    }
    else {
    	if ( !window.blog ){
    		window.blog = {
    			control: {}
    		}
    	}
        window.blog.control.common = mod(window.jQuery);
    }
})(function ( $ ) {
    
	var common = new Class(function(){
		this.ajaxForm();
		this.getNotice();
	});
	
	common.add('ajaxForm', function(){
		$('.ajax-form').each(function(){
			var _this = this;
			$(this).submit(function(){
				$(this).ajaxSubmit({
					dataType: 'json',
					beforeSubmit: function(){
						if ( window.doing ){
							return false;
						}else{
							window.doing = true;
						}
					},
					success: function(msg){
						window.doing = false;
						if ( msg.success ){
							$(_this).trigger('form.ajaxSuccess');
							alert('操作成功');
						}else{
							$(_this).trigger('form.ajaxFailure');
							alert(msg.message);
						}
					},
					error: function(){
						$(_this).trigger('form.ajaxError');
						window.doing = false;
						alert('服务端出错');
					}
				});
				return false;
			});
		});	
	});
	
	common.add('getNotice', function(){
		var url = blog.appsite + '/oauth/getnotice?access_token=' + window.blog.user.token + '&oauth_consumer_key=' + window.blog.appid + '&openid=' + window.blog.user.openid + '&type=system&format=jsonp';
		$.ajax({
			type : "get",
			async: false,
			url : url,
			dataType : "jsonp",
			jsonp: "callback",
			jsonpCallback:"callback",
			success : function(json){
				if ( json.error === 0 ){
					gruntNoticeHTML(json.data);
				}
			},
			error: function(){}
		});
	});
	
	function gruntNoticeHTML(data){
		var a = 0, b = 0, c = 0, m = [];
		var template = $('#notice_template').html();
		data.forEach(function(o){
			if ( o.checked ){ a++; }else{ b++; };
			c++;
			m.push(o);
		});
		$('#notice_checked').text(a);
		$('#notice_unchecked').text(b);
		$('#notice_total').text(c);
		if ( c > 0 ){
			$('#notice_total').addClass('label-warning');	
		}
		if ( a > 0 ){
			$('#notice_total').addClass('label-info');
		};
		if ( b > 0 ){
			$('#notice_total').addClass('label-danger');
		}
		if ( m.length > 0 ){
			$('#notice_list').html('<ul class="menu"></ul>');
			var ul = $('#notice_list').find('ul');
			m.forEach(function(o){
				var _ = template;
				_ = _.replace(/\{avatar\}/g, o.user.avatar);
				_ = _.replace(/\{title\}/g, o.title);
				_ = _.replace(/\{domain\_name\}/g, o.domain.name);
				_ = _.replace(/\{domain\_src\}/g, o.domain.src);
				_ = _.replace(/\{time\}/g, jsDateDiff(o.time / 1000));
				_ = _.replace(/\{href\}/g, o.href + '&access_token=' + window.blog.user.token + '&oauth_consumer_key=' + window.blog.appid + '&openid=' + window.blog.user.openid);
				ul.append(_);
			});
		}else{
			$('#notice_list').html('<div class="text-center">没有新消息</div>');
		}
	}
	
	
	function jsDateDiff(publishTime){       
		var d_minutes,d_hours,d_days;       
		var timeNow = parseInt(new Date().getTime()/1000);       
		var d;       
		d = timeNow - publishTime;       
		d_days = parseInt(d/86400);       
		d_hours = parseInt(d/3600);       
		d_minutes = parseInt(d/60);       
		if(d_days>0 && d_days<4){       
			return d_days+"天前";       
		}else if(d_days<=0 && d_hours>0){       
			return d_hours+"小时前";       
		}else if(d_hours<=0 && d_minutes>0){       
			return d_minutes+"分钟前";       
		}else{       
			var s = new Date(publishTime*1000);       
			// s.getFullYear()+"年";
			return (s.getMonth()+1)+"月"+s.getDate()+"日";       
		}       
	} 
	
	return common;

});
