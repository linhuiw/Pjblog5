// JavaScript Document
$(function(){
	var htmls = function(json){
		if ( json && json.length > 0 ){
			var unchecked = 0, h = '<div id="noticehtml"><div class="close"><i class="fa fa-times"></i></div>';
			for ( var i = 0 ; i < json.length ; i++ ){
				if ( !json[i].checked ){
					unchecked++;
				}
				h += '<a href="' + json[i].href + '&access_token=' + window.token + '&oauth_consumer_key=' + window.appid + '&openid=' + window.openid + '" class="clearfix" target="_blank">'
				h += 	'<div class="avatar"><img src="' + json[i].user.avatar + '/36"></div>';
				h +=	'<div class="info">';
				h +=		'<div class="nick">回复人：' + json[i].user.nick + '</div>';
				h +=		'<div class="title">文章：' + json[i].title + '</div>';
				h +=		'<div class="domain">网站名：' + json[i].domain.name + '</div>';
				h +=		'<div class="domainsrc">网站地址：' + json[i].domain.src + '</div>';
				h +=		'<div class="reply">状态：' + (json[i].checked ? '已查阅' : '未查阅') + '</div>'
				h +=	'</div>';
				h += '</a>';
			};
			h += '</div>';
			$('body').append(h);
			var m = json.length + ' 个消息';
			if ( unchecked > 0 ){
				m += ', ' + unchecked + ' 个新消息';
			};
			$('#notice')
			.html(m)
			.on('click', function(){
				$('#noticehtml').show();
			});
			$('#noticehtml').find('.close i').on('click', function(){
				$('#noticehtml').hide();
			});
		}
	};
	$.ajax({
		type : "get",
		async: false,
		url : blog.AppPlatForm + '/oauth/getnotice?access_token=' + window.token + '&oauth_consumer_key=' + window.appid + '&openid=' + window.openid + '&type=comment&format=jsonp',
		dataType : "jsonp",
		jsonp: "callback",
		jsonpCallback:"callback",
		success : function(json){
			htmls(json.data);
		},
		error: function(){}
	});
});