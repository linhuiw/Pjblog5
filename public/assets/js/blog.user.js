// JavaScript Document
define('appjs/assets/jquery.lsotope', function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.waterFull();
			this.onSearch();
			this.onGroup();
			
			$("a[app-p='ChangeStatus']").data('callback', function(params){
				var t = params.status ? '已被禁止登陆本站' : '正常，可登陆。';
				$(this).parents('.item:first').find('.status').html('<i class="fa fa-dot-circle-o"></i>' + t);
			});
			
			$("a[app-p='RemoveUser']").data('callback', function(params){
				$('.waterfull').isotope('remove', $(this).parents('.item:first').get(0)).isotope('layout');
			});
		},
		waterFull: function(){ 
			$('.waterfull')
			.isotope({ 
				itemSelector: '.waterfull .item' 
			}); 
		},
		onSearch: function(){
			$('#search').on('click', function(){
				var val = $('#keyword').val();
				if ( val.length > 0 ){
					window.location.href = blog.web + '/control.asp?m=user&n=' + val;
				}
			});
			$('#keyword').on('keyup', function(event){
				if ( event.keyCode === 13 ){
					$('#search').trigger('click');
				}
			});
		},
		onGroup: function(){
			var that = this;
			$('.ChangeGroup').on('click', function(){
				var uid = $(this).attr('app-id'),
					gid = $(this).attr('app-group'),
					_this = this;
				
				var div = $(this).parents('.info:first').find('.des .group span');
				var html = div.html();
				div.html(that.makeGroupSelect(Number(gid)));
				div.find('a.fa').on('click', function(){
					div.html(html);
				});
				div.find('select').on('change', function(){
					var _gid = $(this).val();
					that.tip.loading();
					$.getJSON('public/async.asp', {
						m: 'user',
						p: 'change',
						uid: uid,
						gid: _gid
					}, function( params ){
						if ( params.success ){
							that.tip.success(params.message);
							div.html(window.group[params.gid + '']);
							$(_this).attr('app-group', params.gid);
						}else{
							that.tip.error(params.message);
						}
					});
				});
			});
		},
		makeGroupSelect: function(id){
			var h = '<select class="changeGroup">';
			for ( var i = 0 ; i < window.groups.length ; i++ ){
				if ( id === window.groups[i].id ){
			h +=		'<option value="' + window.groups[i].id + '" selected="selected">' + window.groups[i].name + '</option>';
				}else{
			h +=		'<option value="' + window.groups[i].id + '">' + window.groups[i].name + '</option>';		
				}
			}
			h +=	'</select>';
			h += '<a href="javascript:;" class="fa fa-times"></a>';
			return h;
		},
		tip: require('appjs/assets/blog.loading')
	});
});