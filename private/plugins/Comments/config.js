// JavaScript Document
exports.name = '系统插件-文章评论';
exports.author = '小影';
exports.mail = 'i@xybk.net';
exports.site = 'http://www.xybk.net/article.asp?id=20';
exports.des = '提供文章评论功能和留言本功能。';
exports.icon = 'logo.png';
exports.mark = 'AAADD8BC14F5C522C3D32E24DFD';
exports.ControlNavs = {
	name: '评论/留言管理',
	icon: 'fa-envelope',
	childs: {
        list: {
            name: '评论/留言管理',
            icon: 'fa-envelope'
        },
        set: {
            name: '过滤设置',
            icon: 'fa-wrench'
        }
    }
}
exports.AssetNav = {
	name: '雁过留声',
	des: '留言本插件',
	file: 'message.asp'
}