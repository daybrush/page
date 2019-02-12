import Component from "@egjs/component";
import {splitSpace, splitUnit, isArray, $, isObject, splitBracket, IObject} from "@daybrush/utils";
import * as WindowSize from "./WindowSize";
import Pages from "./Pages";

/**
 * @memberof Page
 * @typedef EventParameter
 * @property {string} type - The name of event
 * @property {Element} target - An element that represents a page
 * @property {Page} currentTarget - The page on which the event occurred.
 */

/**
 * @memberof Page
 * @typedef
 */
export interface PageState {
  enter: boolean;
  firstEnter: boolean;
  firstExit: boolean;
}
/**
 * @memberof Page
 * @typedef
 */
export interface PageOptions {
  horizontal?: boolean;
  range?: number | string | Array<number | string>;
  margin?: number | string |  Array<number | string>;
  events?: string[];
}
/**
 * @memberof Page
 * @typedef
 */
export interface Rect {
  top: number;
  left: number;
  height: number;
  width: number;
}
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
class Page extends Component {
  public static s: typeof Pages;
  private ranges: IObject<Page> = {};
  private _range: Array<string | number> = [0, "100%"];
  private horizontal: boolean = false;
  private margin: Array<string | number> = [0, 0];
  private pages: Page[] = [];
  private el: Element | null;
  private state: PageState = {
    enter: false,
    firstEnter: false,
    firstExit: false,
  };
  /**
   */
  constructor(el?: string | Element, options: PageOptions = {}) {
    super();

    this.el = el ? (isObject(el) ? el : $(el)) : null;
    if ("range" in options) {
      const range = options.range!;
      const rangeArr = isArray(range) ? range : [range, range];

      this._range = rangeArr;
    }
    if ("margin" in options) {
      const margin = options.margin!;

      if (isArray(margin)) {
        this.margin = margin;
      } else {
        this.margin = [margin, margin];
      }
    }
    if ("events" in options) {
      options.events!.forEach(name => {
        if (name === "resize") {
          window.addEventListener("resize", this.resize);
        } else if (name === "scroll") {
          window.addEventListener("scroll", this.scroll);
        } else {
          this.el && this.el.addEventListener(name, this.scroll);
        }
      });
    }
    if ("horizontal" in options) {
      this.horizontal = options.horizontal!;
    }
  }
  /**
   */
  public add(page: Page) {
    this.pages.push(page);

    return this;
  }
  /**
   */
  public range(range: Array<string | number> | number | string = [0, "100%"], horizontal?: boolean) {
    const rangeArr = isArray(range) ? range : [range, range];
    const id = `[${rangeArr.join(",")}]`;

    if (this.ranges[id]) {
      return this.ranges[id];
    }
    const page = new Page(this.el!, {
      range: rangeArr,
      horizontal: horizontal!,
    });

    this.ranges[id] = page;
    this.add(page);
    return page;
  }
  /**
   * @method
   */
  public scroll = () => {
    this.triggerEvent("scroll");
    this.onCheck();
  }
  /**
   * @method
   */
  public resize = () => {
    this.triggerEvent("resize");
    this.onCheck();
  }
  public triggerEvent(name: string) {
    this.trigger(name, {
      target: this.el,
    });
  }
  public onEnter(rect: Rect) {
    const state = this.state;

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
    this.pages.forEach(page => {
      page.onCheck(page.el === this.el ? rect : undefined);
    });
  }
  public onExit() {
    const state = this.state;

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
    this.pages.forEach(page => {
      page.onExit();
    });
  }
  public calcSize(size: string | number, rect: Rect) {
    if (typeof size === "number") {
      return size;
    }
    const sizeInfos: Array<string | number> = splitSpace(size);

    if (!sizeInfos) {
      return 0;
    }
    const length = sizeInfos.length;
    const stack: number[] = [];
    let sign = 1;

    for (let i = 0; i < length; ++i) {
      const v = sizeInfos[i];

      if (v === "+") {
        sign = 1;
      } else if (v === "-") {
        sign = -1;
      } else if (v === "*") {
        stack.push((stack.pop()! || 0) * this._calcSize(sizeInfos[i + 1], rect));
        ++i;
      } else if (v === "/") {
        stack.push((stack.pop()! || 0) / this._calcSize(sizeInfos[i + 1], rect));
        ++i;
      } else {
        stack.push(sign * this._calcSize(v, rect));
        sign = 1;
      }
    }
    return stack.reduce((prev, cur) => {
      return prev + cur;
    }, 0);
  }
  /**
   */
  public getRect(isAbsolute?: boolean): Rect | undefined {
    const rect = this.el ? this.el.getBoundingClientRect() : undefined;

    if (!rect) {
      return;
    }
    const width = rect.width;
    const height = rect.height;
    const left = rect.left + (isAbsolute ? document.body.scrollLeft || document.documentElement.scrollLeft : 0);
    const top = rect.top + (isAbsolute ? document.body.scrollTop || document.documentElement.scrollTop : 0);

    return {top, left, width, height};
  }
  public onCheck(rect: Rect | undefined = this.getRect()) {
    if (rect) {
      const horizontal = this.horizontal;
      const pos = rect[horizontal ? "left" : "top"];
      const containerSize =  WindowSize[horizontal ? "width" : "height"];

      const rangeStart = this.calcSize(this._range[0], rect);
      const rangeEnd = this.calcSize(this._range[1], rect);
      const marginStart = this.calcSize(this.margin[0], rect);
      const marginEnd = this.calcSize(this.margin[1], rect);

      if (pos + rangeEnd + marginEnd <= 0 || pos + rangeStart - marginStart >= containerSize) {
        this.onExit();
      } else {
        this.onEnter(rect);
      }
    } else {
      this.pages.forEach(page => {
        page.onCheck();
      });
    }
  }
  private _calcSize(size: string | number, rect: Rect) {
    if (!size) {
      return 0;
    }
    if (typeof size === "number") {
      return size;
    }
    const horizontal = this.horizontal;
    const sizeName = horizontal ? "width" : "height";

    if (size === "window") {
      return WindowSize[sizeName];
    }
    if (size.indexOf("(") > -1) {
      return this.calcSize(splitBracket(size).value!, rect);
    }
    const info = splitUnit(size);

    if (info.unit === "%") {
      return rect[sizeName] * info.value / 100;
    } else {
      return info.value;
    }
  }
}

export default Page;
