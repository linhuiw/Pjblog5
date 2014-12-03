var article = new Class(function(querys, getforms){
	querys.m = querys.m || '';

	if ( querys.m.length > 0 && this[querys.m] ){
		var articlePromise = require(':public/library/article');
		var BuildArticlePromise = new articlePromise();
		return this[querys.m](querys, getforms, BuildArticlePromise);
	}else{
		return { success: false, message: '找不到模块' };
	}
});

article.add('save', function(querys, getforms, Promise){
	var forms = getforms();
	var msg = { success: false, message: '操作失败' };
	
	if ( forms.id && forms.id.length === 0 ){
		delete forms.id;
	};
	
	var ret = Promise.SaveArticle(forms);
	
	if ( ret ){
		msg.success = true;
	};
	
	return msg;
});

article.add('remove', function(querys, getforms, Promise){
	var forms = getforms();
	var msg = { success: false, message: '操作失败' };
	
	if ( !forms.id || forms.id.length === 0 ){
		return msg;
	};
	
	if ( isNaN(forms.id) ){
		return msg;
	}
	
	var ret = Promise.removeArticle(Number(forms.id));
	
	if ( ret ){
		msg.success = true;
	};
	
	return msg;
});

module.exports = article;