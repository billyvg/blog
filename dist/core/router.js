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
		var hash = LOC.hash.replace(/^[#\/\!]+/, '') || C.defaultPage;
		var pos = hash.indexOf('/');
		var param = pos == -1 ? '' : hash.substr( pos + 1 );
		run( hash, param );
	}

	function run( name, param ) {
		data.name = name;
		data.param = param;
		require.async( '@controller/' + name, afterRun );
	}

	function afterRun( module ) {
		if( module[action] && util.isFunc( module[action] ) ) {
			module[action]( data, view );
		}
		else {
			util.error('Method "' + action + '" is not correct in controller/' + data.module + '.js');
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
});