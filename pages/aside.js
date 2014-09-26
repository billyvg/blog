/**
 * [侧边栏模块(栏目页和文章页)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout');
	var util = require('util');
	var C = require('@core/config');

	var dc = C.dataCenter;
	var Aside = layout.doms.aside;

	// HTML结构
	var html = [
		'<div class="P-me"></div>',
		'<div class="P-list">',
			'<dl class="P-list-dl">',
				'<dt class="P-list-dt"></dt>',
				'<dd class="P-list-dd"></dd>',
			'</dl>',
		'</div>',
		'<div class="P-others"></div>'
	].join('');

	$(html).appendTo( Aside );
	var doms = {
		'me': 		$('.P-me', Aside),
		'list': 	$('.P-list', Aside),
		'listDL': 	$('.P-list-dl', Aside),
		'listDT': 	$('.P-list-dt', Aside),
		'listDD': 	$('.P-list-dd', Aside),
		'others': 	$('.P-others', Aside)
	}
	exports.doms = doms;

	/**
	 * build 侧边栏初始化
	 */
	exports.init = function() {
		this.buildMe().buildList().buildOthers();
		return true;
	}

	/**
	 * TODO：清空后再创建出现无法找到HTML元素节点
	 * empty 清空aside
	 */
	exports.empty = function() {
		layout.doms.aside.empty();
		return false;
	}

	/**
	 * buildMe 构建自我介绍
	 * @return {type} [Aside]
	 */
	exports.buildMe = function() {
		doms.me.html('自我介绍');
		return this;
	}

	/**
	 * buildList 构建文章列表
	 * @return {type} [Aside]
	 */
	exports.buildList = function ( num ) {
		var requestParam = util.mergeParam( C.listOption );

		// 拉取数据
		$.ajax({
			'url': dc.listtitle,
			'method': 'get',
			'dataType': 'json',
			'data': requestParam,
			'success': fnSuccess,
			'error': fnError
		});

		/**
		 * fnSuccess 请求成功
		 * @param  {JSON} res [返回数据]
		 * @return {NULL}     [无返回值]
		 */
		function fnSuccess( res ) {
			if( !res.success ) {
				doms.list.html('拉取数据出了点问题~');
				return;
			}
			var lis = [];
			$.each( res.result.items, function( idx, item ) {
				lis.push([
					'<li>',
						'<a href="#'+ item.archive +'/'+ item.id +'" title="'+ item.title +'">'+ item.title +'</a>',
					'</li>'
				].join(''));
			});
			var ul = '<ul>' + lis.join('') + '</ul>';
			doms.listDT.html('最新文章');
			$(ul).appendTo( doms.listDD );
		}

		/**
		 * fnError 请求失败
		 * @param  {JSON} msg [错误信息]
		 * @return {NULL}     [无返回值]
		 */
		function fnError( msg ) {
			util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
		}

		return this;
	}

	/**
	 * buildOthers 构建底部展示信息
	 * @return {type} [Aside]
	 */
	exports.buildOthers = function() {
		doms.others.html('其他展示信息');
		return this;
	}

});