/**
 * [文章页面]
 */
define(function(require, exports, module) {
	var app = require('app');
	var util = app.util;
	var $ = app.jquery;
	// 代码高亮插件
	var prism = require('@plugins/prism/prism');

	// 请求地址
	var api = app.config('api/showarticle');

	var Article = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'P-article',
				'template': 'project/template/pages/article.html',
				'vModel'  : {
					// 是否显示加载状态
					'isLoading': true,
					// 文章内容(html)
					'content'  : ''
				}
			});
			// 文章id
			this.$id = 0;
			// 请求数据状态锁
			this.$dataReady = false;
			// document缓存
			this.$doc = $(document);
			// 滚动条是否到达评论区
			this.$reach = false;
			this.Super('init', arguments);
		},

		/**
		 * 布局视图初始化完成
		 */
		viewReady: function() {
			// 创建子模块
			this.createTplModules();
		},

		/**
		 * 显示加载状态并隐藏页脚
		 */
		showLoading: function() {
			this.vm.set('isLoading', true);
			this.notify('layout.blogFooter', 'switchFooter', false);
			return this;
		},

		/**
		 * 隐藏加载状态并显示页脚
		 */
		hideLoading: function() {
			this.vm.set('isLoading', false);
			this.notify('layout.blogFooter', 'switchFooter', true);
			return this;
		},

		/**
		 * 在路由调用之后，保存路由参数
		 * @param  {Object}  data  [路由参数]
		 */
		saveRouter: function(data) {
			this.$router = data;
			this.$id = +data.param;
			// 加载列表数据
			this.load();
			return this;
		},

		/**
		 * 更新请求id
		 * @param  {Number}  id  [文章ID]
		 */
		setParam: function(id) {
			this.$id = +id;
			return this;
		},

		/**
		 * 拉取文章数据
		 */
		load: function() {
			this.$dataReady = false;
			this.showLoading();

			var param = {
				'artid': this.$id
			};
			app.ajax.get(api, param, this.afterDataBack, this);
			return this;
		},

		/**
		 * 请求数据回调
		 * @param   {Object}  err   [请求错误信息]
		 * @param   {Object}  data  [请求成功信息]
		 */
		afterDataBack: function(err, data) {
			this.$dataReady = true;
			this.setTimeout('hideLoading', app.config('delay'));

			if (err) {
				util.error(err);
				return false;
			}

			this.setContent(data.result);

			var doc = this.$doc;
			var dHeight = doc.height();
			var cHeight = util.getClientHeight();
			var comment = this.getChild('comment');

			if (dHeight <= cHeight && comment) {
				this.$reach = true;
				comment.load(this.$id);
			}
			else {
				this.bind(doc, 'scroll.loadComment', this.eventScrolling);
			}
		},

		/**
		 * 页面滚动事件
		 */
		eventScrolling: function(evt) {
			var comment = this.getChild('comment');
			var commentDom = this.getDOM('.P-articleComments');

			// 滚动条距离顶部距离
			var sTop = this.$doc.scrollTop();
			// 评论区距离顶部距离
			var oTop = commentDom.offset().top;
			// 可视区高度
			var cHeight = util.getClientHeight();
			// 滚动目标差值
			var dTop = Math.floor((oTop - sTop) * 1.15);

			// 滚动条到达评论区域
			if (dTop < cHeight && !this.$reach && comment) {
				this.$reach = true;
				comment.load(this.$id);
			}
		},

		/**
		 * 设置数据
		 */
		setContent: function(result) {
			var date = result.date;
			var title = result.title;
			var content = result.content;
			var comments = result.comments;

			this.vm.set('content', content);

			this.setTimeout('renderHighLighter');

			// 通知banner更新显示内容
			this.notify('layout.blogBanner', 'changeInfo', {
				'date'    : util.prettyDate(date),
				'title'   : title,
				'comments': comments
			});
		},

		/**
		 * 渲染代码高亮
		 */
		renderHighLighter: function() {
			var preDOM = this.getDOM('pre');
			var num = preDOM.size(), i = 0;
			var pre, cls, b, e, type, tmp;

			for (; i < num; i++) {
				pre = preDOM.eq(i);
				cls = pre.attr('class');
				b = cls.indexOf(':') + 1;
				e = cls.indexOf(';');
				type = cls.slice(b, e).trim();
				tmp = pre.html();
				pre.empty().html('<code class="language-'+ type +'">' + tmp + '</code>');
			}
			prism.highlightAll();
		}
	});
	exports.base = Article;
});