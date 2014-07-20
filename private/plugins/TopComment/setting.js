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