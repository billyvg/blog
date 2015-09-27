/**
 * [分页模块]
 */
define(function(require, exports) {
	var app = require('app');
	var util = app.util;
	var $ = app.jquery;

	// 带链接的分页(通过url参数分页)
	var HasLink = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'M-pagerHasLink',
				// 最多显示的项数
				'max'     : 5,
				'template': 'project/template/modules/pagerHasLink.html',
				'vModel'  : {
					// 页码数组
					'pages'      : [],
					// 分页信息
					'info'       : '',
					// 是否显示上一页按钮
					'showPrev'   : true,
					// 是否显示下一页按钮
					'showNext'   : true,
					// 点击上一页
					'vmClickPrev': this.eventClickPrev,
					// 点击下一页
					'vmClickNext': this.eventClickNext
				}
			});
			// 当前页码
			this.$page = 1;
			// 总页数
			this.$pages = 1;
			// 跳转路径名称
			this.$path = '';
			this.Super('init', arguments);
		},

		// 点击上一页
		eventClickPrev: function() {
			var page = this.$page;
			if (page !== 1) {
				app.controller.go(this.$path + '?page=' + (page - 1));
			}
			return false;
		},

		// 点击下一页
		eventClickNext: function() {
			var page = this.$page;
			if (page !== this.$pages) {
				app.controller.go(this.$path + '?page=' + (page + 1));
			}
			return false;
		},

		/**
		 * 设置/更新分页信息
		 * @param  {Object}  param  [包括页码和总页数的对象]
		 */
		setParam: function(param) {
			if (!util.isObject(param)) {
				util.error('page param must be an Object: ', param);
				return false;
			}

			this.$path = param.path;
			this.$page = param.page;
			this.$pages = param.pages;

			if (this.$page && this.$pages) {
				this.updatePages();
			}
		},

		/**
		 * 更新页码
		 */
		updatePages: function() {
			var max = this.getConfig('max');
			var page = this.$page;
			var path = this.$path;
			var pages = this.$pages;

			// 生成页码选项
			var items = _createPageArray(page, pages, max);

			var results = [];
			util.each(items, function(item) {
				results.push({
					// 页码数字
					'text'  : item,
					// 是否激活
					'isAct' : item === page,
					// 跳转链接
					'href'  : item === page || item === '···' ? null : '#' + path + '?page=' + item,
					// 是否是省略号
					'isOmit': item === '···'
				});
			});

			this.vm.set({
				'pages'   : results,
				'info'    : T('第 {1} 页，共 {2} 页', page, pages),
				'showPrev': page !== 1,
				'showNext': page !== pages
			});
		}
	});
	exports.hasLink = HasLink;


	// 无连接的分页方式(通过消息监听分页)
	var NoLink = HasLink.extend({
		init: function(config) {
			config = app.cover(config, {
				'class': 'M-pagerNoLink'
			});
			this.Super('init', arguments);
		},

		viewReady: function() {
			var el = this.getDOM();
		}
	});
	exports.noLink = NoLink;


	/**
	 * 更新页码展现格式,增加省略号
	 * @param   {Number}  page   [当前页码]
	 * @param   {Number}  pages  [总页数]
	 * @param   {Number}  max    [最大显示项数]
	 * @return  {Array}          [结果数组]
	 */
	function _formatPage(page, pages, max) {
		// 前面的页码选项(保留第1,2页)
		var fontArr = [1,2,'···'];
		// 后面的页码选项
		var backArr = ['···'];
		var retArr = null;

		// 激活的页码小于max的不作处理
		if (page < max) {
			return false;
		}

		// 激活页码大于等于max的做截断: 12...456...
		// 非特殊情况截断：激活页前后有两页

		// 当前页与总页的差值
		var diff = pages - page;
		switch(diff) {
			// 最后一页
			case 0:
				backArr = [page - 3, page - 2, page - 1, page];
			break;
			// 倒数第一页
			case 1:
				backArr = [page - 2, page - 1, page, page + 1];
			break;
			// 倒数第二页
			case 2:
				backArr = [page - 2, page - 1, page, page + 1, page + 2];
			break;
			default:
				backArr = [page - 2, page - 1, page, page + 1, page + 2].concat(backArr);
		}

		retArr = fontArr.concat(backArr);

		return retArr;
	}

	/**
	 * 生成页码数组[1,2,3,4,5,'...']
	 * @param   {Number}  page   [当前页码]
	 * @param   {Number}  pages  [总页数]
	 * @param   {Number}  max    [最大显示项数]
	 * @return  {Array}          [结果数组]
	 */
	function _createPageArray(page, pages, max) {
		var retArr = [], i, tmpArr;
		// 不需要隐藏选项
		if (pages <= max) {
			for (i = 1; i < pages + 1; i++) {
				retArr.push(i);
			}
		}
		// 需要隐藏选项
		else {
			tmpArr = _formatPage(page, pages, max);
			if (!tmpArr) {
				for (i = 1; i < max + 1; i++) {
					retArr.push(i);
				}
				retArr.push('···');
			}
			else {
				retArr = tmpArr;
			}
		}
		return retArr;
	}
});