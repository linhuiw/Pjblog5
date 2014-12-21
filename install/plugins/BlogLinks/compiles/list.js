module.exports = new Class(function(querys, getforms){
	var rec = new dbo(blog.tb + 'links', blog.conn)
	var list = rec.selectAll().desc('id').toJSON();
	
	this.data = {};
	this.data.list = list;
	this.data.icon = 'private/plugins/' + this.pfolder + '/default.png';
	this.data.pid = this.pid;
	this.data.pfolder = this.pfolder;

	return this.data;
});	