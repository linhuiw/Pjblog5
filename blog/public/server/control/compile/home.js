var home = new Class(function(querys, forms){
	
	this.data = {};
	
	// your code here.
	this.data.evio = '逗逼';
	this.data.statistics = this.Statistics();
	this.data.iis = this.IIS();
	
	return this.data;
	
});

// 系统统计数据
home.add('Statistics', function(){
	var counts = {};
	counts['文章总数'] = blog.conn.Execute('Select count(id) From ' + blog.tb + 'articles')(0).value;
	counts['用户总数'] = blog.conn.Execute('Select count(id) From ' + blog.tb + 'members')(0).value;
	counts['插件总数'] = blog.conn.Execute('Select count(id) From ' + blog.tb + 'plugins')(0).value;
	counts['主题总数'] = blog.conn.Execute('Select count(id) From ' + blog.tb + 'themes')(0).value;
	
	return counts;
});

// 系统组件支持
home.add('IIS', function(){
	var coms = {
		'Adodb.Stream': true,
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