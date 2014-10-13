define(['appjs/assets/jquery.form.min'],function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.selectAll();
			this.ajaxRemove();
			this.ajaxRemAll();
			this.ajaxPass();
			this.ajaxPassAll();
		},
		selectAll: function(){
			window.click = 0;
			$('.app-selectall').on('click', function(){
				window.click = Math.abs(1 - window.click);
				var label = [];
					label.push('<i class="fa fa-check-square-o"></i>全部选择');
					label.push('<i class="fa fa-square-o"></i>全部反选');
				$(this).html(label[window.click]);
				$('input[name="ids"]').each(function(){ this.checked = !this.checked; });
			});
		},
		ajaxRemove: function(){
			var that = this;
			$('.app-remove').on('click', function(){
				if ( !confirm('确定删除这条' + window.dis + '？') ){
					return;
				}
				var cid = $(this).attr('app-cid');
				that.tip.loading('正在删除这条' + window.dis + '，请稍后！');
				$.getJSON('public/async.asp', {
					m: window.mark,
					p: 'remove',
					t: 'plugin',
					id: cid
				}, function(params){
					params.message = params.message.replace('{0}', window.dis);
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		ajaxRemAll: function(){
			var that = this;
			$('.app-remall').on('click', function(){
				if ( !confirm('确定删除这些' + window.dis + '？') ){
					return;
				}
				$('#comments').attr('action', 'public/async.asp?m=' + window.mark + '&p=remall&t=plugin');
				$('#comments').ajaxSubmit({
					dataType: 'json',
					beforeSubmit: function(){
						that.tip.loading();
					},
					success: function( params ){
						params.message = params.message.replace('{0}', window.dis);
						if ( params.success ){
							that.tip.success(params.message);
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
			});
		},
		ajaxPass: function(){
			var that = this;
			$('.app-pass').on('click', function(){
				if ( !confirm('确定通过这条' + window.dis + '？') ){
					return;
				}
				var cid = $(this).attr('app-cid');
				that.tip.loading('正在通过这条' + window.dis + '，请稍后！');
				$.getJSON('public/async.asp', {
					m: window.mark,
					p: 'pass',
					t: 'plugin',
					id: cid
				}, function(params){
					params.message = params.message.replace('{0}', window.dis);
					if ( params.success ){
						that.tip.success(params.message);
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}else{
						that.tip.error(params.message);
					}
				});
			});
		},
		ajaxPassAll: function(){
			var that = this;
			$('.app-passall').on('click', function(){
				$('#comments').ajaxSubmit({
					dataType: 'json',
					beforeSubmit: function(){
						that.tip.loading();
					},
					success: function( params ){
						params.message = params.message.replace('{0}', window.dis);
						if ( params.success ){
							that.tip.success(params.message);
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
			});
		},
		tip: require('appjs/assets/blog.loading')
	});
});