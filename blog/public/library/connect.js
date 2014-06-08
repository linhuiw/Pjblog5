// JavaScript Document
var dbo = require('dbo'),
	conection = dbo.Connection,
	conn = new conection();

exports.dbo = dbo;
exports.conn = conn.connect(blog.connection);