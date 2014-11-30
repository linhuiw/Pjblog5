// JavaScript Document
define(function(require){
	var app = new Class();
	
	app.add('initialize', function(mark, tip, type){
		this.mark = mark;
		this.tip = tip;
		this.type = type;
		this.downPBD();
	});
	
	app.add('downPBD', function(){
		var that = this;
		this.tip.loading('正在下载资源');
		$.getJSON('public/async.asp', { m: this.type, p: 'download', mark: this.mark }, function(params){
			if ( params.success ){
				that.doupack();
			}else{
				that.tip.error(params.message);
			}
		});
	});
	
	app.add('doupack', function(){
		var that = this;
		this.tip.loading('正在解压资源');
		$.getJSON('public/async.asp', { m: this.type, p: 'unpackpbd', mark: this.mark }, function(params){
			console.log(params)
			if ( params.success ){
				that.tip.loading('等待安装...');
				if ( confirm('资源下载解压完成，是否马上安装？') ){
					if ( typeof that.complete === 'function' ){
						that.complete(that.mark);
					}else{
						that.tip.success(params.message);
					}
				}else{
					that.tip.close();
				}
			}else{
				that.tip.error(params.message);
			}
		});
	});
	
	return app;
});