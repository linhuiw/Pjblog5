if ( !blog.conn ){
	blog.conn = new connect('mssql', {
		netserver: blog.connect.netserver,
		access: blog.connect.access,
		username: blog.connect.username,
		password: blog.connect.password
	});
}
