var CommentModule = new Class({
	initialize: function(){
		if ( !this.conn ){
			var MEMBER = require('public/services/user'),
				member = new MEMBER();
			
			this.dbo = member.dbo;
			this.conn = member.conn;
			
			var uid = 0,
				group = 0,
				openid,
				token,
				status = member.loginStatus(function(rets, object){
					uid = object('id').value;
					group = object('member_group').value;
					openid = object('member_openid').value;
					token = object('member_token').value;
				});
		
			if ( !group ){
				group = '0';
			}
			group = Number(group);
			if ( group < 1 ){
				group = 1;
			}
			
			this.uid = uid;
			this.login = status.login;
			this.group = this.GroupLevel(group);
			this.openid = openid;
			this.token = token;
		}else{
			this.group = this.GroupLevel(3);
		}
		if ( !this.setting ){
			this.getSettingValue();
		}
	}
});

CommentModule.add('getSideValue', function(params){
	var t = params.query.t || 0;
	var Export = require('exports');
		Export.add('setting', this.setting);
		Export.add('conn', this.conn);
		Export.add('dbo', this.dbo);
	var ModExp = new Export();
	return ModExp.getSideValue(t);
});

CommentModule.add('getList', function(params){
	var id = params.query.id || 0,
		page = params.query.page || 1;
	var Export = require('exports');
		Export.add('setting', this.setting);
		Export.add('conn', this.conn);
		Export.add('dbo', this.dbo);
	var ModExp = new Export();
	return ModExp.getList(id, page);
});

CommentModule.add('getSettingValue', function(){
	var plugins = require('public/library/plugin');
		plugins.add('dbo', this.dbo);
		plugins.add('conn', this.conn);
	var plugin = new plugins();
	
	this.setting = plugin.getSettingParams(this.pid);
});

CommentModule.add('GroupLevel', function( id ){
	var GroupCache = require('private/chips/' + blog.cache + 'blog.groups'),
		LevelCache = require('private/chips/' + blog.cache + 'blog.levels'),
		_id = id + '',
		param = [];
		
	if ( GroupCache[_id] ){
		for ( var i = 0 ; i < GroupCache[_id].length ; i++ ){
			var t = GroupCache[_id][i] + '';
			if ( LevelCache[t] ){
				param.push(LevelCache[t]);
			}
		}
	};
	
	return param;
});

