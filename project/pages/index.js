define(function( require, exports ){
	var app = require('app');
	var $ = require('jquery');
	var util = require('util');
	var C = app.getConfig();
	var layout = require('@modules/layout').base;

	var Index = {
		init: function( data ) {
			this.$data = data;
			layout.setTitle( C.archiveTitle[this.$data.name] );
			this.build();
		},

		build: function() {
			var dom = this.$data.dom;
			// 布局
			var html = $([
				'<div class="M-index">',
					'<div class="M-indexWraper">',
						'<h2 class="tc">',
							'<a href="/blog/#matters" class="myBlog">',
								'<span class="db center fts24 lsp2">欢迎光临我的博客</span>',
								'<span class="db center fts14 lsp1">www.tangbc.com/blog/</span>',
							'</a>',
						'</h2>',
					'</div>',
				'</div>'
			].join(''));
			dom.append( html );

			var animateds = [
				'zoomInUp',
				'zoomInDown',
				'zoomInLeft',
				'zoomInRight'
			];
			var animateCls = animateds[util.random( 0, animateds.length - 1 )];
			app.animate.going( $('.myBlog', html), animateCls, 2 );

			// 按钮绑定鼠标事件
			// app.event.hover( myBlog, this.eventBtnMouseEnter, this.eventBtnMouseLeaver, this );
		},

		eventBtnMouseEnter: function( evt, elm ) {
			$(elm).removeClass( this.$animateCls ).addClass('bounce');
		},

		eventBtnMouseLeaver: function( evt, elm ) {
			$(elm).removeClass('bounce');
		}
	}
	exports.base = Index;
});