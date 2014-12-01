/*
	后台调试用模块
	var debug = require('./debug');
		debug.log(sth);
	OR
	require('./debug').log(sth);
*/
exports.log = function(obj){
	var logfile = contrast('./log.txt');
		
	var now = new Date(),
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate(),
		h = (now.getHours().toString().length == 1) ? ('0' + now.getHours()) : now.getHours(),
		n = (now.getMinutes().toString().length == 1) ? ('0' + now.getMinutes()) : now.getMinutes(),
		s = (now.getSeconds().toString().length == 1) ? ('0' + now.getSeconds()) : now.getSeconds();
		now = y + '-' + m + '-' + d + ' ' + h + ':' + n + ':' + s;
	
	var str = '';
	if (typeof obj === 'string') {
		str = obj
	} else if (typeof obj === 'object') {
		str = JSON.stringify(obj)
	} else if (typeof obj === 'function') {
		str = obj.toString()
	} else {
		str = String(obj)
	}

	var fso = new ActiveXObject('Scripting.FileSystemObject');
		fs = fso.OpenTextFile(logfile, 8, true);
		fs.WriteLine(now + '\r\n' + str);		
		fs.Close();
		fso = null;
}