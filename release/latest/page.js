/*
Copyright (c) 2018 Daybrush
name: @daybrush/page
license: MIT
author: Daybrush
repository: https://github.com/daybrush/page.git
version: 0.0.1
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Page = factory());
}(this, function () { 'use strict';

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

    /*
    Copyright (c) 2017 NAVER Corp.
    @egjs/component project is licensed under the MIT license

    @egjs/component JavaScript library
    https://naver.github.io/egjs-component

    @version 2.1.2
    */

    /**
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    function isUndefined(value) {
      return typeof value === "undefined";
    }
    /**
     * A class used to manage events in a component
     * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
     * @alias eg.Component
     */


    var Component =
    /*#__PURE__*/
    function () {
      var Component =
      /*#__PURE__*/
      function () {
        /**
        * Version info string
        * @ko 버전정보 문자열
        * @name VERSION
        * @static
        * @type {String}
        * @example
        * eg.Component.VERSION;  // ex) 2.0.0
        * @memberof eg.Component
        */

        /**
         * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
         */
        function Component() {
          this._eventHandler = {};
          this.options = {};
        }
        /**
         * Triggers a custom event.
         * @ko 커스텀 이벤트를 발생시킨다
         * @param {String} eventName The name of the custom event to be triggered <ko>발생할 커스텀 이벤트의 이름</ko>
         * @param {Object} customEvent Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
         * @return {Boolean} Indicates whether the event has occurred. If the stop() method is called by a custom event handler, it will return false and prevent the event from occurring. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">Ref</a> <ko>이벤트 발생 여부. 커스텀 이벤트 핸들러에서 stop() 메서드를 호출하면 'false'를 반환하고 이벤트 발생을 중단한다. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">참고</a></ko>
         * @example
        class Some extends eg.Component {
         some(){
         	if(this.trigger("beforeHi")){ // When event call to stop return false.
        	this.trigger("hi");// fire hi event.
         	}
         }
        }
        const some = new Some();
        some.on("beforeHi", (e) => {
        if(condition){
        	e.stop(); // When event call to stop, `hi` event not call.
        }
        });
        some.on("hi", (e) => {
        // `currentTarget` is component instance.
        console.log(some === e.currentTarget); // true
        });
        // If you want to more know event design. You can see article.
        // https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F
         */


        var _proto = Component.prototype;

        _proto.trigger = function trigger(eventName, customEvent) {
          if (customEvent === void 0) {
            customEvent = {};
          }

          var handlerList = this._eventHandler[eventName] || [];
          var hasHandlerList = handlerList.length > 0;

          if (!hasHandlerList) {
            return true;
          } // If detach method call in handler in first time then handler list calls.


          handlerList = handlerList.concat();
          customEvent.eventType = eventName;
          var isCanceled = false;
          var arg = [customEvent];
          var i = 0;

          customEvent.stop = function () {
            isCanceled = true;
          };

          customEvent.currentTarget = this;

          for (var _len = arguments.length, restParam = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            restParam[_key - 2] = arguments[_key];
          }

          if (restParam.length >= 1) {
            arg = arg.concat(restParam);
          }

          for (i = 0; handlerList[i]; i++) {
            handlerList[i].apply(this, arg);
          }

          return !isCanceled;
        };
        /**
         * Executed event just one time.
         * @ko 이벤트가 한번만 실행된다.
         * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
         * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           alert("hi");
         }
         thing() {
           this.once("hi", this.hi);
         }
        }
        var some = new Some();
        some.thing();
        some.trigger("hi");
        // fire alert("hi");
        some.trigger("hi");
        // Nothing happens
         */


        _proto.once = function once(eventName, handlerToAttach) {
          if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
            var eventHash = eventName;
            var i;

            for (i in eventHash) {
              this.once(i, eventHash[i]);
            }

            return this;
          } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
            var self = this;
            this.on(eventName, function listener() {
              for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                arg[_key2] = arguments[_key2];
              }

              handlerToAttach.apply(self, arg);
              self.off(eventName, listener);
            });
          }

          return this;
        };
        /**
         * Checks whether an event has been attached to a component.
         * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
         * @param {String} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
         * @return {Boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
         * @example
        class Some extends eg.Component {
         some() {
           this.hasOn("hi");// check hi event.
         }
        }
         */


        _proto.hasOn = function hasOn(eventName) {
          return !!this._eventHandler[eventName];
        };
        /**
         * Attaches an event to a component.
         * @ko 컴포넌트에 이벤트를 등록한다.
         * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
         * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           console.log("hi");
         }
         some() {
           this.on("hi",this.hi); //attach event
         }
        }
        */


        _proto.on = function on(eventName, handlerToAttach) {
          if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
            var eventHash = eventName;
            var name;

            for (name in eventHash) {
              this.on(name, eventHash[name]);
            }

            return this;
          } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
            var handlerList = this._eventHandler[eventName];

            if (isUndefined(handlerList)) {
              this._eventHandler[eventName] = [];
              handlerList = this._eventHandler[eventName];
            }

            handlerList.push(handlerToAttach);
          }

          return this;
        };
        /**
         * Detaches an event from the component.
         * @ko 컴포넌트에 등록된 이벤트를 해제한다
         * @param {eventName} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
         * @param {Function} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           console.log("hi");
         }
         some() {
           this.off("hi",this.hi); //detach event
         }
        }
         */


        _proto.off = function off(eventName, handlerToDetach) {
          // All event detach.
          if (isUndefined(eventName)) {
            this._eventHandler = {};
            return this;
          } // All handler of specific event detach.


          if (isUndefined(handlerToDetach)) {
            if (typeof eventName === "string") {
              this._eventHandler[eventName] = undefined;
              return this;
            } else {
              var eventHash = eventName;
              var name;

              for (name in eventHash) {
                this.off(name, eventHash[name]);
              }

              return this;
            }
          } // The handler of specific event detach.


          var handlerList = this._eventHandler[eventName];

          if (handlerList) {
            var k;
            var handlerFunction;

            for (k = 0; (handlerFunction = handlerList[k]) !== undefined; k++) {
              if (handlerFunction === handlerToDetach) {
                handlerList = handlerList.splice(k, 1);
                break;
              }
            }
          }

          return this;
        };

        return Component;
      }();

      Component.VERSION = "2.1.2";
      return Component;
    }();

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.5.2
    */
    /**
    * get string "object"
    * @memberof Consts
    * @example
    import {OBJECT} from "@daybrush/utils";

    console.log(OBJECT); // "object"
    */

    var OBJECT = "object";
    /**
    * get string "undefined"
    * @memberof Consts
    * @example
    import {UNDEFINED} from "@daybrush/utils";

    console.log(UNDEFINED); // "undefined"
    */

    var UNDEFINED = "undefined";
    /**
    * Check whether the environment is window or node.js.
    * @memberof Consts
    * @example
    import {IS_WINDOW} from "@daybrush/utils";

    console.log(IS_WINDOW); // false in node.js
    console.log(IS_WINDOW); // true in browser
    */

    var IS_WINDOW = typeof window !== UNDEFINED;
    /**
    * Check whether the environment is window or node.js.
    * @memberof Consts
    * @name document
    * @example
    import {IS_WINDOW} from "@daybrush/utils";

    console.log(IS_WINDOW); // false in node.js
    console.log(IS_WINDOW); // true in browser
    */

    var doc = typeof document !== UNDEFINED && document;
    var prefixes = ["webkit", "ms", "moz", "o"];
    /**
     * @namespace CrossBrowser
     */

    /**
    * Get a CSS property with a vendor prefix that supports cross browser.
    * @function
    * @param {string} property - A CSS property
    * @return {string} CSS property with cross-browser vendor prefix
    * @memberof CrossBrowser
    * @example
    import {getCrossBrowserProperty} from "@daybrush/utils";

    console.log(getCrossBrowserProperty("transform")); // "transform", "-ms-transform", "-webkit-transform"
    console.log(getCrossBrowserProperty("filter")); // "filter", "-webkit-filter"
    */

    var getCrossBrowserProperty =
    /*#__PURE__*/
    function (property) {
      if (!doc) {
        return "";
      }

      var styles = (doc.body || doc.documentElement).style;
      var length = prefixes.length;

      if (typeof styles[property] !== UNDEFINED) {
        return property;
      }

      for (var i = 0; i < length; ++i) {
        var name = "-" + prefixes[i] + "-" + property;

        if (typeof styles[name] !== UNDEFINED) {
          return name;
        }
      }

      return "";
    };
    /**
    * get string "transfrom" with the vendor prefix.
    * @memberof CrossBrowser
    * @example
    import {TRANSFORM} from "@daybrush/utils";

    console.log(TRANSFORM); // "transform", "-ms-transform", "-webkit-transform"
    */


    var TRANSFORM =
    /*#__PURE__*/
    getCrossBrowserProperty("transform");
    /**
    * get string "filter" with the vendor prefix.
    * @memberof CrossBrowser
    * @example
    import {FILTER} from "@daybrush/utils";

    console.log(FILTER); // "filter", "-ms-filter", "-webkit-filter"
    */

    var FILTER =
    /*#__PURE__*/
    getCrossBrowserProperty("filter");
    /**
    * get string "animation" with the vendor prefix.
    * @memberof CrossBrowser
    * @example
    import {ANIMATION} from "@daybrush/utils";

    console.log(ANIMATION); // "animation", "-ms-animation", "-webkit-animation"
    */

    var ANIMATION =
    /*#__PURE__*/
    getCrossBrowserProperty("animation");
    /**
    * get string "keyframes" with the vendor prefix.
    * @memberof CrossBrowser
    * @example
    import {KEYFRAMES} from "@daybrush/utils";

    console.log(KEYFRAMES); // "keyframes", "-ms-keyframes", "-webkit-keyframes"
    */

    var KEYFRAMES =
    /*#__PURE__*/
    ANIMATION.replace("animation", "keyframes");
    /**
    * Check the type that the value is object.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isObject} from "@daybrush/utils";

    console.log(isObject({})); // true
    console.log(isObject(undefined)); // false
    console.log(isObject("")); // false
    console.log(isObject(null)); // false
    */


    function isObject(value) {
      return value && typeof value === OBJECT;
    }
    /**
    * Check the type that the value is isArray.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isArray} from "@daybrush/utils";

    console.log(isArray([])); // true
    console.log(isArray({})); // false
    console.log(isArray(undefined)); // false
    console.log(isArray(null)); // false
    */


    function isArray(value) {
      return Array.isArray(value);
    }
    /**
    * divide text by space.
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {Array} divided texts
    * @example
    import {spliceSpace} from "@daybrush/utils";

    console.log(splitSpace("a b c d e f g"));
    // ["a", "b", "c", "d", "e", "f", "g"]
    console.log(splitSpace("'a,b' c 'd,e' f g"));
    // ["'a,b'", "c", "'d,e'", "f", "g"]
    */


    function splitSpace(text) {
      // divide comma(,)
      var matches = text.match(/("[^"]*")|('[^']*')|([^\s()]*(?:\((?:[^()]*|\([^()]*\))*\))[^\s()]*)|\S+/g);
      return matches || [];
    }
    /**
    * divide text by bracket "(", ")".
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {object} divided texts
    * @example
    import {splitBracket} from "@daybrush/utils";

    console.log(splitBracket("a(1, 2)"));
    // {prefix: "a", value: "1, 2", suffix: ""}
    console.log(splitBracket("a(1, 2)b"));
    // {prefix: "a", value: "1, 2", suffix: "b"}
    */


    function splitBracket(text) {
      var matches = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(text);

      if (!matches || matches.length < 4) {
        return {};
      } else {
        return {
          prefix: matches[1],
          value: matches[2],
          suffix: matches[3]
        };
      }
    }
    /**
    * divide text by number and unit.
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {} divided texts
    * @example
    import {splitUnit} from "@daybrush/utils";

    console.log(splitUnit("10px"));
    // {prefix: "", value: 10, unit: "px"}
    console.log(splitUnit("-10px"));
    // {prefix: "", value: -10, unit: "px"}
    console.log(splitUnit("a10%"));
    // {prefix: "a", value: 10, unit: "%"}
    */


    function splitUnit(text) {
      var matches = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(text);

      if (!matches) {
        return {
          prefix: "",
          unit: "",
          value: NaN
        };
      }

      var prefix = matches[1];
      var value = matches[2];
      var unit = matches[3];
      return {
        prefix: prefix,
        unit: unit,
        value: parseFloat(value)
      };
    }
    /**
    * Date.now() method
    * @memberof CrossBrowser
    * @return {number} milliseconds
    * @example
    import {now} from "@daybrush/utils";

    console.log(now()); // 12121324241(milliseconds)
    */


    function now() {
      return Date.now ? Date.now() : new Date().getTime();
    }
    /**
    * window.requestAnimationFrame() method with cross browser.
    * @function
    * @memberof CrossBrowser
    * @param {FrameRequestCallback} callback - The function to call when it's time to update your animation for the next repaint.
    * @return {number} id
    * @example
    import {requestAnimationFrame} from "@daybrush/utils";

    requestAnimationFrame((timestamp) => {
      console.log(timestamp);
    });
    */


    var requestAnimationFrame =
    /*#__PURE__*/
    function () {
      var firstTime = now();
      var raf = IS_WINDOW && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame);
      return raf ? raf.bind(window) : function (callback) {
        var currTime = now();
        var id = window.setTimeout(function () {
          callback(currTime - firstTime);
        }, 1000 / 60);
        return id;
      };
    }();
    /**
     * Returns all element descendants of node that
     * match selectors.
     */

    /**
     * Checks if the specified class value exists in the element's class attribute.
     * @memberof DOM
     * @param - A DOMString containing one or more selectors to match
     * @param - If multi is true, a DOMString containing one or more selectors to match against.
     * @example
    import {$} from "@daybrush/utils";

    console.log($("div")); // div element
    console.log($("div", true)); // [div, div] elements
    */


    function $(selectors, multi) {
      return multi ? doc.querySelectorAll(selectors) : doc.querySelector(selectors);
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

        _this.el = el ? isObject(el) ? el : $(el) : null;

        if ("range" in options) {
          _this._range = options.range;
        }

        if ("margin" in options) {
          var margin = options.margin;

          if (isArray(margin)) {
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

        var rangeArr = isArray(range) ? range : [range, range];
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
             * @event Page#firstEnter
             */

            this.triggerEvent("firstEnter");
          }
          /**
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
             * @event Page#firstExit
             */

            this.triggerEvent("firstExit");
          }
          /**
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

        var sizeInfos = splitSpace(size);

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

      __proto.onCheck = function (rect) {
        if (rect === void 0) {
          rect = this.el ? this.el.getBoundingClientRect() : undefined;
        }

        if (rect) {
          var top = rect.top;
          var height$$1 = rect.height;
          var obj = {
            top: top,
            height: height$$1
          };
          var rangeStart = this.calcSize(this._range[0], obj);
          var rangeEnd = this.calcSize(this._range[1], obj);
          var marginTop = this.calcSize(this.margin[0], obj);
          var marginBottom = this.calcSize(this.margin[1], obj);

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
          return this.calcSize(splitBracket(size).value, rect);
        }

        var info = splitUnit(size);

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
//# sourceMappingURL=page.js.map
