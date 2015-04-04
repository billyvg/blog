define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var C = require('@core/config');
	var layout = require('layout').base;
	var pager = require('@modules/pager').base;
	var banner = require('@modules/banner').base;
	var eventHelper = require('@core/eventHelper');
	var loading = require('@modules/loading').base;
	var dataHelper = require('@core/dataHelper').base;

	var Archive = {
		init: function( data ) {
			this.$data = data;
			this.build();
			layout.hideFooter();
		},

		build: function() {
			var data = this.$data;
			var dom = data.dom;
			var quotations = C.quotations;
			var num = quotations.length - 1;

			// 设置标题
			layout.setTitle( C.archiveTitle[data.name] );

			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt">'+ quotations[util.random(0, num)] +'</h1>'
			});
			// banner.hide();

			this.$doms = {
				listBox: $('<div class="P-archive-list"/>').appendTo( dom ).hide(),
				pagerBox: $('<div class="P-archive-pager"/>').appendTo( dom ).hide()
			}

			// 创建分页模块
			pager.init({
				'target': this.$doms.pagerBox
			});

			// 监听页码选择事件
			eventHelper.on('pagerSelected', this.onPagerSelected, this);

			// 数据加载之前显示loading
			this.loading = loading.init({
				'target': dom,
				'width':  dom.width(),
				'size': 25,
				'class': 'center',
				'autoHide': true
			});

			// 加载数据
			this.load();
		},

		hide: function() {
			this.$doms.listBox.hide();
			this.$doms.pagerBox.hide();
		},

		show: function() {
			this.$doms.listBox.show();
			this.$doms.pagerBox.show();
		},

		showLoading: function() {
			this.loading.show();
			this.hide();
		},

		hideLoading: function() {
			this.loading.hide();
			this.show();
		},

		// 拉取数据
		load: function( param ) {
			var dc = C.dataCenter;
			param = param || this.getParam();
			this.showLoading();
			dataHelper.get( dc.listarchives, param, this.onData, this );
		},

		// 获取参数
		getParam: function() {
			var ret = null;
			var data = this.$data;
			ret = util.mergeParam( C.archiveOption, {
				'catid': C.cat[data.name]
			});
			return ret;
		},

		// 拉取数据回调
		onData: function( err, res ) {
			if( err ) {
				util.error('数据拉取失败！错误码:' + err.status + ', 错误信息:' + err.statusText);
				return false;
			}
			var dom = this.$data.dom;
			if( !res.success ) {
				dom.html('拉取数据似乎出了点问题~');
				return;
			}
			var info = this.$info = res.result;
			if( util.isEmpty( info ) ) {
				dom.html('无数据');
				return;
			}
			// 创建列表
			this.buildArchives( info );
			// 更新页码
			pager.setParam({
				'page': info.page,
				'pages': info.pages,
				'total': info.total
			});

			// 隐藏loading
			this.hideLoading();
			layout.showFooter();
		},

		// 创建
		buildArchives: function( info ) {
			var data = this.$data;

			// 先清空之前的列表
			this.$doms.listBox.empty();

			// 循环创建列表
			util.each( info.items, this.buildItems, this );

			// 设置标题
			var prefix = info.page === 1 ? "" : ' - 第' + info.page + '页';
			if( prefix ) {
				layout.setTitle( C.archiveTitle[data.name] + prefix );
			}
		},

		// * buildItems 循环生成列表. idx->序号, item->选项对象
		buildItems: function( item, idx ) {
			var data = this.$data;
			var sections = [];
			// var str = item.publishDate.slice( 0, 10 );
			// var arr = str.split('-');
			// var year = arr[0];
			// var mouth = +arr[1];
			// var day = +arr[2];
			var anchor = data.name + '/' + item.id; // 超链接地址
			var cover = item.cover ? '<img class="cover" src="'+ item.cover +'">' : "";
			sections.push([
				'<section list-id="'+ idx +'">',
					'<div class="P-archive-list-title">',
						'<h2><a href="#'+ anchor +'" title="'+ item.title +'" class="title">'+ item.title +'</a></h2>',
					'</div>',
					// '<a href="#'+ anchor +'" class="abstract">',
						'<article>',
							'<p class="abstract">' + item.content +' ……</p>',
							cover,
						'</article>',
					// '</a>',
					'<div class="P-archive-list-info">',
						'<span class="tag">分类：'+ data.name +'</span>',
						' | ',
						'<span class="tag">评论：'+ item.comments +'</span>',
					'</div>',
				'</section>'
			].join(''));
			this.$doms.listBox.append( sections.join('') );
		},

		// 页码激活事件
		onPagerSelected: function( ev ) {
			var page = ev.param;
			var oldParam = this.getParam();
			var newParam = util.mergeParam( oldParam, {
				'page': page
			});
			this.load( newParam );
		}
	}
	exports.base = Archive;
});