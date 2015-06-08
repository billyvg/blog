/**
 * [留言页面]
 */
define(function( require, exports ){
	var app = require('app');
	var c = app.getConfig();
	var dc = c.dataCenter;
	var $ = require('jquery');

	var layout = require('@modules/layout').base;
	var banner = require('@modules/banner').base;
	var banTxt = '可以随意发表：无聊的、建议的、拍砖的、批评的……';

	var Message = {
		init: function( data ) {
			this.$data = data;
			this.$subDoms = {}; // 子dom对象缓存
			this.$imageUrl = dc.getthecode;
			this.$holder = {
				'textarea': '[必填] 在这里输入留言的内容~',
				'nick': '[必填] 在这里输入昵称',
				'url': '[选填] 昵称链接网址(比如博客/微博/知乎主页url)',
				'contact': '[选填] 联系方式(比如Email,QQ,微信, 仅博主可见, 不会公开显示)',
				'code': '输入验证码'
			}
			layout.hideFooter().setTitle( c.archiveTitle[data.name] );
			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt animated fadeIn fts28 pt5">'+ banTxt +'</h1>'
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

			// 表单
			var form = $('<div class="M-messageMainForm"/>').appendTo( main );
			// 评论列表
			var list = $('<div class="M-messageMainList"/>').appendTo( main );
			// 分页器
			var pager = $('<div class="M-messageMainPager"/>').appendTo( main );
			// DOM缓存
			this.$doms = {
				'form' : form,
				'list' : list,
				'pager': pager,
				'info' : info
			}
			this.buildForm().buildList().buildPager().buildInfo();
		},

		// 创建评论表单
		buildForm: function() {
			var form = this.$doms.form;
			$([
				'<textarea placeholder="'+ this.$holder.textarea +'" class="textarea"></textarea>',
				'<input placeholder="'+ this.$holder.nick +'" type="text" class="nick"/>',
				'<input placeholder="'+ this.$holder.url +'" type="text" class="url"/>',
				'<input placeholder="'+ this.$holder.contact +'" type="text" class="contact"/>',
				'<div class="footer">',
					'<input placeholder="'+ this.$holder.code +'" type="text" class="code"/>',
					'<img class="image" title="点击更换验证码" src="'+ this.$imageUrl +'"/>',
					'<button class="submit">发表评论</button>',
					'<button class="reset">重置</button>',
				'</div>'
			].join('')).appendTo( form );
			// 表单DOM缓存
			this.$subDoms.form = {
				'textarea' : form.find('.textarea'),
				'nick'     : form.find('.nick'),
				'url'      : form.find('.url'),
				'contact'  : form.find('.contact'),
				'code'     : form.find('.code')
			}

			// 读取cookie值
			var nickName = app.cookie.get('usernickname');
			var link = app.cookie.get('userlink');
			if ( nickName ) {
				this.$subDoms.form.nick.val( nickName ).prop('disabled', true);
			}
			if ( link ) {
				this.$subDoms.form.url.val( link );
			}

			// 点击更换验证码
			app.event.bind( form.find('.image'), 'click', this.eventChangeCode, this );
			// 点击重置
			app.event.bind( form.find('.reset'), 'click', this.eventReset, this );
			// 点击提交
			app.event.bind( form.find('.submit'), 'click', this.eventSubmit, this );
			return this;
		},

		// 点击更换验证码
		eventChangeCode: function( evt, elm ) {
			var self = this;
			this.$subDoms.form.code.focus();
			setTimeout(function() {
				$(elm).attr('src', self.$imageUrl + '?ts=' + evt.timeStamp);
			}, 500);
			app.animate.play($(elm), 'flipOutY');
		},

		// 点击重置
		eventReset: function() {
			this.$subDoms.form.textarea.val('');
			this.$subDoms.form.code.val('');
			this.$subDoms.form.contact.val('');
			if ( !app.cookie.get('usernickname') ) {
				this.$subDoms.form.nick.val('');
			}
			if ( !app.cookie.get('userlink') ) {
				this.$subDoms.form.url.val('');
			}
			return false;
		},

		// 点击提交
		eventSubmit: function() {

		},

		// 创建评论列表
		buildList: function() {
			return this;
		},

		// 创建评论分页
		buildPager: function() {
			return this;
		},

		// 创建右侧信息
		buildInfo: function() {
			return this;
		}
	}
	exports.base = Message;
});