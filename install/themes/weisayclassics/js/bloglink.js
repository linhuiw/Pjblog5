﻿// JavaScript Document
define(['appjs/assets/jquery.form.min'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.ajaxPost();
		},
		ajaxPost: function(){
			var that = this;
			$('#postform').ajaxForm({
				dataType: 'json',
				beforeSubmit: function(){
					if ( $("input[name='link_name']").size() > 0 && $("input[name='link_name']").val().length === 0 ){
						that.tip.error('请输入网站名称');
						return false;
					};
					if ( $("input[name='link_src']").size() > 0 && $("input[name='link_src']").val().length === 0 ){
						that.tip.error('请输入网站地址');
						return false;
					};
					that.tip.loading();
				},
				success: function( params ){
					if ( params.success ){
						that.tip.success(params.message);
						$('#postform').resetForm();
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				},
				error: function(){
					that.tip.error('链接出错');
				}
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});