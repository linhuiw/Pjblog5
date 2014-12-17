var article = new Class();

/*
 * # 根据日志ID获取日志信息数据的方法
 * @ id <number> 日志ID
 * ? JSON
 * 分类是从缓存读取的。
 */
article.add('getArticleByID', function(id){
	var rec = new dbo(blog.tb + 'articles', blog.conn),
		article = rec.selectAll().and('id', id).toJSON()[0];
		
	var categorys = require(':private/caches/categorys.json');
	
	if ( categorys[article.art_category + ''] ){
		article.art_category = categorys[article.art_category + '']
	}else{
		if ( article.art_category === 0 ){
			article.art_category = {
				cate_name: '回收日志',
				id: 0
			}
		}
	}
	
	if ( article.art_tags && article.art_tags.length > 0 ){
		var tags = require(':public/library/tag'),
			tag = new tags();

		article.art_tags = tag.get(tag.parse(article.art_tags));
	};
	
    article.art_postdate = new Date(article.art_postdate).getTime();
    article.art_modifydate = new Date(article.art_modifydate).getTime();
	
	return article;
});

/*
 * # 辅助方法：获取这个ID的分类ID，不管是自身ID或者parentID
 * @ cate <number> 分类ID
 * ? boolean
 * 返回一个存在这个分类的父子分类的ID集合
 */
article.add('getAllCategorys', function(cate){
	var categorys = require(':private/caches/categorys.json');
	var cates = [];
	for ( var i in categorys.indexs ){
		if ( 
			!categorys.indexs[i].cate_outlink && 
			( (categorys.indexs[i].id === cate) || (categorys.indexs[i].cate_parent === cate) ) 
		){
			cates.push(categorys.indexs[i].id);
		}
	}
	return cates;
});

/*
 * # 存储过程获取日志列表的方法
 * @ cate <number | string> 分类ID或者系统分类指定的字符串 draft all et..
 * @ page <number> 当前页
 * ? JSON
 * 同时返回总页数和当前页以及数据集合
 */
article.add('getArticlesByStorageProcess', function( cate, Page, size ){
	var PAGE = new cmd('iPage', blog.conn);
	var where = null;
	
	if ( !cate && cate !== 0 ){
		cate = -1;
	};
	
	if ( cate == 'draft' ){
		where = 'art_draft=1';
	}
	else if ( cate == 'all' ){
		where = 'art_category>=0 And art_draft=0';
	}
	else if ( cate === 0 ){
		where = 'art_category=0 And art_draft=0';
	}
	else{
		var cates = this.getAllCategorys(cate);
		where = 'art_category in (' + cates.join(',') + ') And art_draft=0';
	}

	var result = PAGE
		.addInputVarchar('@TableName', blog.tb + 'articles')
		.addInputVarchar('@FieldList', '*')
		.addInputVarchar('@PrimaryKey', 'id')
		.addInputVarchar('@Where', where)
		.addInputVarchar('@Order', 'art_postdate desc,id desc')
		.addInputInt('@SortType', 3)
		.addInputInt('@RecorderCount', 0)
		.addInputInt('@PageSize', size || 12)
		.addInputInt('@PageIndex', Page)
		.addOutputInt('@TotalCount')
		.addOutputInt('@TotalPageCount')
		.exec().toJSON();
		
	var PageCount = PAGE.get('@TotalPageCount').value;
	
	return {
		result: result,
		PageCount: PageCount,
		PageIndex: Page
	};
});

article.add('getArticlesByTag', function( tag, Page, size ){
	var PAGE = new cmd('iPage', blog.conn);
	var where = null;
	
	if ( !tag || Number(tag) < 1 ){
		return [];
	};
	
	where = "art_tags like '%{" + tag + "}%'";

	var result = PAGE
		.addInputVarchar('@TableName', blog.tb + 'articles')
		.addInputVarchar('@FieldList', '*')
		.addInputVarchar('@PrimaryKey', 'id')
		.addInputVarchar('@Where', where)
		.addInputVarchar('@Order', 'art_postdate desc,id desc')
		.addInputInt('@SortType', 3)
		.addInputInt('@RecorderCount', 0)
		.addInputInt('@PageSize', size || 12)
		.addInputInt('@PageIndex', Page)
		.addOutputInt('@TotalCount')
		.addOutputInt('@TotalPageCount')
		.exec().toJSON();
		
	var PageCount = PAGE.get('@TotalPageCount').value;
	
	return {
		result: result,
		PageCount: PageCount,
		PageIndex: Page
	};
});


article.add('getImageByContent', function( content ){
	
	// 获取日志第一张图片
	var imgexp = /<img([^\s]*?)\ssrc=\"([^\"]*?)\"(.*?)>/i.exec( content ),
		image;
		
	if ( imgexp && imgexp[2] ){ image = imgexp[2]; }else{ image = ''; };
	
	var ist = image.indexOf('private');
	if ( !/^[a-z]+:\/\//.test(image) && ist > -1 ){
		image = image.substr(ist);
	};
	
	return image;
});

