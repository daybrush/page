/*
Copyright (c) 2018 Daybrush
name: @daybrush/page
license: MIT
author: Daybrush
repository: https://github.com/daybrush/page.git
version: 0.1.1
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@egjs/component'), require('@daybrush/utils')) :
    typeof define === 'function' && define.amd ? define(['@egjs/component', '@daybrush/utils'], factory) :
    (global = global || self, global.Page = factory(global.eg.Component, global.utils));
}(this, function (Component, utils) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics(d, b);
    };

    function __extends(d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var width = 0;
    var height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    /**
     * You can check the page in and out of the screen.
     * @extends eg.Component
     * @sort 1
     * @example
    const page = new Page(".page1", {
      range: ["0%", "100%"],
      margin: [0, 0],
      // Registers events automatically.
      events: ["resize", "scroll"]
    });
     */

    var Page =
    /*#__PURE__*/
    function (_super) {
      __extends(Page, _super);
      /**
       */


      function Page(el, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.ranges = {};
        _this._range = [0, "100%"];
        _this.margin = [0, 0];
        _this.pages = [];
        _this.state = {
          enter: false,
          firstEnter: false,
          firstExit: false
        };
        /**
         * @method
         */

        _this.scroll = function () {
          _this.onCheck();
        };
        /**
         * @method
         */


        _this.resize = function () {
          _this.onCheck();
        };

        _this.el = el ? utils.isObject(el) ? el : utils.$(el) : null;

        if ("range" in options) {
          _this._range = options.range;
        }

        if ("margin" in options) {
          var margin = options.margin;

          if (utils.isArray(margin)) {
            _this.margin = margin;
          } else {
            _this.margin = [margin, margin];
          }
        }

        if ("events" in options) {
          options.events.forEach(function (name) {
            if (name === "resize") {
              window.addEventListener("resize", _this.resize);
            } else if (name === "scroll") {
              window.addEventListener("scroll", _this.scroll);
            } else {
              _this.el && _this.el.addEventListener(name, _this.scroll);
            }
          });
        }

        return _this;
      }
      /**
       */


      var __proto = Page.prototype;

      __proto.add = function (page) {
        this.pages.push(page);
        return this;
      };
      /**
       */


      __proto.range = function (range) {
        if (range === void 0) {
          range = [0, "100%"];
        }

        var rangeArr = utils.isArray(range) ? range : [range, range];
        var id = "[" + rangeArr.join(",") + "]";

        if (this.ranges[id]) {
          return this.ranges[id];
        }

        var page = new Page(this.el, {
          range: rangeArr
        });
        this.ranges[id] = page;
        this.add(page);
        return page;
      };

      __proto.triggerEvent = function (name) {
        this.trigger(name, {
          target: this.el
        });
      };

      __proto.onEnter = function (rect) {
        var _this = this;

        var state = this.state;

        if (!state.enter) {
          state.enter = true;

          if (!state.firstEnter) {
            state.firstEnter = true;
            /**
             * An event that occurs when you first enter a page.
             * @param {Page.EventParameter} event - Event object
             * @event Page#firstEnter
             */

            this.triggerEvent("firstEnter");
          }
          /**
           * An event that occurs when you enter a page.
           * @param {Page.EventParameter} event - Event object
           * @event Page#enter
           */


          this.triggerEvent("enter");
        }

        this.pages.forEach(function (page) {
          page.onCheck(page.el === _this.el ? rect : undefined);
        });
      };

      __proto.onExit = function () {
        var state = this.state;

        if (state.enter) {
          state.enter = false;

          if (!state.firstExit) {
            state.firstExit = true;
            /**
             * An event that occurs when you first exit a page.
             * @param {Page.EventParameter} event - Event object
             * @event Page#firstExit
             */

            this.triggerEvent("firstExit");
          }
          /**
           * An event that occurs when you exit a page.
           * @param {Page.EventParameter} event - Event object
           * @event Page#exit
           */


          this.triggerEvent("exit");
        }

        this.pages.forEach(function (page) {
          page.onExit();
        });
      };

      __proto.calcSize = function (size, rect) {
        if (typeof size === "number") {
          return size;
        }

        var sizeInfos = utils.splitSpace(size);

        if (!sizeInfos) {
          return 0;
        }

        var length = sizeInfos.length;
        var stack = [];
        var sign = 1;

        for (var i = 0; i < length; ++i) {
          var v = sizeInfos[i];

          if (v === "+") {
            sign = 1;
          } else if (v === "-") {
            sign = -1;
          } else if (v === "*") {
            stack.push((stack.pop() || 0) * this._calcSize(sizeInfos[i + 1], rect));
            ++i;
          } else if (v === "/") {
            stack.push((stack.pop() || 0) / this._calcSize(sizeInfos[i + 1], rect));
            ++i;
          } else {
            stack.push(sign * this._calcSize(v, rect));
            sign = 1;
          }
        }

        return stack.reduce(function (prev, cur) {
          return prev + cur;
        }, 0);
      };
      /**
       */


      __proto.getRect = function (isAbsolute) {
        var rect = this.el ? this.el.getBoundingClientRect() : undefined;

        if (!rect) {
          return;
        }

        var top = rect.top + (isAbsolute ? document.body.scrollTop || document.documentElement.scrollTop : 0);
        var height$$1 = rect.height;
        return {
          top: top,
          height: height$$1
        };
      };

      __proto.onCheck = function (rect) {
        if (rect === void 0) {
          rect = this.getRect();
        }

        if (rect) {
          var top = rect.top;
          var rangeStart = this.calcSize(this._range[0], rect);
          var rangeEnd = this.calcSize(this._range[1], rect);
          var marginTop = this.calcSize(this.margin[0], rect);
          var marginBottom = this.calcSize(this.margin[1], rect);

          if (top + rangeEnd + marginBottom <= 0 || top + rangeStart - marginTop >= height) {
            this.onExit();
          } else {
            this.onEnter(rect);
          }
        } else {
          this.pages.forEach(function (page) {
            page.onCheck();
          });
        }
      };

      __proto._calcSize = function (size, rect) {
        if (!size) {
          return 0;
        }

        if (typeof size === "number") {
          return size;
        }

        if (size === "window") {
          return height;
        }

        if (size.indexOf("(") > -1) {
          return this.calcSize(utils.splitBracket(size).value, rect);
        }

        var info = utils.splitUnit(size);

        if (info.unit === "%") {
          return rect.height * info.value / 100;
        } else {
          return info.value;
        }
      };

      return Page;
    }(Component);

    /**
     * @sort 2
     * @example
    import Page from "@daybrush/page";

    const pages = new Page.s({
      events: ["scroll", "resize"];
    });

    pages.add(new Page(".page1"));

    pages.scroll();
     */

    var Pages =
    /*#__PURE__*/
    function (_super) {
      __extends(Pages, _super);
      /**
       */


      function Pages(options) {
        if (options === void 0) {
          options = {};
        }

        return _super.call(this, undefined, options) || this;
      }

      return Pages;
    }(Page);

    Page.s = Pages;

    return Page;

}));
//# sourceMappingURL=page.main.js.map
