module.exports = new Class(function(querys, getforms){
	// 获取页码
	var page = Number(querys.page) || 1;
	
	// 获取日志列表
	var iPage = new cmd('iPage', blog.conn);
	var lists = iPage
		.addInputVarchar('@TableName', blog.tb + 'articles')
		.addInputVarchar('@FieldList', 'id, art_title')
		.addInputVarchar('@PrimaryKey', 'id')
		.addInputVarchar('@Where', null)
		.addInputVarchar('@Order', 'id desc')
		.addInputInt('@SortType', 3)
		.addInputInt('@RecorderCount', 0)
		.addInputInt('@PageSize', 20)
		.addInputInt('@PageIndex', page)
		.addOutputInt('@TotalCount')
		.addOutputInt('@TotalPageCount')
		.exec().toJSON();
	
	var pages = {
		from: 1,
		to: iPage.get('@TotalPageCount').value,
		current: page
	}
	
	this.data = {};
	this.data.lists = lists;
	this.data.pages = pages;
	this.data.query = querys;
	
	return this.data;
});	