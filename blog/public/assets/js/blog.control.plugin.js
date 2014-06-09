// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.onDeleteSystemPlugins();
			this.onInstallSystemPlugins();
		},
		onDeleteSystemPlugins: function(){
			$('.app-delete').data('callback', function(){ $(this).parents('.plugins:first').animate({ opacity: '0' }, 'slow', function(){ $(this).remove(); }); });
		},
		onInstallSystemPlugins: function(){
			$('.app-setup').data('callback', function(){ setTimeout(function(){ window.location.reload(); }, 2000) });
		},
		tip: require('appjs/assets/blog.loading')
	});
});