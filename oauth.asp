<!--#include file="appjs/service/tron.asp" -->
<!--#include file="public/map.asp" -->
<%
;
	var oAuth = require("public/library/oauth2");
		global = require("private/chips/" + blog.cache + "blog.global");
		
	var o = new oAuth(global.blog_appid, global.blog_appkey);
	var LAYOUT = require("public/library/layout");
	var layout = new LAYOUT();
	
	o.createServer(function( reqs ){
		var code = reqs.query.code,
			from = reqs.query.from,
			state = reqs.query.state;
			
		var sess = Session(blog.cookie + "_oauth_jump");

		if ( sess != state ){
			this.error = 10002;
		}
			
		var _token, _openid, _hashkey, _expires_in, _params;
		
		this

			.reject(function(error, id){
				layout.createServer(function( req ){
					this.navigation();
					this.add("oAuthErrorMessage", error);
					this.add("oAuthErrorID", id);	
					this.render("oAuthError.asp");
				});
			
				try{
					layout.conn.Close();
				}catch(e){};
				Library.log("error: " + id);
			})
			
			.then(function(){
				var msg = this.getToken(code);
				
				_token = msg.access_token;
				_hashkey = msg.token_hashkey;
				_expires_in = msg.expires_in;

				return msg.access_token;
			})
			
			.then(function(value){
				var msg = this.getOpenid(value);
				_openid = msg.openid;
			})
			
			.then(function(){
				_params = this.getUserInfo(_token, _openid);
			})
			
			.then(function(){
				_params.token = _token;
				_params.openid = _openid;
				_params.hashkey = _hashkey;
				_params.expires_in = _expires_in;
				
				var Member = require("public/services/user");
					Member.add("dbo", layout.dbo);
					Member.add("conn", layout.conn);
				var member = new Member();
			
				return member.OauthLogin(_params);
			})
			
			.then(function(login){
				if ( !login.success ){
					this.error = 10019;	
				}
			})
			
			.then(function(){
				try{
					layout.conn.Close();
				}catch(e){};
				Response.Redirect(from);
			});
	});
%>