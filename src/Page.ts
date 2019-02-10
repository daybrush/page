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
  range?: Array<number | string>;
  margin?: number | string |  Array<number | string>;
  events?: string[];
}
/**
 * @memberof Page
 * @typedef
 */
export interface Rect {
  top: number;
  height: number;
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
      this._range = options.range!;
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
  }
  /**
   */
  public add(page: Page) {
    this.pages.push(page);

    return this;
  }
  /**
   */
  public range(range: Array<string | number> | number | string = [0, "100%"]) {
    const rangeArr = isArray(range) ? range : [range, range];
    const id = `[${rangeArr.join(",")}]`;

    if (this.ranges[id]) {
      return this.ranges[id];
    }
    const page = new Page(this.el!, {
      range: rangeArr,
    });

    this.ranges[id] = page;
    this.add(page);
    return page;
  }
  /**
   * @method
   */
  public scroll = () => {
    this.onCheck();
  }
  /**
   * @method
   */
  public resize = () => {
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
  public onCheck(rect: Rect | undefined = this.el ? this.el.getBoundingClientRect() : undefined) {
    if (rect) {
      const top = rect.top;
      const height = rect.height;
      const obj = {top, height};

      const rangeStart = this.calcSize(this._range[0], obj);
      const rangeEnd = this.calcSize(this._range[1], obj);
      const marginTop = this.calcSize(this.margin[0], obj);
      const marginBottom = this.calcSize(this.margin[1], obj);

      if (top + rangeEnd + marginBottom <= 0 || top + rangeStart - marginTop >= WindowSize.height) {
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
    if (size === "window") {
      return WindowSize.height;
    }
    if (size.indexOf("(") > -1) {
      return this.calcSize(splitBracket(size).value!, rect);
    }
    const info = splitUnit(size);

    if (info.unit === "%") {
      return rect.height * info.value / 100;
    } else {
      return info.value;
    }
  }
}

export default Page;
