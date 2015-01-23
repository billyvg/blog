define(function( require, exports ){
	exports.onRun = function( data, view ) {
		// 创建主页
		data.dom = view.createIndex({
			'container': data.name
		});

		require.async('@pages/index', function( module ) {
			module['onMain']( data );
		});
	}
});