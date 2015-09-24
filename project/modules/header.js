/**
 * [头部模块(LOGO、导航、搜索框)]
 */
define(function(require, exports, module) {
	var app = require('app');
	var util = app.util;
	var headRoom = require('@plugins/headroom/headroom');

	var Header = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'M-header',
				'tag'     : 'header',
				'template': 'project/template/modules/header.html',
				'vModel'  : {
					// logo文字
					'logo': '<TANGBC/>',
					// 导航数组
					'navs': []
				}
			});
			this.Super('init', arguments);
		},

		/**
		 * 布局视图初始化完成
		 */
		viewReady: function() {
			var vm = this.vm.$;
			var el = this.getDOM();
			var c = this.getConfig();

			// 获取导航数据
			var items = app.config('navs') || [];
			var navs = [];
			util.each(items, function(item) {
				navs.push({
					'text': item.name,
					'link': item.link,
					'act' : false
				});
			});
			this.vm.set('navs', navs);

			// DOM缓存
			this.$doms = {
				'nav': el.find('.M-headerNav')
			};

			// 启用headroom插件
			var target = c.target;
			(new headRoom(target.addClass('head-fixed').get(0), {
				'tolerance': {
					'up'  : 0,
					'down': 0
				},
				'offset': 200,
				'classes': {
					'initial' : 'animated',
					'pinned'  : 'slideInDown',
					'unpinned': 'slideOutUp'
				}
			})).init();
		},

		/**
		 * 更新导航激活状态消息
		 */
		onUpdateNav: function(ev) {
			var navs = this.vm.get('navs');
			var name = ev.param;
			util.each(navs, function(nav) {
				nav.act = nav.link === '#' + name;
			});
		}
	});
	exports.base = Header;
});