/**
 * [工具方法模块]
 */
define(function( require, util ){
	var WIN = window;
	var DOC = document;
	var OP = Object.prototype;
	var SP = String.prototype;

	/**
	 * [isObject 是否是对象自变量, {}或new Object()的形式]
	 */
	function isObject( obj ) {
		return OP.toString.call( obj ) === '[object Object]';
	}

	/**
	 * [isArray 是否是真数组, []或new Array()的形式]
	 */
	function isArray( obj ) {
		return OP.toString.call( obj ) === '[object Array]';
	}

	/**
	 * [isFunc 是否是函数]
	 */
	function isFunc( fn ) {
		return ( fn instanceof Function );
	}

	/**
	 * [isString 是否是字符串]
	 */
	function isString( str ) {
		return ( typeof( str ) === 'string' );
	}

	/**
	 * [inArray 数组中是否存在某元素]
	 * @param  {[Mix]}   ele [目标元素]
	 * @param  {[Array]} arr [查询数组]
	 * @return {[Number]}    [数组下标]
	 */
	function inArray( ele, arr ) {
		if( isArray( arr ) ) {
			var leng = arr.length, i = 0;
			for( ; i < leng; i++ ) {
				if( arr[i] === ele ) {
					return i;
				}
			}
		}
		return -1;
	}

	/**
	 * 工具方法导出
	 */
	util.isObject = isObject;
	util.isArray = isArray;
	util.isFunc = isFunc;
	util.isString = isString;
	util.inArray = inArray;

	/**
	 * 系统日志函数
	 */
	var cons = WIN.console || {};
	util.log = function() {
		cons.log.apply( cons, arguments );
	}
	util.error = function() {
		if( cons.error.apply ) {
			cons.error.apply( cons, arguments );
		}
		else {
			cons.error( arguments[0] );
		}
	}
	
	/**
	 * [mergeParam AJAX请求参数的合并/更新/格式化]
	 * @param  {[JSON]} Jold [默认参数]
	 * @param  {[JSOn]} Jnew [指定参数]
	 * @return {[JSON]}      [最新参数]
	 */
	util.mergeParam = function( Jold, Jnew ) {
		if( arguments.length == 1 ) {
			Jnew = {};
		}
		if( !isObject( Jold ) || !isObject( Jnew ) ) {
			return false;
		}
		for( var pro in Jold ) {
			Jold[pro] = Jnew.hasOwnProperty( pro ) ? isArray( Jnew[pro] ) ? Jnew[pro].join(',') : Jnew[pro] : isArray( Jold[pro] ) ? Jold[pro].join(',') : Jold[pro];
		}
		return Jold;
	}

});