// JavaScript Document
define(function( require, exports, module ){
	return new Class({
		initialize: function(){
			this.getOnLineList();
			this.tip.masker();
			this.onCheckURI();
		},
		getOnLineList: function(){
			var list = this.list;
			var h = '';
			var arrays = [];
			var j = 0;
			for ( var i in list ){
				j++;
				h += '<tr app-id="' + i + '" app-crc="' + list[i] + '"><td class="tcenter">' + j + '</td><td><i class="fa fa-file-o"></i> ' + i + '</td><td>' + list[i] + '</td><td class="tcenter" align="center"></td></tr>';
				arrays.push(i);
			};
			$('#online-list tbody').html(h);
			this.arrays = arrays;
		},
		onCheckURI: function(i){
			var that = this;
			if ( !i ){ i = 0; };
			if ( this.arrays[i] ){
				var tr = $("tr[app-id='" + this.arrays[i] + "']");
				var st = tr.find('td').eq(3);
				st.html('<i class="fa fa-refresh fa-spin"></i>');
				if ( tr.size() > 0 ){
					var crc = tr.attr('app-crc');
					$.post('public/async.asp?m=online&p=getNewFile', {
						id: this.arrays[i],
						crc: crc
					}, function( params ){
						if ( params.success ){
							st.html('<i class="fa fa-check"></i>');
							tr.addClass('needupdate');
						}else{
							st.html('<i class="fa fa-circle-o-notch"></i>');
						};
						that.onCheckURI(i + 1);
					}, 'json');
				}else{
					st.html('<i class="fa fa-times"></i>');
					this.onCheckURI(i + 1);
				}
			}else{
				this.onComplete();
			}
		},
		onComplete: function(){
			var t = [],
				that = this;
			$('#online-list tbody tr:not(.needupdate)').remove();
			$('#online-list tbody tr').each(function(){
				var id = $(this).attr('app-id');
				t.push(id);
			});
			this.updatelist = t;
			this.tip.close();
			if ( this.updatelist.length > 0 ){
				$('#online-list tbody').append('<tr><td></td><td><a href="javascript:;" id="doupdates">开始更新</a></td><td></td><td></td></tr>');
				$('#doupdates').on('click', function(){
					that.tip.loading('正在更新文件..请稍后!更新时间可能比较长，请耐心等待！');
					that.onDisPod();
				});
			}else{
				$('#online-list tbody').append('<tr><td></td><td>所有文件已是最新，不需要更新。</td><td></td><td></td></tr>');
			}
		},
		onDisPod: function(i){
			var that = this;
			if ( !i ){ i = 0; };
			if ( this.updatelist[i] ){
				var tr = $("tr[app-id='" + this.updatelist[i] + "']");
				var st = tr.find('td').eq(3);
				st.html('<i class="fa fa-refresh fa-spin"></i>');
				$.getJSON('public/async.asp?m=online&p=download', {
					id: this.updatelist[i]
				}, function( params ){
					if ( params.success ){
						st.html('更新成功');
					}else{
						st.html('更新失败');
					};
					that.onDisPod(i + 1);
				});
			}else{
				this.tip.close();
				$('#online-list tbody tr:last').remove();
				$('#online-list tbody').append('<tr><td></td><td colspan="3">全部更新完毕。</td></tr>');
			}
		},
		tip: require('appjs/assets/blog.loading'),
		list: require('http://app.webkits.cn/private/version/static/pjblog5.js')
	});
});