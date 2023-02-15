/*
* Flatpickr wrapper
* @version: 3.0.0 (Mon, 13 Jul 2021)
* @requires: flatpickr v4.6.9
* @author: HtmlStream
* @event-namespace: .HSCore.components.HSFlatpickr
* @license: Htmlstream Libraries (https://htmlstream.com/licenses)
* Copyright 2021 Htmlstream
*/

HSCore.components.HSFlatpickr = {
	collection: [],

	dataAttributeName: 'data-hs-flatpickr-options',

	defaults: {
		mode: 'single',
		dateFormat: 'd M Y',
		maxDate: false,
		locale: {
			firstDayOfWeek: 1,
			weekdays: {
				shorthand: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				longhand: []
			},
			rangeSeparator: ' - '
		},
		nextArrow: '<i class="bi-chevron-right flatpickr-custom-arrow"></i>',
		prevArrow: '<i class="bi-chevron-left flatpickr-custom-arrow"></i>',
		disableMobile: true
	},

	init: function (el, options, id) {
		const that = this;
		let elems;

		if (el instanceof HTMLElement) {
			elems = [el]
		} else if (el instanceof Object) {
			elems = el
		} else {
			elems = document.querySelectorAll(el)
		}

		for (let i = 0; i < elems.length; i += 1) {
			that.addToCollection(elems[i], options, id || elems[i].id)
		}

		if (!that.collection.length) {
			return false
		}

		// initialization calls
		that._init()
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
		})
	},

	_init: function () {
		const that = this;

		for (let i = 0; i < that.collection.length; i += 1) {
			let _$el;
			let _options;
			let flatpickrInput;

			if (that.collection[i].hasOwnProperty('$initializedEl')) {
				continue;
			}

			_$el = that.collection[i].$el;
			_options = that.collection[i].options;
			flatpickrInput = _$el;

			if (_options.appendTo) {
				_options.appendTo = document.querySelector(_options.appendTo);
			}

			if (!(flatpickrInput instanceof HTMLInputElement)) {
				flatpickrInput = _$el.querySelector('.flatpickr-input');
			}

			if (flatpickrInput) {
				_$el.style.width = `${flatpickrInput.value.length * 12}px`;
			}

			that.collection[i].$initializedEl = flatpickr(
				_$el,
				_options,
			)
		}
	}
}
