// JavaScript Document
exports.minlength = {
	type: 'text',
	value: '3',
	des: '最小字符数'
};
exports.maxlength = {
	type: 'text',
	value: '300',
	des: '最大字符数'
};
exports.delay = {
	type: 'text',
	value: '30',
	des: '评论/留言间隔(秒)'
};
exports.back_perpage = {
	type: 'text',
	value: '10',
	des: '后台每页条数'
};
exports.com_perpage = {
	type: 'text',
	value: '10',
	des: '每页评论数'
};
exports.mes_perpage = {
	type: 'text',
	value: '20',
	des: '每页留言数'
};
exports.tops = {
	type: 'text',
	value: '10',
	des: '最新评论/留言数'
};
exports.audits = {
    type: 'select',
    value: '1',
    childs: [
        {
            name: '是',
            value: '0'
        },
        {
            name: '否',
            value: '1'
        }
    ],
    des: '开启评论审核'
};
exports.cloud = {
    type: 'select',
    value: '0',
    childs: [
        {
            name: '是',
            value: '0'
        },
        {
            name: '否',
            value: '1'
        }
    ],
    des: '开启云通知'
};