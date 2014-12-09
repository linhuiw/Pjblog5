module.exports = new Class(function(querys, getforms){
	var t = querys.t;
	if ( !t || t.length === 0 ){
		return;
	};
	
	t = Number(t);
	if ( t < 1 ){
		return;
	};
	
	var m = querys.m;
	if ( !m || m.length === 0 ){
		return;
	};
	
	var plugins = require(':private/caches/plugins.json');
	if ( plugins.indexs && plugins.indexs[t] ){
		var folder = plugins.indexs[t].plu_folder,
			id = t,
			mark = plugins.indexs[t].plu_mark;
			
		var msg;
			
		fs(resolve(':private/plugins/' + folder + '/service')).exist().then(function(){
			var services = require(':private/plugins/' + folder + '/service');
			var service = new services(id, mark, folder);
			if ( typeof service[m] === 'function' ){
				msg = service[m](querys, getforms);
			}
		});
		
		return msg;
	}
});