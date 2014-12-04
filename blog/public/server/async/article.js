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
	
	if ( forms.id && ( forms.id.length === 0 || forms.id === '0' ) ){
		delete forms.id;
	}else{
		forms.id = Number(forms.id);
	}
	
	if ( !forms.art_title || forms.art_title.length === 0 || forms.art_title.length > 255 ){
		msg.message = '标题不能为空，且字数不能超过255个';
		return msg;
	}
	
	if ( !forms.art_content || forms.art_content.length < 10 ){
		msg.message = "日志内容过少";
		return msg;
	}
	
	if ( !forms.art_category || forms.art_category.length === 0 || isNaN(forms.art_category) || Number(forms.art_category) < 1 ){
		msg.message = "请选择分类";
		return msg;
	}
	
	msg.success = Promise.SaveArticle(forms);
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
		msg.message = '操作成功';
	};
	
	return msg;
});

module.exports = article;