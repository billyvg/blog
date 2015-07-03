/**
 * [工具方法模块]
 */
define(function(require, util) {
	var WIN = window;
	var UDF;
	var OP = Object.prototype;
	var AP = Array.prototype;
	var docBody = document.body;
	var docElem = document.documentElement;

	/**
	 * isObject 是否是对象自变量, {}或new Object()的形式
	 */
	function isObject(obj) {
		return OP.toString.call(obj) === '[object Object]';
	}

	/**
	 * isArray 是否是真数组, []或new Array()的形式
	 */
	function isArray(obj) {
		return OP.toString.call(obj) === '[object Array]';
	}

	/**
	 * isFunc 是否是函数
	 */
	function isFunc(fn) {
		return (fn instanceof Function);
	}

	/**
	 * isString 是否是字符串
	 */
	function isString(str) {
		return (typeof(str) === 'string');
	}

	/**
	 * isBoolean 是否是布尔值
	 */
	function isBoolean(bool) {
		return (typeof(bool) === 'boolean');
	}

	/**
	 * isNumber 是否是数字
	 */
	function isNumber(num) {
		return (typeof(num) === 'number' && !isNaN(num));
	}

	/**
	 * inArray 数组中是否存在某元素
	 * @param  {Mix}   ele [目标元素]
	 * @param  {Array} arr [查询数组]
	 * @return {Number}    [数组下标]
	 */
	function inArray(ele, arr) {
		if (isArray(arr)) {
			return arr.indexOf(ele);
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
	util.isBoolean = isBoolean;
	util.isNumber = isNumber;

	/**
	 * 系统日志函数
	 */
	var cons = WIN.console || {};
	util.log = function() {
		cons.log.apply(cons, arguments);
	}
	util.error = function() {
		if (cons.error.apply) {
			cons.error.apply(cons, arguments);
		}
		else {
			cons.error(arguments[0]);
		}
	}

	/**
	 * scrollTo 自定义滚动条位置(用于hash改变时纠正滚动条位置)
	 * @param  {Number} x [横位置]
	 * @param  {Number} y [纵位置]
	 */
	util.scrollTo = function(x, y) {
		var _x = x || 0;
		var _y = y || 0;
		window.scrollTo(_x, _y);
	}

	/**
	 * argumentsToArray 参数转数组
	 * @param  {Object} args [参数]
	 * @return {Array}       [数组]
	 */
	util.argumentsToArray = function(args) {
		if  (args instanceof arguments.constructor) {
			return AP.slice.call(args);
		}
		else {
			return args;
		}
	}

	/**
	 * getKeyName 获取JSON对象键值名
	 * @param  {String} val  [值]
	 * @param  {Object} obj  [值所在的对象]
	 * @return {String}      [键值名称]
	 */
	util.getKeyName = function(val, obj) {
		var key = '';
		if ((!val || !obj) && !isObject(obj)) {
			return false;
		}
		for (key in obj) {
			if (obj[key] == val) {
				return key;
			}
		}
		return false;
	}

	/**
	 * isEmpty 检测是否为空对象或者空数组
	 * @param  {String} val  [值]
	 * @return {Boolean}     [空为真,非空为假]
	 */
	util.isEmpty = function(val) {
		if (isObject(val)) {
			for (var property in val) {
				if (val.hasOwnProperty(property)) {
					return false;
				}
				return true;
			}
		}
		else if (isArray(val)) {
			return (val.length === 0);
		}
	}

	/**
	 * each 遍历数组 (TODO:遍历对象)
	 * @param  {Array}     items     [数组]
	 * @param  {Fuction}   callback  [回调函数]
	 * @param  {Object}    context   [作用域]
	 */
	util.each = function(items, callback, context) {
		if (!isArray(items) || !isFunc(callback)) {
			return false;
		}
		if (!context) {
			context = WIN;
		}
		var ret;
		for (var i = 0; i < items.length; i++) {
			ret = callback.call(context, items[i], i);
			// 回调返回false退出循环
			if (ret === false) {
				break;
			}
			// 回调返回null删除当前选项
			if (ret === null) {
				items.splice(i, 1);
				i--;
			}
		}
	}

	/**
	 * guid 获取一个唯一的ID
	 * @param  {String} fix [前缀]
	 * @return {Mix} 返回唯一的ID号
	 */
	var _guid = 1;
	util.guid = function(fix) {
		if (fix) {
			return '' + fix + (_guid++);
		}
		else {
			return _guid++;
		}
	}

	/**
	 * random 生成指定范围的随机整数(无范围返回时间戳)
	 * @param  {Number} begin  [开始]
	 * @param  {Number} end    [结束]
	 */
	util.random = function(begin, end) {
		var ret;
		if (arguments.length === 2) {
			ret = parseInt(Math.random() * (end - begin + 1) + begin, 10);
		}
		else {
			ret = +new Date();
		}
		return ret;
	}

	/**
	 * htmlEncode 将html标签转义
	 * @param  {String} html  [字符]
	 */
	util.htmlEncode = function(html) {
		var tag = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;'
		}
		function esc_rp(m) {
			return tag[m];
		}
		return (typeof(html) != 'string') ? html : html.replace(/[&<>']/g, esc_rp);
	}

	/**
	 * find 根据字段和值查找数组中的元素
	 * @param  {Array}   arr    [数组]
	 * @param  {Mix}     value  [查询值]
	 * @param  {String}  field  [对应的字段名]
	 */
	util.find = function(arr, value, field) {
		var ret = null;
		this.each(arr, function(item) {
			if (item[field] === value) {
				ret = item;
				return false;
			}
		});
		return ret;
	}

	/**
	 * parse 解析get请求参数
	 * @param   {Object}  param  [参数JSON]
	 * @return  {String}         [解析的字符创]
	 */
	util.parse = function(param) {
		var arr = [];
		for (var pro in param) {
			arr.push(pro + '=' + param[pro]);
		}
		return '?' + arr.join('&');
	},

	/**
	 * getClientHeight 获取页面可视区高度
	 */
	util.getClientHeight = function() {
		return document.compatMode === 'CSS1Compat' ? docElem.clientHeight : docBody.clientHeight;
	}

	/**
	 * getClientWidth 获取页面可视区宽度
	 */
	util.getClientWidth = function() {
		return document.compatMode === 'CSS1Compat' ? docElem.clientWidth : docBody.clientWidth;
	}

	/**
	 * getClient 获取页面可视区信息
	 */
	util.getClient = function() {
		return {
			'width': this.getClientWidth(),
			'height': this.getClientHeight()
		}
	}

	/**
	 * removeTags 去掉html标签
	 */
	util.removeTags = function(html) {
		return html.toString().replace(/<[^>]+>/g, '');
	}

	/**
	 * fixZero 自动补0, (9 , 1) -> 09; (9 , 3) -> 0009
	 * num: 原始数值 ; zeros: 补0个数
	 */
	util.fixZero = function(num, zeros) {
		var b, v, x = 10, y, ns = num.toString().length;
		if (!this.isNumber(zeros) || !this.isNumber(zeros)) {
			return num;
		}
		y = ns + zeros;
		b = Math.pow(x, y);
		v = b + num;
		return v.toString().substr(1);
	}

	/*
	 * 格式化某段时间, 返回与当前的时间差 2015-05-16 16:14:30
	 */
	util.prettyDate = function(dateStr) {
		if(!isString(dateStr)) {
			return dateStr
		}
		var date = new Date();
		// 分离年月日时分秒
		var dateArr = dateStr.split(new RegExp('[:| |-]', 'ig'));
		var year   = +dateArr[0],
			month  = +dateArr[1] - 1,
			day    = +dateArr[2],
			hour   = +dateArr[3],
			minute = +dateArr[4],
			second = +dateArr[5];
		// 时分补0
		hour = hour < 10 ? this.fixZero(hour, 1) : hour;
		minute = minute < 10 ? this.fixZero(minute, 1) : minute;
		// 计算秒数差值
		var opDate = new Date(year, month, day , hour, minute, second);
		var secondDiff = (new Date().getTime() - opDate.getTime()) / 1000;
		var retStr = '';
		if(secondDiff < 60) {
			retStr = T('刚刚');
		}
		if(!retStr && secondDiff < 60 * 30) {
			retStr = T('{1}分钟前', Math.ceil(secondDiff / 60));
		}
		if(!retStr && secondDiff < 1800) {
			retStr= T('半小时前');
		}
		if(!retStr && secondDiff < 3600) {
			retStr= T('1小时前');
		}
		if(!retStr && secondDiff < 3600 * 2) {
			retStr= T('2小时前');
		}
		if(!retStr && secondDiff < 3600 * 3) {
			retStr= T('3小时前');
		}
		if(!retStr && date.getFullYear() == year && date.getMonth() == month && date.getDate() == day) {
			retStr = T('今天') + hour + ':' + minute;
		}
		if(!retStr && date.getFullYear() == year && date.getMonth() == month && date.getDate() - 1 == day) {
			retStr = T('昨天') + hour + ':' + minute;
		}
		if(!retStr && date.getFullYear() == year && date.getMonth() == month && date.getDate() - 2 == day) {
			retStr = T('前天') + hour + ':' + minute;
		}
		if(!retStr && date.getFullYear() == year && date.getMonth() == month) {
			retStr = T('{1}月{2}日', month + 1, day);
		}
		if(!retStr && date.getFullYear() == year) {
			retStr = T('今年{1}月{2}日', month + 1, day);
		}
		if(!retStr && date.getFullYear() - 1 == year) {
			retStr = T('去年{1}月{2}日', month + 1, day);
		}
		if(!retStr && date.getFullYear() - year > 1) {
			retStr = T('{1}年{2}月{3}日', year, month + 1, day);
		}
		return retStr;
	}

	/*
	 * 模板替换
	 * eg. util.templateReplace('<a href="{1}">{2}</a>', 'http://www.tangbc.com', '小前端')
	 * =>  '<a href="http://www.tangbc.com">小前端</a>')
	 */
	var templateReplaceList;
	var templateReplaceRegx = /\%(\d+)|\{\d+\}/g;
	function _templateReplace(match) {
		if (match[1] > 0 && templateReplaceList[match[1]] !== UDF) {
			return templateReplaceList[match[1]];
		}
		else {
			return match[0];
		}
	}
	util.templateReplace = function(template /*, replaceN ... */) {
		templateReplaceList = arguments;
		return template.replace(templateReplaceRegx, _templateReplace);
	}
});