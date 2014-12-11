var user = new Class();

user.add('oAuthLogin', function(params){
	var msg = { success: false, message: '操作失败' };
	var rec = new dbo(blog.tb + 'members', blog.conn);
	var count = blog.conn.Execute("Select Count(id) From " + blog.tb + "members Where member_openid='" + params.openid + "'")(0).value;

	var data = {
		member_hashkey: params.hashkey,
		member_nick: params.nick,
		member_mail: params.mail,
		member_logindate: date.format(new Date(), 'y/m/d h:i:s'),
		member_birthday: date.format(new Date(params.birthday), 'y/m/d h:i:s'),
		member_address: params.address,
		member_website: params.website,
		member_sex: params.sex,
		member_avatar: params.avatar,
		member_token: params.token,
		member_openid: params.openid
	};

	var id = 0;
	
	try{
		if ( count > 0 ){
			rec.top(1).selectAll().and('member_openid', params.openid).open(3).set(data).save().exec(function(object){
				id = object('id').value;
			}).close();
		}else{
			data.member_group = 2;
			rec.create().set(data).save().exec(function(object){
				id = object('id').value;
			}).close();
		}
		
		var $ = require('cookie');
		var newDate = new Date(new Date().getTime() + params.expires_in);
		$.cookie(blog.pix + 'user_id', id, { expires: newDate });
		$.cookie(blog.pix + 'user_hashkey', params.hashkey, { expires: newDate });
		
		msg.success = true;
		
	}catch(e){}
	
	return msg;
});

/*
 * 用户状态码
 * 	@ 0 	未登陆
 *  @ 1		普通会员
 *  @ 2		管理员
 */
user.add('status', function(){
	var $ = require('cookie');
	var rec = new dbo(blog.tb + 'members', blog.conn);
	var id = $.cookie(blog.pix + 'user_id') || '0';
	var hashkey = $.cookie(blog.pix + 'user_hashkey') || '';
	var data = { 
    	status: 0,
    	nick: '未登录用户',
    	mail: 'unknow@app.webkits.cn',
    	group: 1,
    	forbit: false,
    	loginDate: new Date().getTime(),
    	avatar: 'http://app.webkits.cn/avatar',
    	token: '',
    	openid: '',
    	id: 0,
    	limits: []
    };
	id = Number(id);
	
	if ( id > 0 && hashkey.length > 0 ){
		rec.top(1).select('member_nick', 'member_mail', 'member_group', 'member_forbit', 'member_logindate', 'member_avatar', 'member_token', 'member_openid', 'id').and('id', id).and('member_hashkey', hashkey).open().exec(function(object){
			data.nick = object(0).value;
			data.mail = object(1).value;
			data.group = object(2).value;
			data.forbit = object(3).value;
			data.logindate = new Date(object(4).value).getTime();
			data.avatar = object(5).value;
			data.token = object(6).value;
			data.openid = object(7).value;
			data.id = object(8).value;
			data.status = 1;
		}).close();
	};
	
	var groupCache = require(':private/caches/groups.json');
	if ( groupCache[data.group + ''] ){
		var code = groupCache[data.group + ''].group_code;
		if ( code.length > 0 ){
			var codeCache = require(':private/caches/limits.json');
			for ( var i = 0 ; i < code.length ; i++ ){
				if ( 
					codeCache.indexs[code[i] + ''] &&
					codeCache.indexs[code[i] + ''] === 'ControlSystem'
				){
					data.status = 2;
				}
				data.limits.push(codeCache.indexs[code[i] + '']);
			}
		}
	}
	
	
	return data;
});

user.add('getUsersByStorageProcess', function(Page){
	var PAGE = new cmd('iPage', blog.conn);
	
	var result = PAGE
		.addInputVarchar('@TableName', blog.tb + 'members')
		.addInputVarchar('@FieldList', '*')
		.addInputVarchar('@PrimaryKey', 'id')
		.addInputVarchar('@Where', ' ')
		.addInputVarchar('@Order', 'member_logindate desc')
		.addInputInt('@SortType', 1)
		.addInputInt('@RecorderCount', 0)
		.addInputInt('@PageSize', 15)
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

user.add('save', function( id, data ){
	if ( blog.user.id === Number(id) ){
		return false;
	};
	
	blog.conn.BeginTrans();
	try{
		var User = new dbo(blog.tb + 'members', blog.conn);
		User.selectAll().and('id', id).open(3);
		if ( typeof data === 'function' ){
			data.call(User, User.object);
		}else{
			User.set(data);
		}
		User.save().close();
		blog.conn.CommitTrans();
		return true;
	}catch(e){
		blog.conn.RollBackTrans();
		return false;
	}
});

user.add('logout', function(){
	var $ = require('cookie');
	$.removeCookie(blog.pix + 'user_id');
	$.removeCookie(blog.pix + 'user_hashkey');
});

module.exports = user;
