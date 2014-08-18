// JavaScript Document
exports.home = { 
	icon: 'fa-home', 
	name: 'Home', 
	des: '欢迎回来，这里是系统综合信息区域！部分插件信息也将会在这里以模块的方式显示！', 
	color: 'text-success',
	hide: true
};

exports.setting = { 
	icon: 'fa-cogs', 
	name: 'Blog Setting', 
	des: '系统设置中心，用来设置系统变量，控制全局功能！', 
	color: 'text-success' 
};

exports.category = { 
	icon: 'fa-list-ul', 
	name: 'Categories', 
	des: '大范围无刷新操作，摒弃以往的难操作分类方式，让用户体验更佳！', 
	color: 'text-info' 
};

exports.article = { 
	icon: 'fa-file-text-o', 
	name: 'Articles', 
	des: '强大的日志操作功能，快速发布日志功能让你对写日志没有反感。日志转移，日志编辑更佳人性化！', 
	color: 'text-primary-lter' 
};

exports.modifyarticle = { 
	icon: 'fa-pencil-square-o', 
	name: 'Edit Article', 
	des: '添加日志或者编辑日志。高级编辑模式让你产生写作的快感！', 
	hide: true, 
	color: 'text-success' 
};

exports.user = { 
	icon: 'fa-user', 
	name: 'Members', 
	des: '用户管理中心。用于全部来自PJBlog官方云平台。', 
	color: 'text-info-dker' 
};

exports.comment = { 
	icon: 'fa-comment', 
	name: 'Comments', 
	des: '用户评论后台管理中心', 
	color: 'text-primary' 
};

exports.level = { 
	icon: 'fa-tachometer', 
	name: 'Limits', 
	des: '系统用户组和系统用户权限让开发者更加灵活区分用户所属等级。', 
	color: 'text-info' 
};

exports.theme = { 
	icon: 'fa-picture-o', 
	name: 'Themes', 
	des: '本地主题。管理你的主题。主题制作请参考官方的API文档。', 
	color: 'text-warning' 
};

exports.plugin = { 
	icon: 'fa-windows', 
	name: 'Plugins', 
	des: '插件控制中心，您可以上传自己的插件后在线安装，也可以选择云端插件安装。方便快捷！', 
	color: 'text-danger' 
};

exports.update = { 
	icon: 'fa-refresh', 
	name: 'Update Online', 
	des: '通过' + blog.AppPlatForm + '平台使用crc32机制来校验文件的完整性', 
	hide: true, 
	color: 'text-success' 
};

exports.themesetting = { 
	icon: 'fa-cog', 
	name: 'Theme Setting', 
	des: '配置主题参数，让你的主题更加灵活多样', 
	hide: true, 
	color: 'text-success' 
};