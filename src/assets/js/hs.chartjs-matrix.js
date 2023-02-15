/*
* Chart.js wrapper
* @version: 3.0.0 (Mon, 27 Jun 2021)
* @requires: Chart.js v2.8.0
* @author: HtmlStream
* @event-namespace: .HSCore.components.HSCharJS
* @license: Htmlstream Libraries (https://htmlstream.com/licenses)
* Copyright 2021 Htmlstream
*/

HSCore.components.HSChartMatrixJS = {
  dataAttributeName: 'data-hs-chartjs-options',
  defaults: {
    type: 'matrix',
    options: {
      animation: {
        duration: 0
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: false,
        tooltip: {
          enabled: false,
          mode: 'nearest'
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

  defaultThemeKey: 'default',

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


      that.backgroundColor(_options)
      that.legend(_options)
      that.tooltip()

      /* Start : Init */

      that.collection[i].$initializedEl = new Chart(_$el, _options)

      /* End : Init */
    }
  },
  // _options.options.matrixBackgroundColor
  backgroundColor(settings) {
    if (settings.options.hasOwnProperty('matrixBackgroundColord')) {
      settings.data.datasets.forEach(function(datasets) {
        datasets.backgroundColor = function(ctx) {
          var value = ctx.dataset.data[ctx.dataIndex].v;
          var additionToValue = settings.options.matrixBackgroundColord.hasOwnProperty('additionToValue') ? settings.options.matrixBackgroundColord.additionToValue : 5;
          var alpha = (additionToValue + value) / settings.options.matrixBackgroundColord.accent;

          if (value.toFixed() == 0 && settings.options.matrixBackgroundColord.hasOwnProperty('nullColor')) {
            return Chart.helpers.color(settings.options.matrixBackgroundColord.nullColor).rgbString();
          } else {
            return Chart.helpers.color(settings.options.matrixBackgroundColord.color).alpha(alpha).rgbString();
          }
        };
      })
    }
  },

  legend(settings) {
    if (settings.options.hasOwnProperty('matrixLegend')) {
      var min = settings.data.datasets[0].data[0].v;
      var max = settings.data.datasets[0].data[0].v;

      for (var i = 1; i < settings.data.datasets[0].data.length; i++) {
        if (settings.data.datasets[0].data[i].v < min) min = settings.data.datasets[0].data[i].v;
        if (settings.data.datasets[0].data[i].v > max) max = settings.data.datasets[0].data[i].v;
      }

      min = min.toFixed();
      max = max.toFixed();

      var html = [],
        stepSize = settings.options.matrixLegend.hasOwnProperty('stepSize') ? settings.options.matrixLegend.stepSize : (max / 10),
        additionToValue = settings.options.matrixBackgroundColord.hasOwnProperty('additionToValue') ? settings.options.matrixBackgroundColord.additionToValue : 5,
        $legendContainer = document.querySelector(settings.options.matrixLegend.container)

      $legendContainer.classList.add('hs-chartjs-matrix-legend')

      $legendContainer.insertAdjacentHTML('beforeend', `<li class="hs-chartjs-matrix-legend-min">${min}</li>`)

      for (var i = 0; i < max;) {
        var value = i;
        var alpha = (additionToValue + value) / settings.options.matrixBackgroundColord.accent;
        html.push('<li class="hs-chartjs-matrix-legend-item" style="background-color: ' + Chart.helpers.color(settings.options.matrixBackgroundColord.color).alpha(alpha).rgbString() + '"></li>');

        i = i + stepSize;
      }


      $legendContainer.insertAdjacentHTML('beforeend', html.join(''))

      if (settings.options.matrixLegend.metric && max > 100) {
        if (max < 1000000) {
          max = max / 1000 + 'k';
        } else {
          max = max / 1000000 + 'kk';
        }
      }

      $legendContainer.insertAdjacentHTML('beforeend', `<li class="hs-chartjs-matrix-legend-max">${max}</li>`)
    }
  },

  tooltip() {
    window.addEventListener('mousemove', function (e) {
      if (!e.target.closest('canvas')) {
        let $el = document.querySelector('.hs-chartjs-tooltip-matrix')
        if ($el) {
          $el.parentElement.removeChild($el)
        }
      }
    })
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
    settings.options = this._setTheme(settings.options, el.id || index)
    settings.options.plugins.tooltip.external = function (tooltipModel) {
      // Tooltip Element
      var tooltipEl = document.getElementById('chartjsTooltip');

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjsTooltip';
        tooltipEl.style.opacity = 0;
        tooltipEl.classList.add('hs-chartjs-tooltip-wrap');
        tooltipEl.classList.add('hs-chartjs-tooltip-matrix');
        tooltipEl.innerHTML = '<div class="hs-chartjs-tooltip"></div>';
        document.body.appendChild(tooltipEl);
      }

      // Hide if no tooltip
      if (settings.type !== 'matrix' && tooltipModel.tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;

        tooltipEl.remove()

        return;
      }

      // Set caret Position
      tooltipEl.classList.remove('above', 'below', 'no-transform');
      if (tooltipModel.tooltip.yAlign) {
        tooltipEl.classList.add(tooltipModel.tooltip.yAlign);
      } else {
        tooltipEl.classList.add('no-transform');
      }

      function getBody(bodyItem) {
        return bodyItem.lines;
      }

      // Set Text
      if (tooltipModel.tooltip.body) {
        var titleLines = tooltipModel.tooltip.title || [],
          bodyLines = tooltipModel.tooltip.body.map(getBody),
          today = new Date();

        var innerHtml = '<header class="hs-chartjs-tooltip-header">';

        titleLines.forEach(function (title) {
          innerHtml += title + ', ' + today.getFullYear();
        });

        innerHtml += '</header><div class="hs-chartjs-tooltip-body">';

        bodyLines.forEach(function (body, i) {
          innerHtml += '<div>'

          var oldBody = body[0],
            newBody = oldBody,
            color = tooltipModel.tooltip.labelColors[i].backgroundColor instanceof Object ? tooltipModel.tooltip.labelColors[i].borderColor : tooltipModel.tooltip.labelColors[i].backgroundColor;

          innerHtml += (settings.options.plugins.tooltip.hasIndicator ? '<span class="d-inline-block rounded-circle mr-1" style="width: ' + settings.options.plugins.tooltip.indicatorWidth + '; height: ' + settings.options.plugins.tooltip.indicatorHeight + '; background-color: ' + color + '"></span>' : '') + (oldBody.length > 3 ? newBody : body);

          innerHtml += '</div>'
        });

        innerHtml += '</div>';

        var tooltipRoot = tooltipEl.querySelector('.hs-chartjs-tooltip');
        tooltipRoot.innerHTML = innerHtml;
      }

      // `this` will be the overall tooltip
      var position = this._chart.canvas.getBoundingClientRect();

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.tooltip.caretX - (tooltipEl.offsetWidth / 2) - 3 + 'px';
      tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.tooltip.caretY - tooltipEl.offsetHeight - 25 + 'px';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.transition = settings.options.plugins.tooltip.transition;
    }

    return settings
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

    if (this.themes[index] && theme !== this.defaultThemeKey) {
      return mergeDeep(settings, this.themes[index][theme].options, true)
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

        subject.$initializedEl.update()
      }
    })
  },
}
