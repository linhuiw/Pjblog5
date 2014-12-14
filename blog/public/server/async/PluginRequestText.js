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
			services.add('CheckUser', function(mark, callback){
				if ( !callback ){
					if ( typeof mark === 'function' ){
						callback === mark;
						mark = null;
					}else{
						callback = null;	
					}					
				};
				var aHead = false;
				if ( mark ){
					aHead = blog.user.limits.indexOf(mark) > -1;
				}else{
					aHead = blog.user.status >= 1;
				};
				if ( aHead ){
					if ( typeof callback === 'function' ){
						var cb = callback.call(this);
						if ( cb ){
							return cb;
						}else{
							return true;
						}
					}else{
						return true;
					}
				}else{
					if ( typeof callback === 'function' ){
						return '非法操作';
					}else{
						return false;
					}
				}
			});
			var service = new services(id, mark, folder);
			if ( typeof service[m] === 'function' ){
				msg = service[m](querys, getforms);
			}
		});
		
		return msg;
	}
});