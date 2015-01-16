define(function( require, exports ){
	exports.onRun = function( data, view ) {
		var type = data.param == null ? 'archives' : 'article';

		if( type == 'archives' ) {
			data.dom = view.createArchive({
				'container': data.name
			});
		}
		else {
			data.dom = view.createArticle({
				'container': data.name,
				'pageid': data.param
			});
		}

		require.async('@modules/' + type, function( module ) {
			module['onMain']( data );
		});
	}
});