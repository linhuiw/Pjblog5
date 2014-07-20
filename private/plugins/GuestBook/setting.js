// JavaScript Document
exports.tops = {
	type: 'text',
	value: '10',
	des: '前台首页调用条数'
};

exports.dispearDate = {
	type: 'select',
	value: '0',
	childs: [
		{
			name: '不显示日志时间',
			value: '0'
		},
		{
			name: '显示日志时间',
			value: '1'
		}
	],
	des: '是否显示日志时间'
};

exports.delay = {
	type: 'text',
	value: '30000',
	des: '留言发表间隔(ms)'
};

exports.perpage = {
	type: 'text',
	value: '10',
	des: '首页留言每页条数'
};