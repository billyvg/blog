/**
 * [留言页面]
 */
define(function( require, exports ){
	var app = require('app');
	var c = app.getConfig();
	var dc = c.dataCenter;
	// var util = require('util');
	var $ = require('jquery');

	var layout = require('layout').base;
	var banner = require('@modules/banner').base;
	var comment = require('@modules/comment');

	var Message = {
		init: function( data ) {
			this.$ = {};
			this.$data = data;
			this.$param = $.extend({}, c.commentParam);
			layout.showFooter().setTitle( c.archiveTitle[data.name] );
			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt animated fadeIn fts28 pt5">可以随意发表：无聊的、建议的、拍砖的、批评的……</h1>'
			});
			this.build();
			return this;
		},

		build: function() {
			var target = this.$data.dom;
			var msgDom = $('<div class="M-message"/>').appendTo( target );
			// 留言左侧
			var main = $('<div class="M-messageMain"/>').appendTo( msgDom );
			// 右侧信息
			var info = $('<div class="M-messageInfo"/>').appendTo( msgDom );

			// 选项卡
			$([
				'<ul class="tabHead">',
					'<li op-type="list">留言列表</li>',
					'<li op-type="form" class="act">我要留言</li>',
				'</ul>',
				'<div class="tabBody">',
					// 列表
					'<div class="tabCont">',
						'<div class="M-messageMainList"/>',
						'<div class="M-messageMainPager"/>',
					'</div>',
					// 表单
					'<div class="tabCont">',
						'<div class="M-messageMainForm"/>',
					'</div>',
				'</div>'
			].join('')).appendTo( main );

			// DOM缓存
			this.$doms = {
				'info'   : info,
				'form'   : main.find('.M-messageMainForm'),
				'list'   : main.find('.M-messageMainList'),
				'pager'  : main.find('.M-messageMainPager'),
				'tabCont': main.find('.tabCont')
			}

			// 点击切换选项卡
			app.event.proxy( main.find('.tabHead'), 'click', 'li', this.eventSwitchTab, this );

			// 构建细节
			this.buildForm().buildList().buildInfo();
		},

		// 切换选项卡
		eventSwitchTab: function( evt, elm ) {
			var index = $(elm).index();
			var type = $(elm).attr('op-type');
			if ( !$(elm).hasClass('act') ) {
				// 切换容器
				$(elm).addClass('act').siblings('li').removeClass('act');
				this.$doms.tabCont.eq( index ).show().siblings().hide();

				// 切到列表重新拉取数据
				if ( type === 'list' && this.$.list ) {
					this.$.list.load();
				}
			}
			return false;
		},

		/*
		 * 创建留言表单
		 */
		buildForm: function() {
			var form = this.$.form = comment.form;
			form.init({
				'target': this.$doms.form,
				'posturl': dc.addmessage,
				'hasContact': true,
				'submitTxt': {
					'init'   : '发表留言',
					'pushing': '正在提交……',
					'success': '留言成功！',
					'error'  : '留言失败请重试'
				},
				'holderTxt': {
					'content': '[必填] 在这里输入留言的内容~',
					'nick'   : '[必填] 在这里输入昵称',
					'link'   : '[选填] 网址(比如博客/微博/知乎主页url)'
				}
			});
			return this;
		},

		/*
		 * 创建留言列表
		 */
		buildList: function() {
			var list = this.$.list = comment.list;
			list.init({
				'target': this.$doms.list,
				'geturl': dc.listmessage,
				'hasHead': false,
				'hasOp': false,
				'pageSize': 10, // 每页显示留言条数
				'cls': 'M-messageMainListWidth'
			});
			return this;
		},

		/*
		 * 创建右侧信息
		 */
		buildInfo: function() {
			var info = this.$doms.info;
			$([
				'<div class="infoBox">',
					'<h2 class="title">博主信息</h2>',
					'<ul>',
						'<li>',
							'<label>所在地：</label>',
							'<span>广东广州</span>',
						'</li>',
						'<li>',
							'<label>联系方式：</label>',
							'<span>went2077@gmail.com</span>',
						'</li>',
					'</ul>',
					'<p class="sayother">欢迎给我提各种改进建议或者博客框架目前存在的BUGs，谢谢！</p>',
				'</div>'
			].join('')).appendTo( info );
			return this;
		}
	}
	exports.base = Message;
});