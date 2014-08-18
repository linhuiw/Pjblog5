// JavaScript Document
exports.home = { 
	icon: 'fa-globe', 
	name: '欢迎回来', 
	des: '欢迎回来，这里是系统综合信息区域！部分插件信息也将会在这里以模块的方式显示！', 
	color: 'text-success',
	hide: true
};

exports.setting = { 
	icon: 'fa-cogs', 
	name: '网站基本设置', 
	des: '系统设置中心，用来设置系统变量，控制全局功能！', 
	color: 'text-success',
	hide: true 
};

exports.category = { 
	icon: 'fa-list-ul', 
	name: '导航分类', 
	des: '大范围无刷新操作，摒弃以往的难操作分类方式，让用户体验更佳！', 
	color: 'text-info' 
};

exports.article = { 
	icon: 'fa-file-text-o', 
	name: '日志管理', 
	des: '强大的日志操作功能，快速发布日志功能让你对写日志没有反感。日志转移，日志编辑更佳人性化！', 
	color: 'text-primary-lter' 
};

exports.modifyarticle = { 
	icon: 'fa-pencil-square-o', 
	name: '编辑日志', 
	des: '添加日志或者编辑日志。高级编辑模式让你产生写作的快感！', 
	hide: true, 
	color: 'text-success' 
};

exports.user = { 
	icon: 'fa-user', 
	name: '用户管理中心', 
	des: '用户管理中心。用于全部来自PJBlog官方云平台。', 
	color: 'text-info-dker' 
};

exports.comment = { 
	icon: 'fa-comment', 
	name: '评论管理中心', 
	des: '用户评论后台管理中心', 
	color: 'text-primary' 
};

exports.level = { 
	icon: 'fa-tachometer', 
	name: '权限与权限组', 
	des: '系统用户组和系统用户权限让开发者更加灵活区分用户所属等级。', 
	color: 'text-info' 
};

exports.theme = { 
	icon: 'fa-picture-o', 
	name: '本地主题管理中心', 
	des: '本地主题。管理你的主题。主题制作请参考官方的API文档。', 
	color: 'text-warning' 
};

exports.plugin = { 
	icon: 'fa-windows', 
	name: '本地插件管理中心', 
	des: '插件控制中心，您可以上传自己的插件后在线安装，也可以选择云端插件安装。方便快捷！', 
	color: 'text-success' 
};

exports.update = { 
	icon: 'fa-refresh', 
	name: '在线更新服务中心', 
	des: '通过' + blog.AppPlatForm + '平台使用crc32机制来校验文件的完整性', 
	hide: true, 
	color: 'text-success' 
};

exports.themesetting = { 
	icon: 'fa-cog', 
	name: '当前主题参数设置', 
	des: '配置主题参数，让你的主题更加灵活多样', 
	hide: true, 
	color: 'text-success' 
};