define(function(require, exports) {
	var app = require('app');

	exports.onRun = function(data, view) {

		var ev1, ev2, ev3;

		var blankDom = view.createBlank();

		var bottom = app.Container.extend({
			init: function(config) {
				config = app.cover(config, {
					'class': 'wraperBottom',
					'tag': 'p'
				});
				this.Super('init', arguments);
			},
			afterBuild: function() {
				var elm = this.getDOM();
				elm.html([
					'<span class="ml2">I am wraperBottom</span>',
					'<button class="ml1 wraperBottomBtn">destroy self</button>'
				].join(''));

				this.bind(elm.find('.wraperBottomBtn'), 'click', 'eventBtn');
			},
			onCast: function(msg) {
				console.log('onCast', msg);
			},
			onBottomFire: function(msg) {
				console.log('received in bottom', msg);
			},
			onWraperBroadcast: function(msg) {
				console.log('received in bottom', msg.param);
			},
			eventBtn: function() {
				this.destroy();
			}
		});

		var inner = app.Container.extend({
			init: function(config) {
				config = app.cover(config, {
					'class': 'wraperInner',
					'tag': 'p'
				});
				this.Super('init', arguments);
			},
			afterBuild: function() {
				var elm = this.getDOM();
				elm.html([
					'<span class="ml1">I am wraperInner</span>',
					'<button class="ml1 wraperInnerBtn">destroy child</button>'
				].join(''));

				var bt = this.create('wraperBottom', bottom, {
					'target': elm
				});

				this.bind(elm.find('.wraperInnerBtn'), 'click', 'eventBtn');
			},
			onBottomFire: function(msg) {
				console.log('received in inner', msg);
				// msg.returns = 'return at inner';
				// return false;
			},
			onCast: function(msg) {
				console.log('onCast', msg);
			},
			onWraperBroadcast: function(msg) {
				console.log('received in inner', msg.param);
			},
			eventBtn: function() {
				var chs = this.getChild('wraperBottom');
				if (chs) {
					chs.destroy();
				}
			}
		});

		var wraper = app.Container.extend({
			init: function(config) {
				config = app.cover(config, {
					'class': 'wraper'
				});
				this.Super('init', arguments);
			},
			afterBuild: function() {
				var elm = this.getDOM();
				elm.html([
					'I am wraper',
					'<button class="ml1 wraperBtn">destroy all child</button>'
				].join(''));

				var inn = this.create('wraperInner', inner, {
					'target': elm
				});

				app.ajax.get('/blog/sprint/api/showarticle/query.php', {'artid': 395}, 'onData', this);

				// this.broadcast('wraperBroadcast', 'I am wraper', 'out');

				this.bind(elm.find('.wraperBtn'), 'click', this.eventBtn);
			},
			onData: function() {
				console.log(arguments);
			},
			onBottomFire: function(msg) {
				console.log('received in wraper', msg);
				// msg.returns = 'return at wraper';
			},
			onCast: function(msg) {
				console.log('onCast', msg);
			},
			eventBtn: function(evt, elm) {
				this.destroy();
			}
		});

		app.core.globalCast('cast', 123);

		var bd = app.core.create('wraper', wraper, {
			'target': blankDom
		});

	}
});


