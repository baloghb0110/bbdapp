/*
* HSJsVectorMap Plugin
* @version: 3.0.0 (Mon, 02 July 2021)
* @requires: jsVectorMap v2.0.4
* @author: HtmlStream
* @event-namespace: .HSJsVectorMap
* @license: Htmlstream Libraries (https://htmlstream.com/)
* Copyright 2021 Htmlstream
*/

HSCore.components.HSJsVectorMap = {
	collection: [],

	dataAttributeName: 'data-hs-js-vector-map-options',

	defaults: {
		zoomOnScroll: false
	},

	init: function (el, options, id) {
		const that = this;
		let elems;

		if (el instanceof HTMLElement) {
			elems = [el];
		} else if (el instanceof Object) {
			elems = el;
		} else {
			elems = document.querySelectorAll(el);
		}

		for (let i = 0; i < elems.length; i += 1) {
			that.addToCollection(elems[i], options, id || elems[i].id);
		}

		if (!that.collection.length) {
			return false;
		}

		// initialization calls
		that._init();
		//./
	},

	addToCollection(item, options, id) {
		this.collection.push({
			$el: item,
			id: id || null,
			options: Object.assign(
				{},
				this.defaults,
				item.hasAttribute(this.dataAttributeName)
					? JSON.parse(item.getAttribute(this.dataAttributeName))
					: {},
				options,
			),
		});
	},

	getItems() {
		const that = this;
		let newCollection = [];

		for (let i = 0; i < that.collection.length; i += 1) {
			newCollection.push(that.collection[i].$initializedEl);
		}

		return newCollection;
	},

	getItem(ind) {
		return this.collection[ind].$initializedEl;
	},

	_init: function () {
		const that = this;

		for (let i = 0; i < that.collection.length; i += 1) {
			let _instance;

			if (that.collection[i].hasOwnProperty('$initializedEl')) {
				continue;
			}

			_instance = that.collection[i];

			// plugin specific
			const _options = Object.assign(
				{},
				{
					selector: _instance.$el,
				},
				_instance.options,
			);

			that.collection[i].$initializedEl = new jsVectorMap(_options);

			window.addEventListener('resize', () => {
				that.collection[i].$initializedEl.updateSize()
			})
		}
	},
};
