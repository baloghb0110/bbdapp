/*
* Custombox wrapper
* @Datatables: 2.0.0 (Mon, 25 Nov 2019)
* @requires: jQuery v3.0 or later, DataTables v1.10.20
* @author: HtmlStream
* @event-namespace: .HSCore.components.HSDatatables
* @license: Htmlstream Libraries (https://htmlstream.com/licenses)
* Copyright 2020 Htmlstream
*/

HSCore.components.HSDatatables = {
	collection: [],

	dataAttributeName: 'data-hs-datatables-options',

	defaults: {
		paging: true,
		info: {
			currentInterval: null,
			totalQty: null,
			divider: ' to '
		},

		isSelectable: false,
		isColumnsSearch: false,
		isColumnsSearchTheadAfter: false,

		pagination: null,
		paginationClasses: 'pagination datatable-custom-pagination',
		paginationLinksClasses: 'page-link',
		paginationItemsClasses: 'page-item',
		paginationPrevClasses: 'page-item',
		paginationPrevLinkClasses: 'page-link',
		paginationPrevLinkMarkup: '<span aria-hidden="true">Prev</span>',
		paginationNextClasses: 'page-item',
		paginationNextLinkClasses: 'page-link',
		paginationNextLinkMarkup: '<span aria-hidden="true">Next</span>',
		detailsInvoker: null,
		select: null
	},

	init (el, options, id) {
		const that = this
		let elems

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
			return false;
		}

		// initialization calls
		that._init()
	},

	addToCollection (item, options, id) {
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

	getItems () {
		const that = this;
		let newCollection = [];

		for (let i = 0; i < that.collection.length; i += 1) {
			newCollection.push(that.collection[i].$initializedEl);
		}

		return newCollection;
	},

	getItem (item) {
		if (typeof item === 'number') {
			return this.collection[item].$initializedEl;
		} else {
			return this.collection.find(el => {
				return el.id === item;
			}).$initializedEl;
		}
	},

	_init () {
		const that = this

		for (let i = 0; i < that.collection.length; i += 1) {
			let _options
			let _$el

			if (that.collection[i].hasOwnProperty('$initializedEl')) {
				continue;
			}

			_options = that.collection[i].options
			_$el = $(that.collection[i].$el)

			/* Start : Init */

			/* Start : Init */

			that.collection[i].$initializedEl = _$el.DataTable(_options);

			/* End : Init */

			/* Start : custom functionality implementation */

			var api = new $.fn.dataTable.Api(_$el),
				customDraw = function () {
					var info = api.page.info(),
						$initPagination = $('#' + api.context[0].nTable.id + '_paginate'),
						$initPaginationPrev = $initPagination.find('.paginate_button.previous'),
						$initPaginationNext = $initPagination.find('.paginate_button.next'),
						$initPaginationLink = $initPagination.find('.paginate_button:not(.previous):not(.next), .ellipsis');

					$initPaginationPrev.wrap('<span class="' + _options.paginationItemsClasses + '"></span>');
					$initPaginationPrev.addClass(_options.paginationPrevLinkClasses).html(_options.paginationPrevLinkMarkup);
					$initPaginationNext.wrap('<span class="' + _options.paginationItemsClasses + '"></span>');
					$initPaginationNext.addClass(_options.paginationNextLinkClasses).html(_options.paginationNextLinkMarkup);
					$initPaginationPrev.unwrap($initPaginationPrev.parent()).wrap('<li class="paginate_item ' + _options.paginationItemsClasses + '"></li>');
					if ($initPaginationPrev.hasClass('disabled')) {
						$initPaginationPrev.removeClass('disabled');
						$initPaginationPrev.parent().addClass('disabled');
					}
					$initPaginationNext.unwrap($initPaginationNext.parent()).wrap('<li class="paginate_item ' + _options.paginationItemsClasses + '"></li>');
					if ($initPaginationNext.hasClass('disabled')) {
						$initPaginationNext.removeClass('disabled');
						$initPaginationNext.parent().addClass('disabled');
					}
					$initPaginationLink.unwrap($initPaginationLink.parent());
					$initPaginationLink.each(function () {
						if ($(this).hasClass('current')) {
							$(this).removeClass('current');
							$(this).wrap('<li class="paginate_item ' + _options.paginationItemsClasses + ' active' + '"></li>');
						} else {
							$(this).wrap('<li class="paginate_item ' + _options.paginationItemsClasses + '"></li>');
						}
					});
					$initPaginationLink.addClass(_options.paginationLinksClasses);
					$initPagination.prepend('<ul id="' + api.context[0].nTable.id + '_pagination' + '" class="' + _options.paginationClasses + '"></ul>');
					$initPagination.find('.paginate_item').appendTo('#' + api.context[0].nTable.id + '_pagination');

					if (info.pages <= 1) {
						$('#' + _options.pagination).hide();
					} else {
						$('#' + _options.pagination).show();
					}

					if (_options.info.currentInterval) {
						$(_options.info.currentInterval).html((info.start + 1) + _options.info.divider + info.end);
					}

					if (_options.info.totalQty) {
						$(_options.info.totalQty).html(info.recordsDisplay);
					}

					if (_options.scrollY) {
						_$el.find($('.dataTables_scrollBody thead tr')).css({visibility:'hidden'});
					}
				}

			customDraw()

			that.collection[i].$initializedEl.on('draw', customDraw)

			// Custom pagination
			that.customPagination(_$el, that.collection[i].$initializedEl, _options)

			// Custom search
			that.customSearch(_$el, that.collection[i].$initializedEl, _options)

			// Custom columns search
			if (_options.isColumnsSearch) that.customColumnsSearch(_$el, that.collection[i].$initializedEl, _options)

			// Custom entries
			that.customEntries(_$el, that.collection[i].$initializedEl, _options)

			// Row checking
			if (_options.isSelectable) that.rowChecking(_$el)

			// Details
			that.details(_$el, _options.detailsInvoker, that.collection[i].$initializedEl)

			// Select All
			if (_options.select) that.select(_options.select, that.collection[i].$initializedEl)

			/* End : custom functionality implementation */

			/* End : Init */
		}
	},

	// ----- Start : Custom functionality -----

	customPagination: function (el, initEl, params) {
		var settings = params;

		$('#' + settings.pagination).append($('#' + initEl.context[0].nTable.id + '_paginate'));
	},

	customSearch: function (el, initEl, params) {
		var settings = params;

		$(settings.search).on('keyup', function (e) {
			initEl.search(this.value).draw()
		});

		$(settings.search).on('input', function (e) {
			if (!e.target.value) {
				initEl.search('').draw()
			}
		});
	},

	customColumnsSearch: function (el, initEl, params) {
		var settings = params;

		initEl.columns().every(function () {
			var that = this;

			if (settings.isColumnsSearchTheadAfter) {
				$('.dataTables_scrollFoot').insertAfter('.dataTables_scrollHead');
			}

			$('input', this.footer()).on('keyup change', function () {
				if (that.search() !== this.value) {
					that.search(this.value).draw();
				}
			});

			$('select', this.footer()).on('change', function () {
				if (that.search() !== this.value) {
					that.search(this.value).draw();
				}
			});
		});
	},

	customEntries: function (el, initEl, params) {
		var settings = params;

		$(settings.entries).on('change', function () {
			var val = $(this).val();

			initEl.page.len(val).draw();
		});
	},

	rowChecking: function (el) {
		$(el).on('change', 'input', function () {
			$(this).parents('tr').toggleClass('checked');
		});
	},

	format: function (value) {
		return value;
	},

	details: function (el, invoker, table) {
		if (!invoker) return;

		//Variables
		var $self = this;

		$(el).on('click', invoker, function () {
			var tr = $(this).closest('tr'),
				row = table.row(tr);

			if (row.child.isShown()) {
				row.child.hide();
				tr.removeClass('opened');
			} else {
				row.child($self.format(tr.data('details'))).show();
				tr.addClass('opened');
			}
		});
	},

	select: function (select, table) {
		$(select.classMap.checkAll).on('click', function () {
			if ($(this).is(':checked')) {
				table.rows().select();
				table.rows().nodes().each(function (el) {
					$(el).find(select.selector).prop('checked', true);
				});
			} else {
				table.rows().deselect();
				table.rows().nodes().each(function (el) {
					$(el).find(select.selector).prop('checked', false);
				});
			}
		});

		table.on('select', function () {
			$(select.classMap.counter).text(table.rows('.selected').data().length);

			if (table.rows().data().length !== table.rows('.selected').data().length) {
				$(select.classMap.checkAll).prop('checked', false);
			} else {
				$(select.classMap.checkAll).prop('checked', true);
			}

			if (table.rows('.selected').data().length === 0) {
				$(select.classMap.counterInfo).hide();
			} else {
				$(select.classMap.counterInfo).show();
			}
		}).on('deselect', function () {
			$(select.classMap.counter).text(table.rows('.selected').data().length);

			if (table.rows().data().length !== table.rows('.selected').data().length) {
				$(select.classMap.checkAll).prop('checked', false);
			} else {
				$(select.classMap.checkAll).prop('checked', true);
			}

			if (table.rows('.selected').data().length === 0) {
				$(select.classMap.counterInfo).hide();
			} else {
				$(select.classMap.counterInfo).show();
			}
		});
	}

	// ----- End : Custom functionality -----
}
