/*
* Tagify wrapper
* @version: 3.0.0 (Thu, 14 July 2021)
* @requires: Tagify v2.27.0
* @author: HtmlStream
* @event-namespace: .HSTagify
* @license: Htmlstream Libraries (https://htmlstream.com/licenses)
* Copyright 2021 Htmlstream
*/

HSCore.components.HSTagify = {
	collection: [],

	dataAttributeName: 'data-hs-tagify-options',

	defaults: {
		clearBtnSelector: null,
		hasManualList: false,
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

	getItem(item) {
		if (typeof item === 'number') {
			return this.collection[item].$initializedEl;
		} else {
			return this.collection.find(el => {
				return el.id === item;
			}).$initializedEl;
		}
	},

	_init: function () {
		const that = this;

		for (let i = 0; i < that.collection.length; i += 1) {
			let _options;
			let _$el;
			let $clearBtn;

			if (that.collection[i].hasOwnProperty('$initializedEl')) {
				continue;
			}

			_options = that.collection[i].options;
			_$el = that.collection[i].$el;

			that.collection[i].$initializedEl = new Tagify(
				_$el,
				_options
			);

			// Specific
			if (_options.clearBtnSelector) {
				$clearBtn = document.querySelector(_options.clearBtnSelector);
				$clearBtn.addEventListener('click', function () {
					that.collection[i].$initializedEl.removeAllTags.bind(that.collection[i].$initializedEl);
				});
			}

			if (_options.hasManualList) {
				that._renderSuggestionsList(_$el, that.collection[i].$initializedEl);

				that.collection[i].$initializedEl.on('add', function () {
					if (that.collection[i].$initializedEl.suggestedListItems.length === 1) {
						that.collection[i].$initializedEl.DOM.dropdown.innerHTML = '';
						that.collection[i].$initializedEl.styles.display = 'none';
					}
				});

				that.collection[i].$initializedEl.on('remove', function () {
					if (that.collection[i].$initializedEl.suggestedListItems.length === 0) {
						that.collection[i].$initializedEl.DOM.dropdown.styles.display = 'none';
					}
				})
			}
			//./
		}
	},

	_renderSuggestionsList: function (el, initEl) {
		initEl.dropdown.show.call(initEl);
		el.parentElement.appendChild(initEl.DOM.dropdown);
	},
};
