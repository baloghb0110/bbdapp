/*
* Chart.js wrapper
* @version: 3.0.0 (Mon, 25 Nov 2021)
* @requires: Chart.js v2.8.0
* @author: HtmlStream
* @event-namespace: .HSCore.components.HSCharJS
* @license: Htmlstream Libraries (https://htmlstream.com/licenses)
* Copyright 2021 Htmlstream
*/

HSCore.components.HSChartJS = {
	dataAttributeName: 'data-hs-chartjs-options',
	defaults: {
		defaultThemeKey: 'default',
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					enabled: false,
					mode: 'nearest',
					prefix: '',
					postfix: '',
					hasIndicator: false,
					indicatorWidth: '8px',
					indicatorHeight: '8px',
					transition: '0.2s',
					lineWithLineColor: null,
					yearStamp: true
				},
			},
			gradientPosition: {
				x0: 0,
				y0: 0,
				x1: 0,
				y1: 0,
			}
		}
	},

	collection: [],

	themes: {},

	init(el, options, id) {
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

		window.addEventListener('on-hs-appearance-change', e => this._updateTheme(e.detail))

		// initialization calls
		that._init()
	},

	addToCollection(item, options, id) {
		this.collection.push({
			$el: item,
			id: id || null,
			options: options || {},
			dataSettings: item.hasAttribute(this.dataAttributeName)
				? JSON.parse(item.getAttribute(this.dataAttributeName))
				: {}
		})
	},

	addTheme (item, themeKey, options) {
		const index = item

		if (!this.themes.hasOwnProperty(index)) {
			this.themes[index] = {
				[themeKey]: options
			}
		} else {
			this.themes[index][themeKey] = options
		}
	},

	getTheme(index, theme) {
		if (!this.themes[index] || !this.themes[index][theme])  {
			console.error(`The element '${index}' or theme '${theme}' was not found in the HSChartjs theme list.`)
		}

		return this.themes[index][theme]
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

	lineMode(el, settings) {
		if (settings.type === 'line') {
			settings.data.datasets.forEach(data => {

				/* Linear Gradient */
				if (Array.isArray(data.backgroundColor)) {
					var ctx = el.getContext("2d"),
						gradientStroke = ctx.createLinearGradient(settings.options.gradientPosition.x0, settings.options.gradientPosition.y0, settings.options.gradientPosition.x1, settings.options.gradientPosition.y1)

					for (let i = 0; i < data.backgroundColor.length; i++) {
						gradientStroke.addColorStop(i, data.backgroundColor[i])
					}

					data.backgroundColor = gradientStroke
					data.fill = true
				}
				/* End Linear Gradient */
			})
		}
	},

	extendChart(el, settings, newChartJS) {
		function getOffset(el) {
			let rect = el.getBoundingClientRect()

			return {
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
			}
		}

		if (settings.type === 'line' && settings.options.plugins.tooltip.lineMode) {
			var originalLineDraw = newChartJS.draw
			newChartJS.draw = function (ease) {
				originalLineDraw.call(this, ease)
				if (this.tooltip._active && this.tooltip._active.length) {
					let activePoint = this.tooltip._active[0],
						el = this.canvas,
						tooltipWrap = document.querySelector('.hs-chartjs-tooltip-wrap'),
						lineTooltip = document.querySelector("#chartjsTooltipLine"),
						offsetTop = settings.options.plugins.tooltip.lineWithLineTopOffset >= 0 ? settings.options.plugins.tooltip.lineWithLineTopOffset : 7,
						offsetBottom = settings.options.plugins.tooltip.lineWithLineBottomOffset >= 0 ? settings.options.plugins.tooltip.lineWithLineBottomOffset : 43,
						$tooltip = document.querySelector("#chartjsTooltip")

					if ($tooltip && !document.querySelector("#chartjsTooltip #chartjsTooltipLine")) {
						$tooltip.insertAdjacentHTML('beforeend', '<div id="chartjsTooltipLine"></div>')
					}

					if (!tooltipWrap) return

					tooltipWrap.style.top = `${el.clientHeight / 2 - tooltipWrap.clientHeight}px`

					if (lineTooltip) {
						lineTooltip.style.top = `${-(getOffset(tooltipWrap).top - getOffset(el).top) + offsetTop}px`
					}

					let $hsTooltip = document.querySelector('.hs-chartjs-tooltip')

					if (tooltipWrap.offsetLeft + tooltipWrap.clientWidth > (el.offsetLeft + el.clientWidth) - 100) {
						if (!$hsTooltip) return
						$hsTooltip.classList.remove('hs-chartjs-tooltip-right')
						$hsTooltip.classList.add('hs-chartjs-tooltip-left')
					} else {
						if (!$hsTooltip) return
						$hsTooltip.classList.add('hs-chartjs-tooltip-right')
						$hsTooltip.classList.remove('hs-chartjs-tooltip-left')
					}

					if (lineTooltip) {
						lineTooltip.style.position = "absolute"
						lineTooltip.style.width = "2px"
						lineTooltip.style.height = `${el.clientHeight - offsetBottom}px`
						lineTooltip.style.backgroundColor = settings.options.plugins.tooltip.lineWithLineColor
						lineTooltip.style.left = 0
						lineTooltip.style.transform = "translateX(-50%)"
						lineTooltip.style.zIndex = 0
						lineTooltip.style.transition = "100ms"
					}
				}
			}

			el.addEventListener('touchstart', () => {
				const tooltipEl = document.getElementById('chartjsTooltip')
				if (tooltipEl && tooltipEl.previousElementSibling !== el) {
					tooltipEl.remove()
				}
			})

			el.addEventListener('mouseleave', () => {
				let $el = document.querySelector('#lineTooltipChartJSStyles')
				if (!$el) return
				$el.setAttribute('media', 'max-width: 1px')
			})

			el.addEventListener('mouseenter', () => {
				let $el = document.querySelector('#lineTooltipChartJSStyles')
				if (!$el) return
				$el.removeAttribute('media')
			})

			el.addEventListener('mousemove', (evt) => {
				let $wrap = document.querySelector('.hs-chartjs-tooltip-wrap'),
					offset = getOffset(el)

				if (!$wrap) return
				if (evt.pageY - offset.top > $wrap.clientHeight / 2 && (evt.pageY - offset.top) + ($wrap.offsetHeight / 2) < el.clientHeight) {
					document.querySelector('.hs-chartjs-tooltip').style.top = `${((evt.pageY + $wrap.clientHeight / 2) - (offset.top + el.clientHeight / 2))}px`
				}
			})
		}
	},

	extendOptions(el, options, dataSettings, index) {
		const mergeDeep = (target, source, isMergingArrays = false) => {
			target = ((obj) => {
				let cloneObj;
				try {
					cloneObj = JSON.parse(JSON.stringify(obj));
				} catch (err) {
					// If the stringify fails due to circular reference, the merge defaults
					//   to a less-safe assignment that may still mutate elements in the target.
					// You can change this part to throw an error for a truly safe deep merge.
					cloneObj = Object.assign({}, obj);
				}
				return cloneObj;
			})(target);

			const isObject = (obj) => obj && typeof obj === "object";

			if (!isObject(target) || !isObject(source))
				return source;

			Object.keys(source).forEach(key => {
				const targetValue = target[key];
				const sourceValue = source[key];

				if (Array.isArray(targetValue) && Array.isArray(sourceValue))
					if (isMergingArrays) {
						target[key] = targetValue.map((x, i) => sourceValue.length <= i
							? x
							: mergeDeep(x, sourceValue[i], isMergingArrays));
						if (sourceValue.length > targetValue.length)
							target[key] = target[key].concat(sourceValue.slice(targetValue.length));
					} else {
						target[key] = targetValue.concat(sourceValue);
					}
				else if (isObject(targetValue) && isObject(sourceValue))
					target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue, isMergingArrays);
				else
					target[key] = sourceValue;
			});

			return target;
		}

		let settings = mergeDeep(this.defaults, mergeDeep(dataSettings, options, true), true)

		settings = this._setTheme(settings, el.id || index)

		var el = el
		const specSettings = mergeDeep(settings, (settings.type === 'line') ? ({
			options: {
				scales: {
					y: {
						ticks: {
							callback: (value, index, values) => {
								var metric = settings.options.scales.y.ticks.metric || '',
									prefix = settings.options.scales.y.ticks.prefix || '',
									postfix = settings.options.scales.y.ticks.postfix || ''


								if (metric && value > 100) {
									if (value < 1000000) {
										value = value / 1000 + 'k'
									} else {
										value = value / 1000000 + 'kk'
									}
								}

								if (prefix && postfix) {
									return prefix + value + postfix
								} else if (prefix) {
									return prefix + value
								} else if (postfix) {
									return value + postfix
								} else {
									return value
								}
							}
						}
					}
				},
				elements: {
					line: {
						borderWidth: 3
					},
					point: {
						pointStyle: 'circle',
						radius: 5,
						hoverRadius: 7,
						borderWidth: 3,
						hoverBorderWidth: 3,
						backgroundColor: '#ffffff',
						hoverBackgroundColor: '#ffffff'
					}
				}
			}
		}) : ((dataSettings.type === 'bar') ? ({
			options: {
				scales: {
					y: {
						ticks: {
							callback: (value, index, values) => {
								var metric = settings.options.scales.y.ticks.metric,
									prefix = settings.options.scales.y.ticks.prefix,
									postfix = settings.options.scales.y.ticks.postfix

								if (metric && value > 100) {
									if (value < 1000000) {
										value = value / 1000 + 'k'
									} else {
										value = value / 1000000 + 'kk'
									}
								}

								if (prefix && postfix) {
									return prefix + value + postfix
								} else if (prefix) {
									return prefix + value
								} else if (postfix) {
									return value + postfix
								} else {
									return value
								}
							}
						}
					}
				}
			}
		}) : ({})), true)

		if (!settings.options.plugins.tooltip) {
			return settings
		}

		return mergeDeep(settings, {
			options: {
				plugins: {
					tooltip: {
						external: function (tooltipModel) {
							// Tooltip Element
							var tooltipEl = document.getElementById('chartjsTooltip')

							// Create element on first render
							if (!tooltipEl) {
								tooltipEl = document.createElement('div')
								tooltipEl.id = 'chartjsTooltip'
								tooltipEl.style.opacity = 0
								tooltipEl.classList.add('hs-chartjs-tooltip-wrap')
								tooltipEl.innerHTML = '<div class="hs-chartjs-tooltip"></div>'

								if (this.options.lineMode) {
									el.closest('.chartjs-custom').appendChild(tooltipEl)
								} else {
									document.body.appendChild(tooltipEl)
								}
							}

							// Hide if no tooltip
							if (tooltipModel.tooltip.opacity === 0) {
								tooltipEl.style.opacity = 0

								tooltipEl.parentNode.removeChild(tooltipEl)

								return
							}

							// Set caret Position
							tooltipEl.classList.remove('above', 'below', 'no-transform')
							if (tooltipModel.tooltip.yAlign) {
								tooltipEl.classList.add(tooltipModel.tooltip.yAlign)
							} else {
								tooltipEl.classList.add('no-transform')
							}

							function getBody(bodyItem) {
								return bodyItem.lines
							}

							// Set Text
							if (tooltipModel.tooltip.body) {
								var titleLines = tooltipModel.tooltip.title || [],
									bodyLines = tooltipModel.tooltip.body.map(getBody),
									today = new Date()

								var innerHtml = '<header class="hs-chartjs-tooltip-header">'

								titleLines.forEach(title => {
									innerHtml += this.options.yearStamp ? title + ', ' + today.getFullYear() : title
								})

								innerHtml += '</header><div class="hs-chartjs-tooltip-body">'

								bodyLines.forEach((body, i) => {
									innerHtml += '<div>'

									var oldBody = body[0],
										newBody = oldBody,
										color = tooltipModel.tooltip.labelColors[i].backgroundColor instanceof Object ? tooltipModel.tooltip.labelColors[i].borderColor : tooltipModel.tooltip.labelColors[i].backgroundColor

									innerHtml += (this.options.hasIndicator ? '<span class="d-inline-block rounded-circle me-1" style="width: ' + this.options.indicatorWidth + '; height: ' + this.options.indicatorHeight + '; background-color: ' + color + '"></span>' : '') + this.options.prefix + (oldBody.length > 3 ? newBody : body) + this.options.postfix

									innerHtml += '</div>'
								})

								innerHtml += '</div>'

								var tooltipRoot = tooltipEl.querySelector('.hs-chartjs-tooltip')
								tooltipRoot.innerHTML = innerHtml
							}

							// `this` will be the overall tooltip
							var position = this._chart.canvas.getBoundingClientRect()

							// Display, position, and set styles for font
							tooltipEl.style.opacity = 1
							if (this.options.lineMode) {
								tooltipEl.style.left = tooltipModel.tooltip.caretX + 'px'
							} else {
								tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.tooltip.caretX - (tooltipEl.offsetWidth / 2) - 3 + 'px'
							}

							if (!this.options.lineMode) {
								tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.tooltip.caretY - tooltipEl.offsetHeight - 25 + 'px'
							}
							tooltipEl.style.pointerEvents = 'none'
							tooltipEl.style.transition = this.options.transition
						}
					}
				}
			}
		}, true)
	},

	destroy (item) {
		let subject = this._getSubject(item)

		if (subject) {
			subject.$initializedEl.destroy()
			const newElement = subject.$el.cloneNode(true)
			subject.$el.parentNode.replaceChild(newElement, subject.$el)
			if (typeof item === 'number') {
				this.collection.splice(item, 1);
			} else {
				const index = this.collection.findIndex(el => {
					return el.id === item
				})
				this.collection.splice(index, 1)
			}
		}
	},

	_getSubject (item) {
		let subject = null
		if (typeof item === 'number') {
			subject = this.collection[item];
		} else {
			subject = this.collection.find(el => {
				return el.id === item;
			})
		}

		return subject
	},

	_setTheme (settings, index) {
		const mergeDeep = (target, source, isMergingArrays = false) => {
			target = ((obj) => {
				let cloneObj;
				try {
					cloneObj = JSON.parse(JSON.stringify(obj));
				} catch (err) {
					// If the stringify fails due to circular reference, the merge defaults
					//   to a less-safe assignment that may still mutate elements in the target.
					// You can change this part to throw an error for a truly safe deep merge.
					cloneObj = Object.assign({}, obj);
				}
				return cloneObj;
			})(target);

			const isObject = (obj) => obj && typeof obj === "object";

			if (!isObject(target) || !isObject(source))
				return source;

			Object.keys(source).forEach(key => {
				const targetValue = target[key];
				const sourceValue = source[key];

				if (Array.isArray(targetValue) && Array.isArray(sourceValue))
					if (isMergingArrays) {
						target[key] = targetValue.map((x, i) => sourceValue.length <= i
							? x
							: mergeDeep(x, sourceValue[i], isMergingArrays));
						if (sourceValue.length > targetValue.length)
							target[key] = target[key].concat(sourceValue.slice(targetValue.length));
					} else {
						target[key] = targetValue.concat(sourceValue);
					}
				else if (isObject(targetValue) && isObject(sourceValue))
					target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue, isMergingArrays);
				else
					target[key] = sourceValue;
			});

			return target;
		}

		let theme = localStorage.getItem('hs_theme') || window.hs_config.themeAppearance.layoutSkin

		if (theme === 'auto') {
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'
		}

		if (this.themes[index] && theme !== settings.defaultThemeKey) {
			return mergeDeep(settings, this.themes[index][theme], true)
		}

		return settings
	},

	_updateTheme (theme) {
		Object.keys(this.themes).forEach(index => {
			let subjectIndex = this.collection.findIndex(item => item.id === index)
			subjectIndex = subjectIndex < 0 ? index : subjectIndex
			const subject = this.collection[subjectIndex]

			if (subject) {
				let _options = this.extendOptions(subject.$el, subject.options, subject.dataSettings, index)

				subject.$initializedEl.data = _options.data
				subject.$initializedEl.options = _options.options

				this.lineMode(subject.$el, _options)
				subject.$initializedEl.update()
			}
		})
	},

	_init: function (el, options) {
		const that = this

		for (let i = 0; i < that.collection.length; i += 1) {
			let _options
			let _$el


			if (that.collection[i].hasOwnProperty('$initializedEl')) {
				continue;
			}

			_$el = that.collection[i].$el
			_options = that.extendOptions(_$el, that.collection[i].options, that.collection[i].dataSettings, i)


			/* Start : Init */

			that.lineMode(_$el, _options)
			that.collection[i].$initializedEl = new Chart(_$el, _options)
			that.extendChart(_$el, _options, that.collection[i].$initializedEl)

			/* End : Init */
		}
	},
}
