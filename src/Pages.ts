import Page, { PageOptions } from "./Page";

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
class Pages extends Page {
  /**
   */
  constructor(options: PageOptions = {}) {
    super(undefined, options);
  }
}

export default Pages;
