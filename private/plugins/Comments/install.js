var Installer = new Class({
    initialize: function(pfolder, pid, pmsg){
        this.pfolder = pfolder;
        this.pid = pid;
        this.pmark = pmsg.mark;
        this.pluginConfigs = pmsg;

		var cacheFolder = contrast('./cache');
		this.fs.autoCreateFolder(cacheFolder);	// 创建缓存文件夹
		
		this.buildLevel();						// 判断是否需要添加权限	
		this.buildCache();
    }
});

Installer.add('buildLevel', function(){
	var rec = new this.dbo.RecordSet(this.conn),
		Levels = [],
		List = [];

	rec
		.sql('Select * From blog_levels')
		.open()
		.each(function( object ){
			Levels.push(object('code_mark').value);	
		})
		.close();

	if (Levels.indexOf('PostComments') === -1) {
		List.push({
				code_name: '发表评论',
				code_des: '用户具有前台发表评论的权限。',
				code_isystem: false,
				code_mark: 'PostComments'
			})
	}
	if (Levels.indexOf('ReplyComment') === -1) {
		List.push({
				code_name: '回复评论',
				code_des: '用户具有前台回复评论权限。',
				code_isystem: false,
				code_mark: 'ReplyComment'
			})
	}
	if (Levels.indexOf('RemoveComment') === -1) {
		List.push({
				code_name: '删除评论',
				code_des: '用户具有前台删除评论权限。',
				code_isystem: false,
				code_mark: 'RemoveComment'
			})
	}

	for (var i=0; i<List.length; i++) {
		this.appendLevel(List[i])
	}
});

Installer.add('appendLevel', function( level ){
	var rec = new this.dbo.RecordSet(this.conn),
		id = 0;
		
	rec
		.sql('Select * From blog_levels')
		.on('add', function(object){
			id = object('id').value;
		})
		.open(2)
		.add(level)
		.close();

	// 管理员添加所有权限	普通用户添加评论和回复的权限
	if (level.code_mark != 'RemoveComment') {
		this.GroupLevel(id, 2);
		this.GroupLevel(id, 3);
	}else{
		this.GroupLevel(id, 3);
	}
});

Installer.add('GroupLevel', function( id, gid ){
	var rec = new this.dbo.RecordSet(this.conn),
		code = '';
	rec
		.sql('Select * From blog_groups Where id=' + gid)
		.process(function(object){
			if ( !object.Bof && !object.Eof ){
				code = object('group_code').value;
			}
		});
		
	if (code == '') return;
	var codes = code.replace('[', '').replace(']', '').split(',');
	if (codes.indexOf(id.toString()) === -1) codes.push(id.toString());
	code = '[' + codes.join(',') + ']';
	
	rec
		.sql('Select * From blog_groups Where id=' + gid)
		.open(3)
		.update({
			group_code: code
		})
		.close();
});

Installer.add('buildCache', function(){
	var ModLevel = require('public/services/level');
	var Level = new ModLevel();
	
	Level.ReBuildLevelsCacheFile();
	Level.ReBuildGroupsCacheFile();
});

return Installer;