CommentModule.add('post', function( params ){
	var id = params.form.id || 0,
		nick = params.form.nick || '',
		mail = params.form.mail || '',
		site = params.form.site || '',
		root = params.form.root || 0,
		parent = params.form.parent || 0,
		content = params.form.content || '',
		ret = { success: false, message: '发表{0}失败' },
		data = {};
	site = site.replace(/.*?\:\/\//ig,'');
		
	if ( this.group.indexOf('PostComments') === -1 ){
		ret.message = '您没有权限发表{0}';
		return ret;
	};
	
	var ispassed = (this.group.indexOf('ControlSystem') > -1 || this.setting.audits == 1) ? true : false;
		
	var minln = Number(this.setting.minlength),
		maxln = Number(this.setting.maxlength),
		delay = Number(this.setting.delay);
require('./debug').log(params);
	if ( content.length < minln ){
		ret.message = '{0}内容不能少于' + minln + '字符';
		return ret;
	};
	
	if ( content.length > maxln ){
		ret.message = '{0}内容不能超过' + maxln + '字符';
		return ret;
	}

	if ( delay && delay > 0 ){
		var time = Number(Session(blog.cache + '_comment_delay')) || 0;
		if ( new Date().getTime() - time < delay * 1000 ){
			ret.message = '发表{0}间隔是' + delay + '秒，请稍后再发表!';
			return ret;
		}
	};

	var date = require('date');

	data = {
		com_article_id: id,
		com_member_id: this.uid,
		com_content: content,
		com_root: root,
		com_parent: parent,
		com_postdate: date.format(new Date(), 'y-m-d h:i:s'),
		com_username: nick,
		com_usermail: mail,
		com_usersite: site,
		com_ispassed: ispassed
	};

	var rec = new this.dbo.RecordSet(this.conn),
		cid = 0;

	rec
		.sql('Select * From blog_comments')
		.on('add', function(object){
			cid = object('id').value;
		})
		.open(2)
		.add(data)
		.close();
		
	if ( cid > 0 ){
		data.id = id;
		data.cid = cid;
		data.rid = cid;
		data.pass = ispassed;
		data.com_postdate = new Date();
		ret.success = true;
		ret.message = '发表{0}成功';
		ret.data = data;
		
		this.ArticleCommentCountPlus(id);
		Session(blog.cache + '_comment_delay') = new Date().getTime();
		
		if (ispassed) {this.buildCache()}	// 更新缓存数据
	}else{
		return ret;
	}
	
	return ret;
	
});

CommentModule.add('reply', function( params ){
	var id = params.form.id || 0,
		nick = params.form.nick || '',
		mail = params.form.mail || '',
		site = params.form.site || '',
		root = params.form.root || 0,
		parent = params.form.parent || 0,
		content = params.form.content || '',
		ret = { success: false, message: '回复{0}失败' },
		data = {};

	site = site.replace(/.*?\:\/\//ig,'');
	
	if ( this.group.indexOf('ReplyComment') === -1 ){
		ret.message = '您没有权限回复{0}';
		return ret;
	};
	
	// todo: 加入对一级评论是否通过审核的判断
	
	var ispassed = (this.group.indexOf('ControlSystem') > -1 || this.setting.audits == 1) ? true : false;
		
	var minln = Number(this.setting.minlength),
		maxln = Number(this.setting.maxlength),
		delay = Number(this.setting.delay);

	if ( content.length < minln ){
		ret.message = '{0}内容不能少于' + minln + '字符';
		return ret;
	};
	
	if ( content.length > maxln ){
		ret.message = '{0}内容不能超过' + maxln + '字符';
		return ret;
	}

	if ( delay && delay > 0 ){
		var time = Number(Session(blog.cache + '_comment_delay')) || 0;
		if ( new Date().getTime() - time < delay * 1000 ){
			ret.message = '回复{0}间隔是' + delay + '秒，请稍后再发表!';
			return ret;
		}
	};
	
	var date = require('date');
	
	data = {
		com_article_id: id,
		com_member_id: this.uid,
		com_content: content,
		com_root: root,
		com_parent: parent,
		com_postdate: date.format(new Date(), 'y-m-d h:i:s'),
		com_username: nick,
		com_usermail: mail,
		com_usersite: site,
		com_ispassed: ispassed
	};

	var rec = new this.dbo.RecordSet(this.conn),
		cid = 0;
		
	rec
		.sql('Select * From blog_comments')
		.on('add', function(object){
			cid = object('id').value;
		})
		.open(2)
		.add(data)
		.close();
		
	if ( cid > 0 ){
		data.id = id;
		data.cid = cid;
		data.rid = root;
		data.pass = ispassed;
		data.com_postdate = new Date();
		ret.success = true;
		ret.message = '回复{0}成功';
		ret.data = data;
		
		this.ArticleCommentCountPlus(id);
		Session(blog.cache + '_comment_delay') = new Date().getTime();
		
		if (ispassed) {this.buildCache()}	// 更新缓存数据
		
		var global = require('private/chips/' + blog.cache + 'blog.global');

		if ( this.setting.cloud == 0 ){
			var xs = this.CommentCloudNotice({
				cid: cid,
				parentid: parent,
				articleid: id,
				time: new Date().getTime(),
				com_username: nick,
				com_usermail: mail,
				domainid: global.blog_appid,
				appkey: global.blog_appkey
			});
			
			ret.message += xs.message;
		};
	}else{
	
		return ret;
	}

	return ret;
	
});

CommentModule.add('remove', function( params ){
	var id = params.query.id || 0,
		ret = { success: false, message: '删除{0}失败' },
		that = this,
		k = 0,
		aid = 0,
		rid = 0;

	if ( id.length === 0 ){
		id = 0;
	}
	id = Number(id);
	if ( id < 1 ){
		return ret;
	};
	
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_comments Where id=' + id)
		.process(function(object){
			if ( !object.Bof && !object.Bof ){
				var uid = object('com_member_id').value;
					aid = object('com_article_id').value;
					rid = object('com_parent').value;
				if ( that.group.indexOf('RemoveComment') > -1 || that.uid === uid ){
					this.remove();
					ret.success = true;
					ret.message = '删除{0}成功';
					k = 1;
				}else{
					ret.message = '您没有权限删除{0}';
				}
			}
		}, 3);
		
	if ( ret.success ){
		// 删除子评论：当删除一级评论时执行
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_comments Where com_root=' + id)
			.open(3)
			.each(function(object){
				k = k + 1;
				object.Delete();
			})
			.close()
			
		// 更新子评论：当删除二级评论时执行
		rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_comments Where com_parent=' + id)
			.open(3)
			.update({
				com_parent: rid		// 上移一级
			})
			.close();
	};
	
	if ( k > 0 ){
		this.buildCache();
		this.ArticleCommentCountMinus(aid, k);
	}
	
	return ret;
});

CommentModule.add('pass', function( params ){
	var id = params.query.id || 0,
		ret = { success: false, message: '审核{0}失败' };

	if ( id.length === 0 ){
		id = 0;
	}
	id = Number(id);
	if ( id < 1 ){
		return ret;
	};
			
	if (this.dopass(id)) {
		this.buildCache();
		
		ret.message = '审核{0}成功';
		ret.success = true;
	}
	
	return ret;
});

CommentModule.add('passall', function( params ){
	var ids = params.query.ids || 0,
		ret = { success: false, message: '批量审核{0}失败' };

	if ( ids.length === 0 ){ return ret }

	var id = (ids.length>1) ? ids.join(',') : ids;
	if (this.dopass(id)) {
		this.buildCache();
		
		ret.message = '批量审核{0}成功';
		ret.success = true;
	}
	
	return ret;
});

CommentModule.add('dopass', function( ids ){
	if ( this.group.indexOf('ControlSystem') === -1 ) {	return false }
	
	try {
		var rec = new this.dbo.RecordSet(this.conn);
		rec
			.sql('Select * From blog_comments Where id in(' + ids + ')')
			.open(3)
			.update({
				com_ispassed: true	
			})
			.close();
		return true;
	}catch(e){
		return false;
	}
});

CommentModule.add('buildCache', function(){
	var ModExports = require('./exports');
		ModExports.add('pid', this.pid);
	var Export = new ModExports();
	var data = {topComment: Export.getSideList(0), topMessage: Export.getSideList(1)}
	
	var text = '//<%';
	for ( var i in data ){
		text += '\r\nexports.' + i + ' = ' + JSON.stringify(data[i]) + ';';
	};
	
	Export.fso.saveFile(resolve('./cache/top.asp'), text);
});

CommentModule.add('CommentCloudNotice', function( options ){
	try{
		var rec = new this.dbo.RecordSet(this.conn),
			fromuid,
			targetuid,
			url,
			title,
			type = 'comment',
			domainid = options.domainid,
			username,
			usermail,
			time = options.time;
			
		if ( this.openid && this.openid.length > 0 ){
			fromuid = this.openid;
			username = '';
			usermail = '';
		}else{
			fromuid = '';
			username = options.com_username;
			usermail = options.com_usermail;
		};
		
		var comuid = 0;
		rec
			.sql('Select * From blog_comments Where id=' + options.parentid)
			.process(function(object){
				if ( !object.Bof && !object.Eof ){
					comuid = object('com_member_id').value;
				}
			});

		if ( comuid > 0 ){
			rec = new this.dbo.RecordSet(this.conn);
			rec
				.sql('Select * From blog_members Where id=' + comuid)
				.process(function( object ){
					if ( !object.Bof && !object.Eof ){
						targetuid = object('member_openid').value;
					}
				});
			
			if (options.articleid == 0)	{
				url = blog.web + '/plugin.asp?id=' + this.pid + '#comment_' + options.cid;
				title = '留言回复';
			} else {
				url = blog.web + '/article.asp?id=' + options.articleid + '#comment_' + options.cid;
				
				rec = new this.dbo.RecordSet(this.conn);
				rec
					.sql('Select * From blog_articles Where id=' + options.articleid)
					.process(function(object){
						if ( !object.Bof && !object.Eof ){
							title = object('art_title').value;
						}
					});
			}
			
			var oauth2 = require('public/library/oauth2').oauth;
			var oauth = new oauth2(options.domainid, options.appkey);
			return oauth.SetNotice(this.token, this.openid, {
				fromuid: fromuid,
				targetuid: targetuid,
				url: url,
				title: title,
				type: type,
				username: username,
				usermail: usermail,
				time: time
			});
		}else{
			return { success: true, message: ' 目标用户为非平台用户 不需要添加云端通知' };
		}
	}catch(e){
		return { success: false, message: e.message };
	}
});

CommentModule.add('ArticleCommentCountPlus', function(id){
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_articles Where id=' + id)
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				var i = object('art_comment_count').value;
				this.update({
					art_comment_count: i + 1
				});
			}
		}, 3);
});

CommentModule.add('ArticleCommentCountMinus', function(id, j){
	var rec = new this.dbo.RecordSet(this.conn);
	rec
		.sql('Select * From blog_articles Where id=' + id)
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				var i = object('art_comment_count').value;
				var o = i - j;
				if ( o < 0 ){
					o = 0;
				};
				this.update({
					art_comment_count: o
				});
			}
		}, 3);
});

return CommentModule;