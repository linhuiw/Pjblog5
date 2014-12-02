var home = new Class(function(querys, forms){
	
	this.data = {};
	
	// your code here.
	this.data.statistics = this.Statistics();
	this.data.iis = this.IIS();
	
	return this.data;
	
});

// 系统统计数据
home.add('Statistics', function(){
	var counts = {};
	counts.article = blog.conn.Execute('Select count(id) From ' + blog.tb + 'articles')(0).value;
	counts.user = blog.conn.Execute('Select count(id) From ' + blog.tb + 'members')(0).value;
	counts.plugin = blog.conn.Execute('Select count(id) From ' + blog.tb + 'plugins')(0).value;
	
	return counts;
});

// 系统组件支持
home.add('IIS', function(){
	var coms = {
		'Adodb.Stream': true,
		'ADODB.Command': true,
		'Adodb.Connection': true,
		'Microsoft.XMLDOM': true,
		'Microsoft.XMLHTTP': true,
		'WinHttp.WinHttpRequest.5.1': true,
		'Scripting.FileSystemObject': true
	}
	
	for (var i in coms) {
		try{
			new ActiveXObject(i);
		}catch(e){
			coms[i] = false;
		}
	}
	
	return coms;
});

module.exports = home;