// JavaScript Document
define('appjs/assets/jquery.lsotope', function( require, exports, module ){
	
	var searchbox = $('.searchbox');
	var userbox = $('.userbox');
	var detailbox = $('.detailbox');
	var users = [];
	
	var local_nick, local_page;
	
	function ajaxGetMembers(nick, page, callback){
		local_nick = nick;
		local_page = page;
		
		$.post('public/async.asp?m=user&p=searchMembers', { nick: nick, page: page }, function(params){
			if ( typeof callback === 'function' ) {
				callback(params);
			};
		}, 'json');
	}
	
	return new Class({
		initialize: function(){
			this.onSearchBox();
		},
		onSearchBox: function(){
			var that = this;
			searchbox
				.on('getAllMembers', function(event, callback){
					ajaxGetMembers('', 1, callback);
				})	
				.on('trackMoveTop', function(){
					var SearchAll = $(this).data('SearchAll');
					if ( SearchAll ){
						$(this).removeClass('searchbox-top');
						$(this).find('.search-all i').attr('class', 'fa fa-bars');
						$(this).data('SearchAll', false);
					}else{
						$(this).addClass('searchbox-top');
						$(this).find('.search-all i').attr('class', 'fa fa-close');
						$(this).data('SearchAll', true);
					}
				})
				.on('postSearch', function(){
					var keyword = $('#user-box .searchbox .search-input input').val();
					if ( keyword.length > 0 ){
						that.tip.loading();
						ajaxGetMembers(keyword, 1, function(params){
							if ( params.success ){
								that.tip.close();
								if ( !searchbox.data('SearchAll') ) { $('.searchbox').trigger('trackMoveTop'); } ;
								that.onLoadMembers(params.arrays, params.pages);
							}else{
								that.tip.error(params.message);
							}
						});
					}
				});
				
			searchbox
				.find('.search-all')
				.on('click', function(){
					if ( !searchbox.data('SearchAll') ){
						that.tip.loading();
						$('.searchbox').trigger('getAllMembers', function(params){
							if ( params.success ){
								that.tip.close();
								$('.searchbox').trigger('trackMoveTop');
								that.onLoadMembers(params.arrays, params.pages);
							}else{
								that.tip.error(params.message);
							}
						});
					}else{
						$('.searchbox').trigger('trackMoveTop');
						userbox.empty().removeClass('userbox-bom');
						detailbox.empty().hide();
					}
				});
				
			searchbox
				.find('.do-search')
				.on('click', function(){
					$('.searchbox').trigger('postSearch');
				});
				
			searchbox
				.find('.search-input input')
				.on('keyup', function(event){
					if ( event.keyCode === 13 ){
						searchbox.find('.do-search').trigger('click');
					}
				});
		},
		
		onLoadMembers: function(params, pages){
			var that = this;
			
			if ( params.length === 0 ){
				setTimeout(function(){
					userbox.html('<div class="dump animated fadeIn"><i class="fa fa-github-alt"></i> 抱歉，没有找到用户数据！</div>');
				}, 500);
			}else{
				userbox.empty();
				users = {};
				for ( var i = 0 ; i < params.length ; i++ ){
					var face = document.createElement('div'),
						delay = i * 50,
						html = '<div class="face"><img src="' + params[i].avatar + '?s=36" onerror="this.src=\'http://app.webkits.cn/avatars/default.png\'" /></div><div class="nick wordCut" title="' + params[i].nick + '">' + params[i].nick + '</div>';
						
					userbox.append(face);
					users[params[i].id + ''] = params[i];
					
					$(face)
						.html(html)
						.addClass('animated flipInX items')
						.attr('app-id', params[i].id)
						.css({
							'-webkit-animation-delay': delay + 'ms',
							'-moz-animation-delay': delay + 'ms',
							'-o-animation-delay': delay + 'ms',
							'animation-delay': delay + 'ms',
						})
						.on('click', function(){
							var id = $(this).attr('app-id');
							that.onGetPrivate(id);
						});
						
					
				}
				userbox.prepend(that.onMakePages(pages));
				
				userbox.find('.pages a').on('click', function(){
					var page = Number($(this).text());
					that.onPageClick(page);
				});
			}
		},
		
		onGetPrivate: function(id){
			var that = this;
			
			var zhtml = '<a href="javascript:;" title="删除用户" class="fright AutoSendAjax" app-id="' + id + '" app-m="user" app-p="RemoveUser" app-c="删除用户将删除这个用户下的所有评论和留言信息！请慎重！确定要删除吗？"><i class="fa fa-trash-o"></i></a>'
			+			'<a href="javascript:;" title="改变用户登录状态" class="fright AutoSendAjax" app-id="' + id + '" app-m="user" app-p="ChangeStatus"><i class="fa fa-power-off"></i></a>'
			+			'<a href="javascript:;" title="修改用户组群" class="fright ChangeGroup" app-id="' + id + '" app-group="' + users[id].group + '"><i class="fa fa-bug"></i></a>';
			
			if ( window.uid === Number(id) ){
				zhtml = '';
			};
						
			var html = 		'<div class="details clearfix animated zoomInUp">'
						+		'<div class="face"><img src="' + users[id].avatar + '?s=36" onerror="this.src=\'http://app.webkits.cn/avatars/default.png\'" /></div>'
						+		'<div class="info">'
						+			'<div class="nick p">' + zhtml + users[id].nick + '</div>'
						+			'<div class="status p"><i class="fa fa-dot-circle-o"></i><span>状态：</span><b>' + (users[id].forbit ? '已被禁止登陆本站': '正常，允许登陆。') + '</b></div>'
						+			'<div class="group p"><i class="fa fa-group"></i><span>组群：</span><b>' + window.group[users[id].group + ''] + '</b></div>'
						+			'<div class="sex p"><i class="fa fa-child"></i><span>性别：</span><b>' + users[id].sex + '</b></div>'
						+			'<div class="mail p"><i class="fa fa-envelope-o"></i><span>邮箱：</span><b>' + users[id].mail + '</b></div>'
						+			'<div class="web p"><i class="fa fa-home"></i><span>主页：</span><b>' + users[id].web + '</b></div>'
						+			'<div class="birthday p"><i class="fa fa-calendar"></i><span>生日：</span><b>' + users[id].birthday + '</b></div>'
						+			'<div class="logindate p"><i class="fa fa-unlock-alt"></i><span>登录：</span><b>' + users[id].logindate + '</b></div>'
						+			'<div class="address p"><i class="fa fa-road"></i><span>地址：</span><b>' + users[id].address + '</b></div>'
						+		'</div>'
						+	'</div>';
			userbox.addClass('userbox-bom');
			detailbox.show().html(html);
			that.onDateBind(detailbox);
			
			detailbox.find('.ChangeGroup').on('click', function(){
				var uid = $(this).attr('app-id'),
					gid = $(this).attr('app-group'),
					_this = this;
				
				var div = $(this).parents('.info:first').find('.group b');
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
							users[id].group = Number(gid);
						}else{
							that.tip.error(params.message);
						}
					});
				});
			});
		},
		
		onDateBind: function(element){
			element.find("a[app-p='RemoveUser']").data('callback', function(params){
				var id = $(this).attr('app-id');
				$("#user-box .userbox .items[app-id='" + id + "']").remove();
				detailbox.empty().hide();
				userbox.removeClass('userbox-bom');
			});
			element.find("a[app-p='ChangeStatus']").data('callback', function(params){
				var t = params.status ? '已被禁止登陆本站' : '正常，允许登陆。';
				$(this).parents('.info:first').find('.status b').html(t);
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
		
		onMakePages: function(pages){
			var h = '';
			if ( pages.to > 1 ){
				h += '<div class="pages clearfix">';
					for ( var i = pages.from ; i <= pages.to ; i++ ){
						if ( i === pages.current ){
							h += '<span>' + i + '</span>';
						}else{
							h += '<a href="javascript:;">' + i + '</a>';			
						};		
					};
				h += '</div>'
			}
			
			return h;
		},
		
		onPageClick: function(i){
			var that = this;
			that.tip.loading();
			ajaxGetMembers(local_nick, i, function(params){
				if ( params.success ){
					that.tip.close();
					that.onLoadMembers(params.arrays, params.pages);
				}else{
					that.tip.error(params.message);
				}
			});
		},
		
		tip: require('appjs/assets/blog.loading')
	});
});