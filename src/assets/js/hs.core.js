/*
* HSCore
* @version: 4.1.0 (12 July, 2021)
* @author: HtmlStream
* @event-namespace: .HSCore
* @license: Htmlstream Libraries (https://htmlstream.com/licenses)
* Copyright 2021 Htmlstream
*/
'use strict';

const HSCore = {
	components: {},
	collection: {
		tooltips: [],
		popovers: [],
	},

	init: function () {
		const that = this;

		// Tooltips
		const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');

		for (let i = 0; i < tooltips.length; i += 1) {
			that.collection.tooltips.push(new bootstrap.Tooltip(tooltips[i]));
		}

		// Popovers
		const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');

		for (let i = 0; i < popovers.length; i += 1) {
			that.collection.popovers.push(new bootstrap.Popover(popovers[i]))
		}

		document.querySelectorAll('[data-bs-popover-dark]').forEach(function ($popover) {
			$popover.addEventListener('click', function(e) {
				const $popovers = document.querySelectorAll('.popover')
				if (!$popovers.length) return
				$popovers[$popovers.length - 1].classList.add('popover-dark')
			})
		})
	},

	getTooltips: function () {
		return this.collection.tooltips;
	},

	hideTooltips: function () {
		const tooltips = this.getTooltips();

		for (let i = 0; i < tooltips.length; i += 1) {
			tooltips[i].hide();
		}
	},

	getPopovers: function () {
		return this.collection.popovers;
	},

	hidePopovers: function () {
		const popovers = this.getPopovers();

		for (let i = 0; i < popovers.length; i += 1) {
			popovers[i].hide();
		}
	},

	disposePopovers: function () {
		const popovers = this.getPopovers();

		for (let i = 0; i < popovers.length; i += 1) {
			popovers[i].dispose();
		}
	},
}

HSCore.init()
