require('connect');

var user = new Class();

user.add('oAuthLogin', function(params){
	var msg = { success: false, message: '操作失败' };
	var redbo = new dbo('blog_members', blog.conn);
	var count = blog.conn.Execute("Select Count(id) From blog_members Where member_openid='" + params.openid + "'")(0).value;

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
			redbo.top(1).selectAll().and('member_openid', params.openid).open(3).set(data).save().exec(function(object){
				id = object('id').value;
			}).close();
		}else{
			data.member_group = 2;
			redbo.create().set(data).save().exec(function(object){
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

module.exports = user;
