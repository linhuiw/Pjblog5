// JavaScript Document
exports.discount = {
	type: 'text',
	value: '10',
	des: '前台显示链接数'
};
exports.distype = {
    type: 'select',
    value: '2',
    childs: [
        {
            name: '全部',
            value: '2'
        },
        {
            name: '文字',
            value: '0'
        },
        {
            name: '图标',
            value: '1'
        }
    ],
    des: '前台显示链接类型'
};