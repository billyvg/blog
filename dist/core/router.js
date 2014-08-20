/**
 * [路由控制模块]
 */
define(function( require, exports ){
	var WIN = window;
	var LOC = WIN.location;
	var URL = LOC.href;
	var util = require('util');
	var view = require('view');
	var C = require('@core/config');
	var action = C.action;
	var data = {
		dom: null, 	  // 容器对象
		name: null,   // 模块名称
		param: null   // 传递参数
	}

	function hashChanged() {
		var hash, arr, len, name, param;
		hash = LOC.hash.replace(/^[#\/\!]+/, '') || C.defaultPage; // javascript/102
		arr = hash.split('/');
		len = arr.length;
		name = arr[0];
		// 确定参数
		switch( len ) {
			case 1: param = null; break;
			case 2: param = arr[1]; break;
			default: param = arr[2] == '' ? arr[1] : null;
		}
		run( name, param );
	}

	function run( name, param ) {
		data.name = name;
		data.param = param;
		require.async( '@controller/' + name, afterRun );
	}

	function afterRun( module ) {
		// 404
		if( !module ) {
			return false;
		}
		else {
			if( module[action] && util.isFunc( module[action] ) ) {
				module[action]( data, view );
			}
			else {
				util.error('Method "' + action + '" is not correct in controller/' + data.name + '.js');
			}
		}
		
	}

	// 开始执行路由控制
	exports.start = function() {
		if( 'onhashchange' in WIN ) {
			if( WIN.addEventListener ) {
				WIN.addEventListener( 'hashchange', hashChanged, false );
			}
			else {
				WIN.onhashchange = hashChanged;
			}
		}
		else {
			setInterval(function() {
				if( URL != LOC.href ) {
					hashChanged.call( WIN );
				}
			}, 150);
		}
		// 强制执行一次
		hashChanged();
	}

	/**
	 * [goto 路由切换方法]
	 * @param  {[String]} uri [路由地址 / 数字表示跳转的历史]
	 * @return {[null]}       [无返回]
	 */
	exports.goto = function( uri ) {
		if ( util.isString( uri ) ){
			if ( uri.charAt(0) == '/' ){
				LOC.href = uri;
			}else {
				LOC.hash = "#" + uri;
			}
		}else {
			Win.history.go( uri );
		}
	}
});