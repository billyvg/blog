/**
 * [系统配置信息]
 */
define(function() {
	/**
	 * 配置文件语言标记
	 */
	function _T(text) {
		return text;
	}

	return {

		// 是否将suagr模块暴露为全局变量
		debug: true,

		// 默认路由
		defaultRouter: 'frontends',

		// 默认控制器目录
		controllerPath: '@controller/',

		// 控制器的调用方法
		action: 'onRun',

		// 路由参数存储cookie的分隔符
		hashString: ':(',

		// 规定合法的路由以及允许参数，除此之外都切到404
		validRouter: {
			'moods'    : [],
			'message'  : [],
			'frontends': ['page'],
			'search'   : ['word']
		},

		// 页脚文字
		copyright: 'Copyright ©2012-2015 TANGBC.COM',

		// 多语言
		lang: {
			'zhCN': _T('简体中文'),
			'zhHK': _T('繁体中文'),
			'enUS': _T('英文')
		},

		// 默认语言
		defaultLang: 'zhCN',

		// 导航
		navs: [
			{'name': _T('前端那些事'), 'link': '#frontends'},
			{'name': _T('随便写写'), 'link': '#moods'},
			{'name': _T('给我留言'), 'link': '#message'}
		],

		// 语录集合
		quotations: [
			"Keep living, keep codeing ......",
			"Do all you can to be a better man",
			"To be or not to be, that is a question",
			"Stay hungry Stay foolish"
		],

		// 成对的css3动画
		pairFrames: [
			['fadeInDown', 'fadeOutUp'],
			['rotateInDownLeft', 'rotateOutUpRight'],
			['lightSpeedIn', 'lightSpeedOut'],
			['bounceInLeft', 'bounceOutRight'],
			['fadeInUp', 'fadeOutDown'],
			['rollIn', 'rollOut'],
			['rotateIn', 'rotateOut']
		],

		// 栏目title
		archiveTitle: {
			'frontends': _T('前端那些事'),
			'moods'    : _T('随便写写'),
			'message'  : _T('给我留言')
		},

		// 栏目默认请求参数
		archiveParam: {
			// 分类ID
			'catid' : 1,
			// 请求第1页
			'page'  : 1,
			// 每页显示数
			'limit' : 6,
			// 摘要长度
			'brief' : 180
		},

		// 评论列表默认请求参数
		commentParam: {
			// 文章ID
			// 'artid': 1,
			// 请求第一页
			'page' : 1,
			// 每页显示数
			'limit': 6,
			// 时间升序, -1降序
			'date' : 1
		},

		// 分类hash对应的category数据库id
		category: {
			'frontends': 1,
			'moods'    : 24
		},

		// 数据接口
		api: {
			// 搜索
			'search'      : '/blog/wheat/api/search/query.php',
			// 获取标题列表
			'listtitle'   : '/blog/wheat/api/listtitle/query.php',
			// 获取评论列表
			'listcomment' : '/blog/wheat/api/listcomment/query.php',
			// 添加一条评论
			'addcomment'  : '/blog/wheat/api/addcomment/query.php',
			// 获取留言列表
			'listmessage' : '/blog/wheat/api/listmessage/query.php',
			// 添加一条留言
			'addmessage'  : '/blog/wheat/api/addmessage/query.php',
			// 验证码校验
			'verifycode'  : '/blog/wheat/api/verifycode/query.php',
			// 获取验证码
			'getthecode'  : '/blog/wheat/api/getthecode/query.php',
			// 获取一篇博客
			'showarticle' : '/blog/wheat/api/showarticle/query.php',
			// 获取博客列表
			'listarchives': '/blog/wheat/api/listarchives/query.php'
		},

		// 延迟展示(毫秒)
		delay: 388
	};
});