/*
 * # 保存日志方法
 * @ data <json>
 * ? boolean
 * 如果data参数存在id字段，那么为修改，其余为添加
 */
article.add('SaveArticle', function( data ){
	try{
		var id = data.id, 
			add = true, 
			that = this, 
			fns = require('ifns'),
			GlobalCache = require(':private/caches/global.json'), // 全局缓存
			hooks = require(':public/library/hook.js'),
			hook = new hooks();
		
		if ( id && id > 0 ){
			add = false;
			delete data.id;
		};
		
		hook.compile('iPress.article.pending', data);

		// 是否为用户自己添加
		data.art_monick = 0; 
		// 获取日志图片
		data.art_cover = this.getImageByContent(data.art_content);

		var rec = new dbo(blog.tb + 'articles', blog.conn);
			rec.selectAll();
			// 添加新日志
			if ( add ){
				data.art_postdate = date.format(new Date(), 'y/m/d h:i:s'); // 日志提交时间
				data.art_tags = that.iTags(data.art_tags); // tag转ID
				
				if ( data.art_des && data.art_des.length > 0 ){ 
					data.art_monick = 1; 
				}else{
					data.art_des = fns.cutStr(fns.removeHTML(data.art_content), GlobalCache.blog_articlecut, true, '');
				}
				
				hook.compile('iPress.article.add', data, rec);
				
				rec.create();
			}
			// 修改日志
			else{
				data.art_modifydate = date.format(new Date(), 'y/m/d h:i:s'); // 更新时间
				rec.and('id', id).open(3).exec(function(object){
					data.art_tags = that.iTags(data.art_tags, object('art_tags').value); // tag转ID
					// monick转换
					var art_monick = object('art_monick').value;
					if ( data.art_des.length === 0 ){ // 虽然是修改，但是用户删除了摘要内容，当做系统自己生成摘要功能来做
						data.art_des = fns.cutStr(fns.removeHTML(data.art_content), GlobalCache.blog_articlecut, true, ''); // 系统生成摘要
					}else{
						if ( object('art_des').value === data.art_des && !art_monick ){ // 如果数据库中摘要和传入的摘要相同，且是系统生成
							data.art_des = fns.cutStr(fns.removeHTML(data.art_content), GlobalCache.blog_articlecut, true, '');
						}else{ // 其余是用户自己生成
							data.art_monick = 1;
						}
					}
					
				});
				
				hook.compile('iPress.article.modify', data, rec);
			};
			
			hook.compile('iPress.article.doing', data, rec);
			
			// 保存日志
			rec
				.set(data)
				.save()
				.close();

		// 更新TAG缓存
		var tags = require('tag');
		var tag = new tags();
			tag.buildCacheFile();
		
		hook.compile('iPress.article.resolve', data);
				
		return true;
	}catch(e){
		hook.compile('iPress.article.reject', data, e);
		return false; 
	};
});

/*
 * # 标签操作
 * @ tags <string> 标签集合 字符串
 * @ _tags <string> 老标签集合 字符串
 * ? tring
 * 返回新标签的集合 字符串
 */
article.add('iTags', function(ctags, _tags){
	if ( !ctags || ctags.length === 0 ){
		return '';
	}
	var tags = require('tag');
	var tag = new tags(), newTags;
	
	ctags = ctags.split(',');

	if ( _tags && _tags.length > 0 ){
		tag.remove(tag.parse(_tags));	
	};
	
	var credit = tag.create(ctags);
	if ( credit.success ){
		// 添加成功,赋值最新的tags.
		newTags = tag.toggle(credit.data);
	}else{
		// 添加失败,赋值空的tags.
		newTags = '';
	}
	
	return newTags;
});

/*
 * # 删除日志方法
 * @ id <number | array>
 * ? boolean
 * 同时具备批量删除日志的功能
 */
article.add('removeArticle', function(id){
	try{
		if ( !readVariableType(id, 'array') ){ id = [id]; };
		if ( id.length > 0 ){
			var rec = new dbo(blog.tb + 'articles', blog.conn);
			rec.selectAll().and('id', id, 'in').open(3).each(function(o){
				o.Delete();
			}).close();
		}
		
		return true;
	}catch(e){ return false; }
});

/*
 * # 日志移动到回收站的方法
 * @ id <number | array>
 * ? boolean
 * 移动后的日志的分类为0
 */
article.add('removeArticleToRestoreage', function(id){
	try{
		if ( !readVariableType(id, 'array') ){ id = [id]; };
		if ( id.length > 0 ){
			var rec = new dbo(blog.tb + 'articles', blog.conn);
			rec.selectAll().and('id', id, 'in').open(3).each(function(o){
				this.set({
					art_category: 0
				}).save();
			}).close();
		}
		
		return true;
	}catch(e){ return false; }
});

module.exports = article;