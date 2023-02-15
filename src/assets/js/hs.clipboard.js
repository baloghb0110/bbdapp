/*
* Clipboard wrapper
* @version: 2.0.0 (Sat, 30 Jul 2021)
* @author: HtmlStream
* @event-namespace: .HSCore.components.HSClipboard
* @license: Htmlstream Libraries (https://htmlstream.com/licenses)
* Copyright 2021 Htmlstream
*/

HSCore.components.HSClipboard = {
  collection: [],

  dataAttributeName: 'data-hs-clipboard-options',

  defaults: {
    type: null,
    contentTarget: null,
    classChangeTarget: null,
    defaultClass: null,
    successText: null,
    successClass: null,
    originalTitle: null
  },

  init(el, options = {}, id) {
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

  _init: function (el, settings) {
    const that = this

    for (let i = 0; i < that.collection.length; i += 1) {
      let _options
      let _$el

      if (that.collection[i].hasOwnProperty('$initializedEl')) {
        continue;
      }

      _options = that.collection[i].options
      _$el = that.collection[i].$el

      /* Start : Init */

      if (_options.contentTarget) that.setShortcodes(_$el, _options)

      if (_$el.closest('.modal')) {
        _options.container = _$el.closest('.modal')
      }

      that.collection[i].$initializedEl = new ClipboardJS(_$el, _options)

      if (_options.type === 'tooltip') {
        _options.instanceTooltip = bootstrap.Tooltip.getOrCreateInstance(_$el)
      } else if (_options.type === 'popover') {
        _options.instancePopover = new bootstrap.Popover(_$el)
      }

      const resetTitle = function () {
        _options.instanceTooltip.tip.style.display = 'none'
        _$el.setAttribute('data-bs-original-title', _options.title);
        _options.instanceTooltip.setContent()

        setTimeout(() => {
          _options.instanceTooltip.tip.style.display = 'block'
        }, 100)

        _$el.removeEventListener('mouseleave', resetTitle);
      }

      that.collection[i].$initializedEl.on('success', () => {
        if (!_options.successText && !_options.successClass) return;

        if (_options.successText) {
          if (_options.type === 'tooltip') {
            _$el.setAttribute('data-bs-original-title', _options.successText)
            _options.instanceTooltip.setContent()
            _options.instanceTooltip.show()


            // _$el.addEventListener('mouseleave', () => {
            //   // _options.instanceTooltip.tip.remove()
            //   // setTimeout(() => {
            //   _options.instanceTooltip.setContent()
            //     _$el.setAttribute('data-bs-original-title', _options.title);
            //     _options.instanceTooltip.setContent()
            //   //   _options.instanceTooltip.enable()
            //   // }, 200)
            // });

            _$el.addEventListener('mouseleave', resetTitle);
          } else if (_options.type === 'popover') {
            el.setAttribute('data-bs-original-title', _options.successText)
            _options.instancePopover.show()

            _$el.addEventListener('mouseleave', () => {
              _$el.setAttribute('data-bs-original-title', _options.title)
              _options.instancePopover.hide()
            });
          } else {
            _$el.lastChild.nodeValue = ' ' + _options.successText + ' ';

            setTimeout(function () {
              _$el.lastChild.nodeValue = _options.defaultText;
            }, 800);
          }
        }

        if (_options.successClass) {
          if (!_options.classChangeTarget) {
            _$el.classList.remove(_options.defaultClass)
            _$el.classList.add(_options.successClass);

            setTimeout(function () {
              _$el.classList.remove(_options.successClass)
              _$el.classList.add(_options.defaultClass)
            }, 800);
          } else {
            let $element = document.querySelector(_options.classChangeTarget)
            if (!$element) return
            $element.classList.remove(_options.defaultClass)
            $element.classList.add(_options.successClass);

            setTimeout(function () {
              $element.classList.remove(_options.successClass)
              $element.classList.add(_options.defaultClass)
            }, 800);
          }
        }

        if (_options.action === 'cut') {
          const $target = document.querySelector(_options.contentTarget)
          if ($target && $target.nodeName === ('TEXTAREA' || 'INPUT')) {
            $target.value = ''
          }
        }
      });

      /* End : Init */
    }
  },

  setShortcodes(el, params) {
    let settings = params,
      $element = document.querySelector(settings.contentTarget)

    if ($element.tagName === 'SELECT' || $element.tagName === 'INPUT' || $element.tagName === 'TEXTAREA') {
      settings.shortcodes[settings.contentTarget] = $element.value
    } else {
      settings.shortcodes[settings.contentTarget] = $element.outerHTML
    }
  },

  addToCollection(item, options, id) {
    options = Object.assign(
      {
        shortcodes: {},
      },
      this.defaults,
      item.hasAttribute(this.dataAttributeName)
        ? JSON.parse(item.getAttribute(this.dataAttributeName))
        : {},
      options
    ),
      this.collection.push({
        $el: item,
        id: id || null,
        options: Object.assign({}, options, {
          windowWidth: window.outerWidth,
          defaultText: item.lastChild.nodeValue,
          title: item.getAttribute('data-bs-original-title'),
          container: !!this.defaults.container ? document.querySelector(this.defaults.container) : false,
          text: (button) => {
            var dataSettings = JSON.parse(button.getAttribute('data-hs-clipboard-options'));
            return options.shortcodes[dataSettings.contentTarget];
          }
        })
      })
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
  }
}
